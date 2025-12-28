<template>
  <ArticlesHub
    article-title="Astronomy"
    search-placeholder="What astronomy articles are you curious about today?"
    sort-placeholder="Show me astronomy articles sorted by..."
    article-type="astronomy-post"
    @show-toast="$emit('show-toast', $event)"
  />
</template>

<script>
// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

// Constants
import { PAGE_KEYS } from "@/constants";

// Utils
import { useHubPage } from "@/composables/useHubPage";

export default {
  name: "AstronomyHub",
  components: {
    ArticlesHub,
  },
  emits: ["show-toast", "page-visited"],
  setup(props, { emit }) {
    useHubPage({
      pageKey: PAGE_KEYS.ASTRONOMY,
      title: "Astronomy with Imad Saddik",
      emit,
    });
  },
};
</script>
