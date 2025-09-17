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
      @show-toast="handleShowToastEvent"
    />

    <div class="article-body">
      <slot></slot>
      <EditArticleOnGitHub :slug="slug" />
    </div>

    <ArticleFooter :card-data="cardData" />
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

export default {
  name: "ArticleLayout",
  emits: ["show-toast"],
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
      required: true,
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
  components: {
    ArticleHeader,
    ArticleFooter,
    EditArticleOnGitHub,
  },
  data() {
    return {
      cardData: [],
    };
  },
  async mounted() {
    await this.getArticleRecommendations();
  },
  methods: {
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
    async getArticleRecommendations() {
      try {
        const response = await axios.post("/api/articles/recommendations", {
          documentNameToIgnore: this.slug,
          articleType: this.articleType,
        });

        const recommendations = response.data;
        const hits = recommendations?.hits || [];
        this.cardData = getCardsDataFromDocumentHits({
          hits,
          articleType: this.articleType,
        });
      } catch (error) {
        this.$emit("show-toast", { message: error.response.data.detail, type: "error" });
      }
    },
  },
};
</script>

<style scoped>
.article-body {
  width: 75%;
}

.article-container {
  padding: var(--gap-xl);
  margin-top: var(--gap-xxl);
}

.article-body :deep(.article-body-header) {
  font-size: var(--font-size-big-medium);
  margin: var(--gap-md) 0;
}

.article-body :deep(.article-body-subheader) {
  font-size: var(--font-size-medium);
  margin: var(--gap-md) 0;
}

.article-body :deep(p) {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

@media screen and (max-width: 1500px) {
  .article-body {
    width: 100%;
  }
}

@media screen and (max-width: 1100px) {
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
