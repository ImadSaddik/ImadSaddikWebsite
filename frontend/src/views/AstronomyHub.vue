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

export default {
  name: "AstronomyHub",
  emits: ["show-toast"],
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "astronomy-post",
    };
  },
};
</script>

<style scoped></style>
