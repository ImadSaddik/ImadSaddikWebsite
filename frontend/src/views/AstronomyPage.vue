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
import { useArticleLoader } from "@/composables/useArticleLoader";
import { astronomyArticles } from "@/registries/articles.js";

export default {
  name: "AstronomyPage",
  props: {
    slug: { type: String, required: true },
  },
  emits: ["show-toast", "page-visited"],
  setup(props, { emit }) {
    const { articleToDisplay, handleArticleRead } = useArticleLoader({
      props,
      registry: astronomyArticles,
      section: "astronomy",
      emit,
    });
    return {
      articleToDisplay,
      handleArticleRead,
    };
  },
};
</script>
