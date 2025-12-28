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
// Utils
import { blogArticles } from "@/registries/articles.js";
import { useArticleLoader } from "@/composables/useArticleLoader";

export default {
  name: "BlogPage",
  props: {
    slug: { type: String, required: true },
  },
  emits: ["show-toast", "page-visited"],
  setup(props, { emit }) {
    const { articleToDisplay, handleArticleRead } = useArticleLoader({
      props,
      registry: blogArticles,
      section: "blogs",
      emit,
    });
    return {
      articleToDisplay,
      handleArticleRead,
    };
  },
};
</script>
