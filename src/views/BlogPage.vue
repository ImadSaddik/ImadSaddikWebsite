<template>
  <component v-if="blogToDisplay" :is="blogToDisplay" />
</template>

<script>
export default {
  name: "BlogPage",
  props: {
    slug: { type: String, required: true },
  },
  computed: {
    blogToDisplay() {
      return this.$route.meta.blogComponent;
    },
  },
};
</script>

<style scoped></style>
