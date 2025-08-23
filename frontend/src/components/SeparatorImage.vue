<template>
  <div class="separator-image-container">
    <img :src="imageSrc" :alt="altText" :width="imageWidth" :height="imageHeight" />
  </div>
</template>

<script>
export default {
  name: "SeparatorImage",
  props: {
    imageSrc: {
      type: String,
      required: true,
      default: null,
    },
    altText: {
      type: String,
      required: true,
      default: null,
    },
    imageWidth: {
      type: String,
      default: "100%",
    },
    imageHeight: {
      type: String,
      default: "auto",
    },
  },
};
</script>

<style scoped>
.separator-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-between-sections-big);
  width: 100%;
}
</style>
