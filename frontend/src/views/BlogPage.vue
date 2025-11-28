<template>
  <component
    :is="blogToDisplay"
    v-if="blogToDisplay"
    :key="slug"
    @show-toast="handleShowToastEvent"
    @article-read="handleArticleReadEvent"
  />
</template>

<script>
// Third-party libraries
import axios from "axios";
import { defineAsyncComponent } from "vue";

// Constants
import { OTHER_PAGES_VISITED_KEY } from "@/constants.js";
import { blogArticles } from "@/articles.js";

export default {
  name: "BlogPage",
  props: {
    slug: { type: String, required: true },
  },
  emits: ["show-toast", "page-visited"],
  data() {
    return {
      blogToDisplay: null,
    };
  },
  watch: {
    slug: {
      immediate: true,
      async handler(newSlug) {
        const path = `/src/blogs/${newSlug}/index.vue`;
        if (blogArticles[path]) {
          this.blogToDisplay = defineAsyncComponent(blogArticles[path]);
        }
        this.incrementBlogViewCount();
      },
    },
  },
  mounted() {
    this.$emit("page-visited", OTHER_PAGES_VISITED_KEY);
  },
  methods: {
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
    handleArticleReadEvent() {
      this.incrementBlogReadCount();
    },
    async incrementBlogViewCount() {
      try {
        const response = await axios.patch(`/api/articles/${this.slug}/increment-view-count`, {
          timeout: 10_000,
        });
        const { success, message } = response.data;
        if (!success) {
          this.$emit("show-toast", {
            message: `Failed to increment article view count: ${message}`,
            type: "error",
          });
        }
      } catch {
        this.$emit("show-toast", {
          message: "Failed to increment article view count",
          type: "error",
        });
      }
    },
    async incrementBlogReadCount() {
      try {
        const response = await axios.patch(`/api/articles/${this.slug}/increment-read-count`, {
          timeout: 10_000,
        });
        const { success, message } = response.data;
        if (!success) {
          throw new Error(`Failed to increment article read count: ${message}`);
        }
      } catch {
        this.$emit("show-toast", {
          message: "Failed to increment article read count",
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped></style>
