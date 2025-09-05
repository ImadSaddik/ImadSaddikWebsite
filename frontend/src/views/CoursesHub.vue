<template>
  <ArticlesHub
    article-title="Courses"
    search-placeholder="What courses are you curious about today?"
    sort-placeholder="Show me courses sorted by..."
    :article-type="articleType"
    @show-toast="$emit('show-toast', $event)"
  />
</template>

<script>
// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

// Constants
import { COURSES_PAGE_VISITED_KEY } from "@/constants.js";

export default {
  name: "CoursesHub",
  emits: ["show-toast", "page-visited"],
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "course-post",
    };
  },
  mounted() {
    this.$emit("page-visited", COURSES_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
