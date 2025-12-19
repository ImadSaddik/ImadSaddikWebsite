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
      @show-toast="handleShowToastEvent"
    />

    <div class="article-body-wrapper">
      <div class="article-body" :class="{ wide: wideArticlesEnabled }">
        <slot></slot>
        <EditArticleOnGitHub :slug="slug" :article-type="articleType" />
      </div>

      <TableOfContents />
    </div>

    <div class="clap-container">
      <button class="clap-button" :disabled="userClapCount >= maxPossibleClaps || isClapping" @click="handleClap">
        <i class="fa-solid fa-hands-clapping"></i>
        <span>{{ totalClapCount }}</span>

        <div v-if="showClapAnimation" :key="userClapCount" class="clap-animation-circle" @animationend="onAnimationEnd">
          +{{ userClapCount }}
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
import { getCardsDataFromDocumentHits } from "@/utils.js";

// Components
import ArticleHeader from "@/components/ArticleHeader.vue";
import ArticleFooter from "@/components/ArticleFooter.vue";
import EditArticleOnGitHub from "./EditArticleOnGitHub.vue";
import TableOfContents from "./TableOfContents.vue";

export default {
  name: "ArticleLayout",
  components: {
    ArticleHeader,
    ArticleFooter,
    EditArticleOnGitHub,
    TableOfContents,
  },
  inject: ["wideArticlesEnabled"],
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
  emits: ["show-toast"],
  data() {
    return {
      cardData: [],
      totalClapCount: 0,
      maxPossibleClaps: 30,
      userClapCount: 0,
      isClapping: false,
      showClapAnimation: false,
    };
  },
  async mounted() {
    await this.getArticleRecommendations();
    await this.getInitialClapCount();
  },
  methods: {
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
    async getInitialClapCount() {
      try {
        const response = await axios.get(`/api/articles/${this.slug}/claps-count`);
        const { success, claps_count } = response.data;

        if (success) {
          this.totalClapCount = claps_count;
        } else {
          throw new Error("Failed to fetch initial clap count");
        }
      } catch (error) {
        this.$emit("show-toast", {
          message: "Failed to fetch initial clap count",
          type: "error",
        });
      }
    },
    async getArticleRecommendations() {
      try {
        const response = await axios.post("/api/articles/recommendations", {
          documentNameToIgnore: this.slug,
          articleType: this.articleType,
          documentTags: this.articleTags,
        });

        const recommendations = response.data;
        const hits = recommendations?.hits || [];
        this.cardData = getCardsDataFromDocumentHits({
          hits,
          articleType: this.articleType,
        });
      } catch (error) {
        this.$emit("show-toast", { message: "Failed to fetch article recommendations", type: "error" });
      }
    },
    async handleClap() {
      if (this.isClapping || this.userClapCount >= this.maxPossibleClaps) {
        return;
      }

      this.isClapping = true;

      try {
        const response = await axios.patch(`/api/articles/${this.slug}/increment-claps-count`, {
          timeout: 10_000,
        });

        const { success, message, claps_count } = response.data;

        if (success) {
          this.totalClapCount = claps_count;
          this.userClapCount += 1;
          this.showClapAnimation = true;
        } else {
          this.$emit("show-toast", {
            message: `Failed to increment clap count: ${message}`,
            type: "error",
          });
        }
      } catch (error) {
        this.$emit("show-toast", {
          message: "Failed to increment clap count",
          type: "error",
        });
      } finally {
        this.isClapping = false;
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
