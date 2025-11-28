<template>
  <div v-if="isVisible" class="image-modal-overlay" @click="closeImageModal">
    <img :src="enlargedImageSrc" class="image-modal-content" alt="Enlarged view of the image." />
  </div>
</template>

<script>
export default {
  name: "ImageEnlarger",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    enlargedImageSrc: {
      type: String,
      required: true,
    },
  },
  emits: ["close-image-modal"],
  methods: {
    closeImageModal() {
      this.$emit("close-image-modal");
    },
  },
};
</script>

<style scoped>
.image-modal-overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-background-overlay);
  z-index: 1000;
  cursor: zoom-out;
}

.image-modal-content {
  width: 90vw;
  height: 90vh;
  object-fit: contain;
}
</style>
