<template>
  <ArticlesHub
    article-title="Blogs"
    search-placeholder="What blogs are you curious about today?"
    sort-placeholder="Show me blogs sorted by..."
    :article-type="ARTICLE_TYPES.BLOG"
    @show-toast="$emit('show-toast', $event)"
  />
</template>

<script>
// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

// Constants
import { PAGE_KEYS, ARTICLE_TYPES } from "@/constants";

// Utils
import { useHubPage } from "@/composables/useHubPage";

export default {
  name: "BlogHub",
  components: {
    ArticlesHub,
  },
  emits: ["show-toast", "page-visited"],
  setup(props, { emit }) {
    useHubPage({
      pageKey: PAGE_KEYS.BLOGS,
      title: "Blogs by Imad Saddik",
      emit,
    });
  },
  data() {
    return {
      ARTICLE_TYPES,
    };
  },
};
</script>
