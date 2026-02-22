<template>
  <div v-if="loading" class="loading-container">
    <i class="fa-solid fa-circle-notch fa-spin"></i>
    <p>Loading article</p>
  </div>

  <ArticleLayout
    v-else-if="MarkdownComponent"
    :article-type="articleType"
    :article-tags="frontmatter.tags"
    :creation-date="frontmatter.date"
    :cover-image="pathToCoverImage"
    :markdown-content="articleRawContent"
    :reading-time="readingTime"
    :sub-title="frontmatter.subtitle"
    :slug="slug"
    :title="frontmatter.title"
  >
    <component :is="MarkdownComponent" />
  </ArticleLayout>

  <div v-else class="error-container">
    <p>Article not found.</p>
  </div>
</template>

<script>
// Third-party libraries
import { markRaw } from "vue";

// Utils
import { calculateReadingTime } from "@/utils";

// Composables
import { ARTICLE_COVER_IMAGE_REGISTRY } from "@/registries/images.js";

// Constants
import { ROUTES } from "@/constants";
import { ARTICLE_MARKDOWN_REGISTRY } from "@/registries/articles.js";
import { ARTICLE_READ_THRESHOLD, MILLISECONDS_PER_MINUTE, DEFAULT_ARTICLE_TITLE, PAGE_KEYS } from "@/constants";

export default {
  name: "ArticlePage",
  props: {
    slug: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      required: true,
    },
    articleType: {
      type: String,
      required: true,
    },
  },
  emits: ["page-visited"],
  data() {
    return {
      articleRawContent: "",
      frontmatter: {},
      loading: true,
      MarkdownComponent: null,
      readingTime: 0,
    };
  },
  computed: {
    pathToContentMD() {
      return `/src/${this.folder}/${this.slug}/content.md`;
    },
    pathToCoverImage() {
      const imagePath = `/src/${this.folder}/${this.slug}/coverImage.svg`;
      return ARTICLE_COVER_IMAGE_REGISTRY[this.folder]?.[imagePath];
    },
  },
  watch: {
    slug: {
      immediate: true,
      handler: "loadArticle",
    },
    frontmatter: {
      handler(newFrontmatter) {
        document.title = newFrontmatter.title ? newFrontmatter.title : DEFAULT_ARTICLE_TITLE;
      },
      deep: true,
    },
  },
  mounted() {
    this.$emit("page-visited", PAGE_KEYS.OTHER);
  },
  methods: {
    async loadArticle() {
      this.resetArticleState();

      try {
        const contentLoaders = this.validateAndGetContentLoaders();
        const { loadRenderable, loadSource } = this.getArticleLoaders(contentLoaders);

        await this.loadArticleMetadata(loadRenderable);
        await this.processArticleContent(loadSource);

        this.scheduleReadCountIncrement();
      } catch (error) {
        this.handleLoadError(error);
      } finally {
        this.loading = false;
      }
    },
    resetArticleState() {
      this.articleRawContent = "";
      this.frontmatter = {};
      this.loading = true;
      this.MarkdownComponent = null;
      this.readingTime = 0;
    },
    validateAndGetContentLoaders() {
      const contentLoaders = ARTICLE_MARKDOWN_REGISTRY[this.folder];
      if (!contentLoaders) {
        throw new Error(`Invalid folder type: ${this.folder}`);
      }
      return contentLoaders;
    },
    getArticleLoaders(contentLoaders) {
      const loadRenderable = contentLoaders.renderable[this.pathToContentMD];
      const loadSource = contentLoaders.source[this.pathToContentMD];

      if (!loadRenderable || !loadSource) {
        throw new Error(`Article not found at path: ${this.pathToContentMD}`);
      }

      return { loadRenderable, loadSource };
    },
    async loadArticleMetadata(loadRenderable) {
      const articleComponent = await loadRenderable();
      this.MarkdownComponent = markRaw(articleComponent.default);

      // Frontmatter fields are not available as a single `frontmatter` property on
      // the article component. Instead, they are exposed as top-level named exports
      // (e.g., title, date, tags) alongside the default export (the component).
      // We use the rest operator to extract all named exports except `default`
      // into the frontmatter object.
      const { default: _, ...rest } = articleComponent;
      this.frontmatter = rest;
    },
    async processArticleContent(loadSource) {
      const articleRawContent = await loadSource();
      this.articleRawContent = articleRawContent;
      this.readingTime = calculateReadingTime(articleRawContent);
    },
    scheduleReadCountIncrement() {
      const thresholdMilliseconds = this.readingTime * ARTICLE_READ_THRESHOLD * MILLISECONDS_PER_MINUTE;
      setTimeout(() => {
        this.$emit("article-read");
      }, thresholdMilliseconds);
    },
    handleLoadError(error) {
      console.error("Failed to load article:", error);
      this.$router.replace({ name: ROUTES.NOT_FOUND.name });
    },
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  gap: var(--gap-md);
}

.loading-container i {
  color: var(--color-secondary);
  font-size: var(--font-size-big);
}

.error-container {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
}
</style>
