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
import { PAGE_KEYS } from "@/constants";

// Utils
import { trackVisitorData } from "@/utils";

export default {
  name: "AstronomyHub",
  components: {
    ArticlesHub,
  },
  emits: ["show-toast", "page-visited"],
  data() {
    return {
      articleType: "astronomy-post",
    };
  },
  mounted() {
    document.title = "Astronomy with Imad Saddik";
    this.$emit("page-visited", PAGE_KEYS.ASTRONOMY);
    trackVisitorData(PAGE_KEYS.ASTRONOMY);
  },
};
</script>

<style scoped></style>
