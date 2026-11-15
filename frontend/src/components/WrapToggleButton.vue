<template>
  <button
    type="button"
    class="code-action-button code-wrap-button"
    :class="{ visible, active: isWrapped }"
    :aria-label="buttonLabel"
    :aria-pressed="isWrapped"
    :title="buttonLabel"
    @click="emit('toggle')"
  >
    <svg
      class="wrap-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M3 12h15a3 3 0 1 1 0 6h-4" />
      <polyline points="16 16 14 18 16 20" />
      <line x1="3" y1="18" x2="10" y2="18" />
    </svg>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  isWrapped: {
    type: Boolean,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle"]);

const buttonLabel = computed(() => (props.isWrapped ? "Unwrap lines" : "Wrap lines"));
</script>

<style scoped>
.code-wrap-button.active {
  color: var(--color-secondary);
  border-color: var(--color-secondary);
}

.wrap-icon {
  width: 1.125rem;
  height: 1.125rem;
}

@media screen and (max-width: 576px) {
  .wrap-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
