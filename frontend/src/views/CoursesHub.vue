<template>
  <ArticlesHub
    article-title="Courses"
    search-placeholder="What courses are you curious about today?"
    sort-placeholder="Show me courses sorted by..."
    :article-type="ARTICLE_TYPES.COURSE"
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
  name: "CoursesHub",
  components: {
    ArticlesHub,
  },
  emits: ["show-toast", "page-visited"],
  setup(props, { emit }) {
    useHubPage({
      pageKey: PAGE_KEYS.COURSES,
      title: "Courses by Imad Saddik",
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

<style scoped></style>
