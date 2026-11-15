import { computed, inject, ref, unref, watch } from "vue";

/**
 * Composable to manage per-block line-wrapping and hover/keyboard-focus control visibility.
 *
 * Follows the global `wrapCodeEnabled` preference unless overridden locally on the block.
 * Resets any local override whenever the global preference changes.
 *
 * @returns {Object} Reactive state and handlers for code wrapping and control visibility.
 */
export function useCodeWrap() {
  const globalWrapCode = inject("wrapCodeEnabled", ref(false));
  const localWrapOverride = ref(null);
  const hovering = ref(false);
  const focusing = ref(false);
  const pointerInteracting = ref(false);

  const isWrapped = computed(() => {
    if (localWrapOverride.value !== null) {
      return localWrapOverride.value;
    }
    return Boolean(unref(globalWrapCode));
  });

  const controlsVisible = computed(() => hovering.value || focusing.value);

  watch(
    () => Boolean(unref(globalWrapCode)),
    () => {
      localWrapOverride.value = null;
    }
  );

  const toggleWrap = () => {
    localWrapOverride.value = !isWrapped.value;
  };

  const handleMouseEnter = () => {
    hovering.value = true;
  };

  const handleMouseLeave = () => {
    hovering.value = false;
    focusing.value = false;
    pointerInteracting.value = false;
  };

  const handlePointerDown = () => {
    pointerInteracting.value = true;
  };

  const handleKeyDown = () => {
    pointerInteracting.value = false;
  };

  const handleFocusIn = () => {
    if (!pointerInteracting.value) {
      focusing.value = true;
    }
  };

  const handleFocusOut = (event) => {
    if (!event.currentTarget?.contains(event.relatedTarget)) {
      focusing.value = false;
      pointerInteracting.value = false;
    }
  };

  return {
    hovering,
    focusing,
    controlsVisible,
    isWrapped,
    toggleWrap,
    handleMouseEnter,
    handleMouseLeave,
    handlePointerDown,
    handleKeyDown,
    handleFocusIn,
    handleFocusOut,
  };
}
