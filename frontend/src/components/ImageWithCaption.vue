<template>
  <section>
    <figure>
      <img :src="imageSrc" :alt="imageAlt" @click="openImageModal" />
      <figcaption v-html="imageCaption"></figcaption>
    </figure>
  </section>
</template>

<script>
export default {
  name: "ImageWithCaption",
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
  emits: ["open-image-modal"],
  methods: {
    openImageModal(event) {
      this.$emit("open-image-modal", event);
    },
  },
};
</script>

<style scoped>
section {
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
