<template>
  <button
    type="button"
    class="code-action-button code-copy-button"
    :class="{ visible }"
    :disabled="copied"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    @click="copy(text)"
  >
    <i :class="iconClass"></i>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useClipboardCopy } from "@/composables/useClipboardCopy";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  copyLabel: {
    type: String,
    default: "Copy code",
  },
  successMessage: {
    type: String,
    default: "Code copied to clipboard",
  },
  errorMessage: {
    type: String,
    default: "Failed to copy code",
  },
});

const { copied, iconClass, copy } = useClipboardCopy({
  successMessage: props.successMessage,
  errorMessage: props.errorMessage,
});

const buttonLabel = computed(() => (copied.value ? "Copied!" : props.copyLabel));
</script>

<style scoped>
.code-copy-button:disabled {
  cursor: default;
}

.code-copy-button.visible:disabled {
  opacity: 0.5;
}
</style>
