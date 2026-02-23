<template>
  <section class="image-with-caption-container">
    <figure>
      <img :src="imageSrc" :alt="imageAlt" @click="handleImageClick" />
      <figcaption v-html="imageCaption"></figcaption>
    </figure>
  </section>
</template>

<script>
export default {
  name: "ImageWithCaption",
  inject: ["openImageModal"],
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      required: true,
    },
    imageCaption: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleImageClick(event) {
      this.openImageModal(event);
    },
  },
};
</script>

<style scoped>
.image-with-caption-container {
  margin: var(--gap-md) 0;
}

figure {
  margin: 0;
}

img {
  width: 100%;
  height: auto;
  cursor: zoom-in;
}

figcaption {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  margin-top: var(--gap-xs);
}
</style>
