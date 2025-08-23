<template>
  <span class="base-tag">{{ name }}</span>
</template>

<script>
export default {
  name: "BaseTag",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.base-tag {
  background-color: var(--color-tag-background);
  color: var(--color-secondary);
  padding: var(--gap-xs) var(--gap-sm);
  font-size: var(--font-size-small);
  font-weight: 500;
  border: 1px solid var(--color-tag-border);
  transition: all 0.2s ease;
  cursor: pointer;
}

.base-tag:hover {
  background-color: var(--color-tag-background-hover);
  border-color: var(--color-tag-border-hover);
}

@media screen and (max-width: 576px) {
  .base-tag {
    font-size: var(--font-size-small);
    padding: var(--gap-xs);
    font-weight: 400;
  }
}
</style>
