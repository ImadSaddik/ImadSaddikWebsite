<template>
  <div
    class="code-container"
    :class="{ wrapped: isWrapped }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @pointerdown="handlePointerDown"
    @keydown="handleKeyDown"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <span class="code-label" :class="{ hidden: controlsVisible }">{{ label }}</span>
    <div class="code-actions">
      <WrapToggleButton :is-wrapped="isWrapped" :visible="controlsVisible" @toggle="toggleWrap" />
      <CopyCodeButton
        :text="copyText"
        :visible="controlsVisible"
        :copy-label="copyLabel"
        :success-message="copySuccessMessage"
        :error-message="copyErrorMessage"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import CopyCodeButton from "@/components/CopyCodeButton.vue";
import WrapToggleButton from "@/components/WrapToggleButton.vue";
import { useCodeWrap } from "@/composables/useCodeWrap";

defineProps({
  label: {
    type: String,
    required: true,
  },
  copyText: {
    type: String,
    required: true,
  },
  copyLabel: {
    type: String,
    default: "Copy code",
  },
  copySuccessMessage: {
    type: String,
    default: "Code copied to clipboard",
  },
  copyErrorMessage: {
    type: String,
    default: "Failed to copy code",
  },
});

const {
  controlsVisible,
  isWrapped,
  toggleWrap,
  handleMouseEnter,
  handleMouseLeave,
  handlePointerDown,
  handleKeyDown,
  handleFocusIn,
  handleFocusOut,
} = useCodeWrap();
</script>

<style scoped>
.code-container {
  position: relative;
  margin: var(--gap-md) 0;
  min-width: 0;
  max-width: 100%;
}

.code-label {
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

.code-label.hidden {
  opacity: 0;
}

.code-actions {
  position: absolute;
  top: 0.375rem;
  right: 0.5rem;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  pointer-events: none;
}

:deep(.code-action-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid var(--color-code-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;
  pointer-events: none;
}

:deep(.code-action-button.visible) {
  opacity: 1;
  pointer-events: auto;
}

:deep(.code-action-button:hover) {
  opacity: 0.8;
}

@media screen and (max-width: 576px) {
  .code-label {
    top: 0.25rem;
    right: 0.25rem;
    font-size: var(--font-size-extra-small);
  }

  .code-actions {
    top: 0.25rem;
    right: 0.25rem;
  }

  :deep(.code-action-button) {
    width: 2rem;
    height: 2rem;
  }
}

@media (hover: none) {
  .code-label {
    opacity: 0;
  }

  :deep(.code-action-button) {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
