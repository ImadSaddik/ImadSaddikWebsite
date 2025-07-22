<template>
  <div class="container">
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
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15rem;
}
</style>
