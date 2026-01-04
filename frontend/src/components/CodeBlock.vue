<template>
  <div class="code-container" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <span class="language-label" :class="{ hidden: hovering }">{{ language }}</span>
    <button
      class="code-copy-button"
      :class="{ visible: hovering }"
      :disabled="copied"
      :aria-label="copied ? 'Copied!' : 'Copy code'"
      :title="copied ? 'Copied!' : 'Copy code'"
      @click="copyCode"
    >
      <i :class="iconClass"></i>
    </button>
    <div v-html="highlightedHtml"></div>
  </div>
</template>

<script>
import { getHighlighter } from "@/services/shiki.js";
import { transformerNotationHighlight } from "@shikijs/transformers";

export default {
  name: "CodeBlock",
  props: {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  emits: ["show-toast"],
  data() {
    return {
      highlightedHtml: null,
      copied: false,
      errorOccured: false,
      hovering: false,
      resetIconIntervalInMilliseconds: 1500,
    };
  },
  computed: {
    iconClass() {
      if (this.errorOccured) return "fa-solid fa-xmark fa-2xl";
      if (this.copied) return "fa-solid fa-check fa-2xl";
      return "fa-regular fa-clipboard fa-2xl";
    },
  },
  async created() {
    const highlighter = await getHighlighter();
    this.highlightedHtml = highlighter.codeToHtml(this.code, {
      lang: this.language,
      theme: "night-owl",
      transformers: [transformerNotationHighlight({ matchAlgorithm: "v3" })],
    });
  },
  methods: {
    async copyCode() {
      if (this.errorOccured || this.copied) return;

      const text = this.code ?? "";
      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        this.$emit("show-toast", {
          message: "Code copied to clipboard",
          type: "success",
        });
        setTimeout(() => {
          this.copied = false;
        }, this.resetIconIntervalInMilliseconds);
      } catch {
        this.errorOccured = true;
        this.$emit("show-toast", {
          message: "Failed to copy code",
          type: "error",
        });
        setTimeout(() => {
          this.errorOccured = false;
        }, this.resetIconIntervalInMilliseconds);
      }
    },
  },
};
</script>

<style>
.code-container {
  position: relative;
}

.language-label {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.5px;
  opacity: 1;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.language-label.hidden {
  opacity: 0;
}

.code-copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  border: 1px solid var(--color-code-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;
  pointer-events: none; /* prevent interaction when hidden */
}

.code-copy-button.visible {
  opacity: 1;
  pointer-events: auto;
}

.code-copy-button:hover {
  opacity: 0.8;
}

.code-copy-button:disabled {
  cursor: default;
}

.code-copy-button.visible:disabled {
  opacity: 0.5;
}

pre.shiki {
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
  padding: 30px 0px;
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

@media screen and (max-width: 576px) {
  .language-label {
    top: 0.25rem;
    right: 0.25rem;
    font-size: var(--font-size-extra-small);
  }

  .code-copy-button {
    top: 0.25rem;
    right: 0.25rem;
    width: 3rem;
    height: 3rem;
  }

  pre.shiki code {
    font-size: var(--font-size-extra-small);
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
