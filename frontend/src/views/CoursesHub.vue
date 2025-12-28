<template>
  <ArticlesHub
    article-title="Courses"
    search-placeholder="What courses are you curious about today?"
    sort-placeholder="Show me courses sorted by..."
    article-type="course-post"
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
};
</script>

<style scoped></style>
