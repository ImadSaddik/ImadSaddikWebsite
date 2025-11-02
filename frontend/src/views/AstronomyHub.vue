<template>
  <ArticlesHub
    article-title="Astronomy"
    search-placeholder="What astronomy articles are you curious about today?"
    sort-placeholder="Show me astronomy articles sorted by..."
    :article-type="articleType"
    @show-toast="$emit('show-toast', $event)"
  />
</template>

<script>
// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

// Constants
import { ASTRONOMY_PAGE_VISITED_KEY } from "@/constants.js";

// Utils
import { trackVisitorData } from "@/utils.js";

export default {
  name: "AstronomyHub",
  emits: ["show-toast", "page-visited"],
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "astronomy-post",
    };
  },
  mounted() {
    document.title = "Astronomy with Imad Saddik";
    this.$emit("page-visited", ASTRONOMY_PAGE_VISITED_KEY);
    trackVisitorData(ASTRONOMY_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
