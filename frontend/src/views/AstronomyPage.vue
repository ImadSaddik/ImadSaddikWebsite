<template>
  <component
    :is="astronomyArticleToDisplay"
    v-if="astronomyArticleToDisplay"
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
import { PAGE_KEYS } from "@/constants";
import { astronomyArticles } from "@/assetRegistry.js";

export default {
  name: "AstronomyPage",
  props: {
    slug: { type: String, required: true },
  },
  emits: ["show-toast", "page-visited"],
  data() {
    return {
      astronomyArticleToDisplay: null,
    };
  },
  watch: {
    slug: {
      immediate: true,
      async handler(newSlug) {
        const path = `/src/astronomy/${newSlug}/index.vue`;
        if (astronomyArticles[path]) {
          this.astronomyArticleToDisplay = defineAsyncComponent(astronomyArticles[path]);
          this.incrementAstronomyArticleViewCount();
        }
      },
    },
  },
  mounted() {
    this.$emit("page-visited", PAGE_KEYS.OTHER);
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
    async incrementAstronomyArticleReadCount() {
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
