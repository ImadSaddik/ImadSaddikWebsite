<template>
  <div class="admonition" :class="typeClass">
    <p class="admonition-title">{{ title }}</p>
    <div class="admonition-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdmonitionBlock",
  props: {
    type: {
      type: String,
      default: "note",
      validator(value) {
        return ["note", "tip", "info", "warning", "danger"].includes(value);
      },
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    typeClass() {
      return `admonition-${this.type}`;
    },
  },
};
</script>

<style scoped>
.admonition {
  padding: var(--gap-md);
  border-left: 5px solid;
  margin: var(--gap-md) 0;
}

.admonition-note {
  background-color: var(--color-admonition-note-background);
  border-color: var(--color-admonition-note-border);
}

.admonition-tip {
  background-color: var(--color-admonition-tip-background);
  border-color: var(--color-admonition-tip-border);
}

.admonition-info {
  background-color: var(--color-admonition-info-background);
  border-color: var(--color-admonition-info-border);
}

.admonition-warning {
  background-color: var(--color-admonition-warning-background);
  border-color: var(--color-admonition-warning-border);
}

.admonition-danger {
  background-color: var(--color-admonition-danger-background);
  border-color: var(--color-admonition-danger-border);
}

.admonition .admonition-title {
  font-weight: 600;
  margin: 0;
  margin-bottom: var(--gap-xs);
  font-size: var(--font-size-small);
  text-transform: capitalize;
}

.admonition-note .admonition-title {
  color: var(--color-admonition-note-border);
}

.admonition-tip .admonition-title {
  color: var(--color-admonition-tip-border);
}

.admonition-info .admonition-title {
  color: var(--color-admonition-info-border);
}

.admonition-warning .admonition-title {
  color: var(--color-admonition-warning-border);
}

.admonition-danger .admonition-title {
  color: var(--color-admonition-danger-border);
}

.admonition-content {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.admonition-content ::v-deep(p) {
  margin: 0;
}

@media screen and (max-width: 576px) {
  .admonition {
    padding: var(--gap-sm);
    border-left: 3px solid;
  }
}
</style>
