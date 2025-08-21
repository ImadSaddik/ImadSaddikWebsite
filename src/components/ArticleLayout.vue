<template>
  <section class="article-container">
    <ArticleHeader
      :title="title"
      :sub-title="subTitle"
      :article-tags="articleTags"
      :cover-image="coverImage"
      :creation-date="creationDate"
      :reading-time="readingTime"
      @show-toast="handleShowToast"
    />

    <div class="article-body">
      <slot></slot>
    </div>

    <ArticleFooter :card-data="relatedBlogsCardData" />
  </section>
</template>

<script>
import ArticleHeader from "@/components/ArticleHeader.vue";
import ArticleFooter from "@/components/ArticleFooter.vue";

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
    relatedBlogsCardData: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  components: {
    ArticleHeader,
    ArticleFooter,
  },
  methods: {
    handleShowToast(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped>
.article-body {
  width: 50%;
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
