<template>
  <pre class="code-output-container"><code>{{ codeOutput }}</code></pre>
</template>

<script>
export default {
  name: "CodeOutput",
  props: {
    codeOutput: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.code-output-container {
  background-color: var(--color-code-night-owl-background);
  color: var(--color-text-secondary);
  padding: 30px;
  margin: 0;
  margin-top: var(--gap-md);
  overflow-x: auto;
  font-size: var(--font-size-small);
  line-height: 30px;
  white-space: pre;
  word-wrap: normal;
}

.code-output-container code {
  font-family: "Inter";
}

@media screen and (max-width: 576px) {
  .code-output-container {
    font-size: var(--font-size-extra-small);
    line-height: 20px;
    padding: 20px;
  }
}
</style>
