import { computed, inject, onBeforeUnmount, ref } from "vue";

const DEFAULT_RESET_INTERVAL_MS = 1500;

/**
 * Composable to copy text to the clipboard with toast notifications and timed icon reset.
 *
 * @param {Object} [options] - Configuration options.
 * @param {string} [options.successMessage="Code copied to clipboard"] - Toast message on success.
 * @param {string} [options.errorMessage="Failed to copy code"] - Toast message on failure.
 * @param {number} [options.resetIntervalMs=1500] - Delay in milliseconds before resetting status icon.
 * @returns {Object} Reactive copy state, icon class, and copy handler.
 */
export function useClipboardCopy({
  successMessage = "Code copied to clipboard",
  errorMessage = "Failed to copy code",
  resetIntervalMs = DEFAULT_RESET_INTERVAL_MS,
} = {}) {
  const showToast = inject("showToast", () => {});
  const copied = ref(false);
  const errorOccured = ref(false);
  let resetTimer = null;

  const iconClass = computed(() => {
    if (errorOccured.value) return "fa-solid fa-xmark fa-lg";
    if (copied.value) return "fa-solid fa-check fa-lg";
    return "fa-regular fa-clipboard fa-lg";
  });

  const clearResetTimer = () => {
    if (resetTimer !== null) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
  };

  const scheduleReset = (stateRef) => {
    clearResetTimer();
    resetTimer = setTimeout(() => {
      stateRef.value = false;
      resetTimer = null;
    }, resetIntervalMs);
  };

  const copy = async (text) => {
    if (errorOccured.value || copied.value) return;

    const content = text ?? "";
    try {
      await navigator.clipboard.writeText(content);
      copied.value = true;
      showToast({
        message: successMessage,
        type: "success",
      });
      scheduleReset(copied);
    } catch {
      errorOccured.value = true;
      showToast({
        message: errorMessage,
        type: "error",
      });
      scheduleReset(errorOccured);
    }
  };

  onBeforeUnmount(clearResetTimer);

  return {
    copied,
    errorOccured,
    iconClass,
    copy,
  };
}
