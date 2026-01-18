import { ref, onUnmounted } from "vue";

/**
 * Composable to manage image modal state and interactions.
 * - Handles opening/closing the image modal
 * - Allows closing via Escape key
 * - Cleans up event listeners on unmount
 *
 * @returns {Object}
 * @returns {import('vue').Ref<string>} enlargedImageSrc - The source of the enlarged image
 * @returns {import('vue').Ref<boolean>} isImageModalVisible - Whether the modal is visible
 * @returns {Function} handleOpenImageModal - Opens the modal with the clicked image
 * @returns {Function} handleCloseImageModal - Closes the modal and cleans up listeners
 */
export function useImageModal() {
  const enlargedImageSrc = ref("");
  const isImageModalVisible = ref(false);

  const handleOpenImageModal = (event) => {
    enlargedImageSrc.value = event.target.src;
    isImageModalVisible.value = true;
    window.addEventListener("keydown", handleEscape);
  };

  const handleCloseImageModal = () => {
    isImageModalVisible.value = false;
    enlargedImageSrc.value = "";
    window.removeEventListener("keydown", handleEscape);
  };

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      handleCloseImageModal();
    }
  };

  onUnmounted(() => {
    window.removeEventListener("keydown", handleEscape);
  });

  return {
    enlargedImageSrc,
    isImageModalVisible,

    handleOpenImageModal,
    handleCloseImageModal,
  };
}
