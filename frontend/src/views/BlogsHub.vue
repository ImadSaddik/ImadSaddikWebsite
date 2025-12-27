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
import { PAGE_KEYS } from "@/constants";

// Utils
import { trackVisitorData } from "@/utils";

export default {
  name: "BlogHub",
  components: {
    ArticlesHub,
  },
  emits: ["show-toast", "page-visited"],
  data() {
    return {
      articleType: "blog-post",
    };
  },
  mounted() {
    document.title = "Blogs by Imad Saddik";
    this.$emit("page-visited", PAGE_KEYS.BLOGS);
    trackVisitorData(PAGE_KEYS.BLOGS);
  },
};
</script>

<style scoped></style>
