<template>
  <component
    :is="articleToDisplay"
    v-if="articleToDisplay"
    :key="slug"
    @show-toast="$emit('show-toast', $event)"
    @article-read="handleArticleRead"
  />
</template>

<script>
import { courseArticles } from "@/registries/articles.js";
import { useArticleLoader } from "@/composables/useArticleLoader";

export default {
  name: "CoursePage",
  props: {
    slug: { type: String, required: true },
  },
  emits: ["show-toast", "page-visited"],
  setup(props, { emit }) {
    const { articleToDisplay, handleArticleRead } = useArticleLoader({
      props,
      registry: courseArticles,
      section: "courses",
      emit,
    });
    return {
      articleToDisplay,
      handleArticleRead,
    };
  },
};
</script>
