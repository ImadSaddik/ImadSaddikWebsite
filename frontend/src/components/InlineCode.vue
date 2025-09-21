<template>
  <code v-html="text"></code>
</template>

<script>
export default {
  name: "InlineCode",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
code {
  background-color: var(--color-tag-background);
  color: var(--color-secondary);
  padding: 2px 6px;
  font-size: var(--font-size-small);
  font-weight: 600;
}

@media screen and (max-width: 576px) {
  code {
    font-weight: 400;
  }
}
</style>
