<template>
  <component
    v-if="astronomyArticleToDisplay"
    :is="astronomyArticleToDisplay"
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

export default {
  name: "AstronomyPage",
  emits: ["show-toast", "page-visited"],
  props: {
    slug: { type: String, required: true },
  },
  data() {
    return {
      astronomyArticleToDisplay: null,
    };
  },
  watch: {
    slug: {
      immediate: true,
      async handler(newSlug) {
        this.astronomyArticleToDisplay = defineAsyncComponent(() => import(`@/astronomy/${newSlug}`));
        this.incrementAstronomyArticleViewCount();
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
      this.incrementAstronomyArticleReadCount();
    },
    async incrementAstronomyArticleViewCount() {
      try {
        const response = await axios.patch(`/api/articles/${this.slug}/increment-view-count`, {
          timeout: 10_000,
        });
        const { success, message } = response.data;
        if (!success) {
          this.$emit("show-toast", {
            message: `Failed to increment blog view count: ${message}`,
            type: "error",
          });
        }
      } catch {
        this.$emit("show-toast", {
          message: "Failed to increment blog view count",
          type: "error",
        });
      }
    },
    async incrementAstronomyArticleReadCount() {
      try {
        const response = await axios.patch(`/api/articles/${this.slug}/increment-read-count`, {
          timeout: 10_000,
        });
        const { success, message } = response.data;
        if (!success) {
          throw new Error(`Failed to increment blog read count: ${message}`);
        }
      } catch {
        this.$emit("show-toast", {
          message: "Failed to increment blog read count",
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped></style>
