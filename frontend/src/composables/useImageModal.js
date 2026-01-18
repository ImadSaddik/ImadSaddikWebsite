import { ref, onUnmounted } from "vue";

export function useImageModal() {
  const enlargedImageSrc = ref();
  const isImageModalVisible = ref();

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
