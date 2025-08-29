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

export default {
  name: "CoursesHub",
  emits: ["show-toast"],
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "course-post",
    };
  },
};
</script>

<style scoped></style>
