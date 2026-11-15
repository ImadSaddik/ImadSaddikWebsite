<template>
  <CodeContainer
    label="output"
    :copy-text="codeOutput"
    copy-label="Copy output"
    copy-success-message="Output copied to clipboard"
    copy-error-message="Failed to copy output"
  >
    <pre class="code-output-container"><code>{{ codeOutput }}</code></pre>
  </CodeContainer>
</template>

<script setup>
import CodeContainer from "@/components/CodeContainer.vue";

defineProps({
  codeOutput: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.code-output-container {
  background-color: var(--color-code-background);
  color: var(--color-text-secondary);
  padding: 44px 30px 30px;
  margin: 0;
  overflow-x: auto;
  font-size: var(--font-size-small);
  line-height: 30px;
  white-space: pre;
  word-wrap: normal;
}

.code-output-container code {
  font-family: var(--font-family-mono);
}

:global(.code-container.wrapped .code-output-container) {
  overflow-x: hidden;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media screen and (max-width: 576px) {
  .code-output-container {
    font-size: var(--font-size-extra-small);
    line-height: 20px;
    padding: 40px 20px 20px;
  }
}
</style>
