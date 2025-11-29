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

// Utils
import { trackVisitorData } from "@/utils.js";

export default {
  name: "CoursesHub",
  components: {
    ArticlesHub,
  },
  emits: ["show-toast", "page-visited"],
  data() {
    return {
      articleType: "course-post",
    };
  },
  mounted() {
    document.title = "Courses by Imad Saddik";
    this.$emit("page-visited", COURSES_PAGE_VISITED_KEY);
    trackVisitorData(COURSES_PAGE_VISITED_KEY);
  },
};
</script>

<style scoped></style>
