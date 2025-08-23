<template>
  <section class="inline-button">
    <button @click="handleClick"><i :class="fontAwesomeIcon"></i> {{ label }}</button>
  </section>
</template>

<script>
export default {
  name: "InlineButton",
  emits: ["button-clicked"],
  props: {
    fontAwesomeIcon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.$emit("button-clicked");
    },
  },
};
</script>

<style scoped>
i {
  margin-right: var(--gap-xs);
}

button {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: var(--font-size-extra-small);
  padding: var(--gap-xs);
  border-radius: 0px;
  border: 1px solid var(--color-tag-border);
  background-color: var(--color-tag-background);
  color: var(--color-secondary);
  transition: all 0.2s ease;
  cursor: pointer;
}

button:hover {
  background-color: var(--color-tag-background-hover);
  border-color: var(--color-tag-border-hover);
}

.inline-button {
  display: inline-block;
  margin: 0;
  padding: 0;
}
</style>
