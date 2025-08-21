<template>
  <component v-if="blogToDisplay" :is="blogToDisplay" :key="slug" />
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "BlogPage",
  props: {
    slug: { type: String, required: true },
  },
  data() {
    return {
      blogToDisplay: null,
    };
  },
  watch: {
    slug: {
      immediate: true,
      handler(newSlug) {
        console.log("Slug changed:", newSlug);
        this.blogToDisplay = defineAsyncComponent(() => import(`@/blogs/${newSlug}`));
      },
    },
  },
};
</script>

<style scoped></style>
