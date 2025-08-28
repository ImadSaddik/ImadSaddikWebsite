<template>
  <ArticlesHub
    article-title="Blogs"
    search-placeholder="What blogs are you curious about today?"
    sort-placeholder="Show me blogs sorted by..."
    :article-type="articleType"
  />
</template>

<script>
// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

export default {
  name: "BlogHub",
  emits: ["show-toast"],
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "blog-post",
    };
  },
};
</script>

<style scoped></style>
