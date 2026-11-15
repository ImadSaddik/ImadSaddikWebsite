<template>
  <CodeContainer :label="language" :copy-text="code">
    <div v-html="highlightedHtml"></div>
  </CodeContainer>
</template>

<script setup>
import { ref, watch } from "vue";
import CodeContainer from "@/components/CodeContainer.vue";
import { highlightCode } from "@/services/shiki.js";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const highlightedHtml = ref(null);
let latestRequestId = 0;

watch(
  () => [props.code, props.language],
  async ([code, language]) => {
    const requestId = ++latestRequestId;
    const html = await highlightCode(code, language);
    if (requestId === latestRequestId) {
      highlightedHtml.value = html;
    }
  },
  { immediate: true }
);
</script>

<style>
pre.shiki {
  background-color: var(--color-code-background);
  margin: 0;
  padding: 0;
  overflow-x: auto;
  counter-reset: line;
}

pre.shiki code {
  font-family: var(--font-family-mono);
  display: grid;
  grid-auto-rows: min-content;
  row-gap: 0px;
  font-size: var(--font-size-small);
  padding: 44px 0px 30px;
  min-width: max-content;
}

.shiki .line {
  display: block;
  margin: 0;
  padding: 0 20px 0 80px;
  line-height: 30px;
  min-height: 30px;
  counter-increment: line;
  position: relative;
}

.shiki .line::before {
  content: counter(line);
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  text-align: right;
  color: var(--color-text-secondary);
  opacity: 0.6;
  font-size: var(--font-size-small);
  user-select: none;
  pointer-events: none;
}

.shiki .line.highlighted {
  background-color: var(--color-code-highlighted-background);
  box-shadow: inset 4px 0 0 0 var(--color-secondary);
}

.shiki .line.highlighted::before {
  opacity: 1;
  font-weight: 600;
}

.code-container.wrapped pre.shiki {
  overflow-x: hidden;
}

.code-container.wrapped pre.shiki code {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

.code-container.wrapped .shiki .line {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media screen and (max-width: 576px) {
  pre.shiki code {
    font-size: var(--font-size-extra-small);
    padding: 40px 0px 20px;
  }

  .shiki .line {
    display: block;
    margin: 0;
    padding: 0 20px 0 40px;
    line-height: 20px;
    min-height: 20px;
    counter-increment: line;
    position: relative;
  }

  .shiki .line::before {
    width: 25px;
    font-size: var(--font-size-extra-small);
  }
}
</style>
