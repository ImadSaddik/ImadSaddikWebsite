<template>
  <ArticlesHub
    article-title="Blogs"
    search-placeholder="What blogs are you curious about today?"
    sort-placeholder="Show me blogs sorted by..."
    :article-type="articleType"
    @show-toast="$emit('show-toast', $event)"
  />
</template>

<script>
// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

// Constants
import { BLOGS_PAGE_VISITED_KEY } from "@/constants.js";

export default {
  name: "BlogHub",
  emits: ["show-toast", "page-visited"],
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "blog-post",
    };
  },
  mounted() {
    this.$emit("page-visited", BLOGS_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
