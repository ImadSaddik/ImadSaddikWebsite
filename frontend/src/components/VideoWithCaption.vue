<template>
  <section>
    <figure>
      <video autoplay loop muted playsinline :src="videoSrc"></video>
      <figcaption v-html="videoCaption"></figcaption>
    </figure>
  </section>
</template>

<script>
export default {
  name: "VideoWithCaption",
  props: {
    videoSrc: {
      type: String,
      required: true,
    },
    videoCaption: {
      type: String,
      required: true,
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

video {
  width: 100%;
  height: auto;
}

figcaption {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  margin-top: var(--gap-xs);
}
</style>
