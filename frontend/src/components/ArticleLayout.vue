<template>
  <section class="article-container">
    <ArticleHeader
      :title="title"
      :sub-title="subTitle"
      :article-tags="articleTags"
      :cover-image="coverImage"
      :creation-date="creationDate"
      :reading-time="readingTime"
      :markdown-content="markdownContent"
      :article-type="articleType"
    />

    <div class="article-body-wrapper">
      <div class="article-body" :class="{ wide: wideArticlesEnabled }">
        <slot></slot>
        <EditArticleOnGitHub :slug="slug" :article-type="articleType" />
      </div>

      <TableOfContents />
    </div>

    <div class="clap-container">
      <button class="clap-button" :disabled="hasReachedMaxClaps" @click="handleClap">
        <i class="fa-solid fa-hands-clapping"></i>
        <span>{{ totalClapCount }}</span>

        <div v-if="showClapAnimation" :key="clapsGiven" class="clap-animation-circle" @animationend="onAnimationEnd">
          +{{ clapsGiven }}
        </div>
      </button>
    </div>

    <ArticleFooter :card-data="cardData" :article-type="articleType" />
  </section>
</template>

<script>
// Third-party libraries
import axios from "axios";

// Utils
import { getCardsDataFromDocumentHits } from "@/utils";

// Components
import ArticleHeader from "@/components/ArticleHeader.vue";
import ArticleFooter from "@/components/ArticleFooter.vue";
import EditArticleOnGitHub from "./EditArticleOnGitHub.vue";
import TableOfContents from "./TableOfContents.vue";

// Composables
import { useArticleTracking } from "@/composables/useArticleTracking";

// Constants
import { CLAP_DEBOUNCE_MILLISECONDS } from "@/constants";

export default {
  name: "ArticleLayout",
  components: {
    ArticleHeader,
    ArticleFooter,
    EditArticleOnGitHub,
    TableOfContents,
  },
  inject: ["wideArticlesEnabled", "showToast"],
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    articleTags: {
      type: Array,
      default: () => [],
    },
    coverImage: {
      type: String,
      required: true,
    },
    creationDate: {
      type: String,
      required: true,
    },
    readingTime: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    markdownContent: {
      type: String,
      required: true,
    },
    articleType: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { incrementClapCount, fetchInitialClapCount } = useArticleTracking();
    return { incrementClapCount, fetchInitialClapCount };
  },
  data() {
    return {
      cardData: [],
      clapsGiven: 0,
      queuedClaps: 0,
      totalClapCount: 0,
      maxPossibleClaps: 30,
      clapDebounceTimer: null,
      showClapAnimation: false,
      pagehideHandler: null,
    };
  },
  computed: {
    hasReachedMaxClaps() {
      return this.clapsGiven >= this.maxPossibleClaps;
    },
  },
  async mounted() {
    await this.getArticleRecommendations();
    await this.loadInitialClaps();

    this.pagehideHandler = () => this.submitQueuedClapsOnPageHide();
    window.addEventListener("pagehide", this.pagehideHandler);
  },
  beforeUnmount() {
    window.removeEventListener("pagehide", this.pagehideHandler);
    this.cleanupClapTimerAndSubmitRemainingClaps();
  },
  methods: {
    async getArticleRecommendations() {
      try {
        const response = await axios.post("/api/articles/recommendations", {
          document_name_to_ignore: this.slug,
          article_type: this.articleType,
          document_tags: this.articleTags,
        });

        const recommendations = response.data;
        const hits = recommendations?.hits || [];
        this.cardData = getCardsDataFromDocumentHits({
          hits,
          articleType: this.articleType,
        });
      } catch (error) {
        if (error.response && error.response.status === 429) {
          this.showToast({
            message: "Are you a bot? Take a tiny break while I cool down the recommendation engine.",
            type: "warning",
          });
        } else {
          this.showToast({
            message: "Failed to fetch article recommendations",
            type: "error",
          });
        }
      }
    },
    async loadInitialClaps() {
      const count = await this.fetchInitialClapCount(this.slug);
      if (count !== null) {
        this.totalClapCount = count;
      }
    },
    cleanupClapTimerAndSubmitRemainingClaps() {
      if (!this.clapDebounceTimer) return;

      clearTimeout(this.clapDebounceTimer);
      if (this.queuedClaps > 0) {
        this.submitClapChanges();
      }
    },
    submitQueuedClapsOnPageHide() {
      if (this.queuedClaps <= 0) return;

      clearTimeout(this.clapDebounceTimer);
      const count = this.queuedClaps;
      this.queuedClaps = 0;
      this.clapDebounceTimer = null;

      fetch(`/api/articles/${this.slug}/increment-claps-count`, {
        keepalive: true,
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ count }),
      });
    },
    handleClap() {
      if (this.hasReachedMaxClaps) {
        return;
      }

      this.clapsGiven += 1;
      this.queuedClaps += 1;
      this.totalClapCount += 1;
      this.showClapAnimation = true;

      clearTimeout(this.clapDebounceTimer);
      this.clapDebounceTimer = setTimeout(() => this.submitClapChanges(), CLAP_DEBOUNCE_MILLISECONDS);
    },
    async submitClapChanges() {
      const count = this.queuedClaps;
      this.queuedClaps = 0;
      this.clapDebounceTimer = null;

      const data = await this.incrementClapCount(this.slug, count);
      if (data) {
        // Sync the total clap count with the server's response.
        this.totalClapCount = data.claps_count;
      } else {
        // If the API call fails, undo the claps the user made.
        this.clapsGiven -= count;
        this.totalClapCount -= count;
      }
    },
    onAnimationEnd() {
      this.showClapAnimation = false;
    },
  },
};
</script>

<style scoped>
.article-body-wrapper {
  display: flex;
  position: relative;
}

.article-body {
  width: 50%;
  transition: width 0.3s;
}

.article-body.wide {
  width: 75%;
}

.article-container {
  padding: var(--gap-xl);
  margin-top: var(--gap-2xl);
}

.article-body :deep(.article-body-header) {
  font-size: var(--font-size-big-medium);
  margin: var(--gap-md) 0;
}

.article-body :deep(.article-body-subheader) {
  font-size: var(--font-size-medium);
  margin: var(--gap-md) 0;
}

.article-body :deep(.article-body-sub-subheader) {
  font-size: var(--font-size-big-small);
  margin: var(--gap-md) 0;
}

.article-body :deep(p) {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

.clap-container {
  display: flex;
  margin: 2rem 0;
}

.clap-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: var(--font-size-big-medium);
  color: var(--color-secondary);
  transition: color 0.3s ease;
}

.clap-button:active {
  color: var(--color-secondary-hover);
}

.clap-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clap-animation-circle {
  position: absolute;
  top: -10px;
  left: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: white;
  background-color: var(--color-primary);
  border-radius: 50%;
  font-size: var(--font-size-extra-small);
  font-weight: bold;
  pointer-events: none;
  animation: clapRiseAndFade 1.5s ease-out forwards;
}

@keyframes clapRiseAndFade {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 1;
  }
  15% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  70% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) scale(0.5);
    opacity: 0;
  }
}

@media (hover: hover) and (pointer: fine) {
  .clap-button:hover {
    color: var(--color-secondary-hover);
  }
}

@media screen and (max-width: 1300px) {
  .article-body,
  .article-body.wide {
    width: 65%;
  }
}

@media screen and (max-width: 1100px) {
  .article-body,
  .article-body.wide {
    width: 100%;
  }

  .article-body :deep(.article-body-header) {
    font-size: var(--font-size-medium);
  }

  .article-body :deep(.article-body-subheader) {
    font-size: var(--font-size-big-small);
  }

  .article-container {
    padding: var(--gap-lg);
    margin-top: var(--gap-md);
  }
}

@media screen and (max-width: 768px) {
  .article-container {
    padding: var(--gap-md);
  }
}
</style>
