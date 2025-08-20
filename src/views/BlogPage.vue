<template>
  <component v-if="blogToDisplay" :is="blogToDisplay" />
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "BlogPage",
  props: {
    slug: { type: String, required: true },
  },
  computed: {
    blogToDisplay() {
      return defineAsyncComponent(() => import(`@/blogs/${this.slug}`));
    },
  },
};
</script>

<style scoped></style>
