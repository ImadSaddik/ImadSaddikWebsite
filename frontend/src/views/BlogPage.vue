<template>
  <component v-if="blogToDisplay" :is="blogToDisplay" :key="slug" @show-toast="handleShowToastEvent" />
</template>

<script>
// Third-party libraries
import axios from "axios";
import { defineAsyncComponent } from "vue";

// Constants
import { OTHER_PAGES_VISITED_KEY } from "@/constants.js";

export default {
  name: "BlogPage",
  emits: ["show-toast", "page-visited"],
  props: {
    slug: { type: String, required: true },
  },
  data() {
    return {
      blogToDisplay: null,
    };
  },
  watch: {
    slug: {
      immediate: true,
      async handler(newSlug) {
        this.blogToDisplay = defineAsyncComponent(() => import(`@/blogs/${newSlug}`));
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
    async incrementBlogViewCount() {
      try {
        const response = await axios.patch(`/api/articles/${this.slug}/increment-view-count`, {
          timeout: 10_000,
        });
        const { success, message } = response.data;
        if (!success) {
          throw new Error(`Failed to increment blog view count: ${message}`);
        }
      } catch {
        this.$emit("show-toast", {
          message: "Failed to increment blog view count",
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped></style>
