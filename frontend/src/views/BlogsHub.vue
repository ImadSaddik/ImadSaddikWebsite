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

// Utils
import { trackVisitorData } from "@/utils.js";

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
    document.title = "Blogs by Imad Saddik";
    this.$emit("page-visited", BLOGS_PAGE_VISITED_KEY);
    trackVisitorData(BLOGS_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
