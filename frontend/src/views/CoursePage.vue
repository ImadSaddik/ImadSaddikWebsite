<template>
  <component
    :is="courseArticleToDisplay"
    v-if="courseArticleToDisplay"
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
import { courseArticles } from "@/assetRegistry.js";

export default {
  name: "CoursePage",
  props: {
    slug: { type: String, required: true },
  },
  emits: ["show-toast", "page-visited"],
  data() {
    return {
      courseArticleToDisplay: null,
    };
  },
  watch: {
    slug: {
      immediate: true,
      async handler(newSlug) {
        const path = `/src/courses/${newSlug}/index.vue`;
        if (courseArticles[path]) {
          this.courseArticleToDisplay = defineAsyncComponent(courseArticles[path]);
        }
        this.incrementCourseArticleViewCount();
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
      this.incrementCourseArticleReadCount();
    },
    async incrementCourseArticleViewCount() {
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
    async incrementCourseArticleReadCount() {
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
