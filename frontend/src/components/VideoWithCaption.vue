<template>
  <section class="video-with-caption-container">
    <figure>
      <video
        controls
        playsinline
        :autoplay="loop"
        :loop="loop"
        :muted="loop"
        :preload="loop ? 'auto' : 'metadata'"
        :src="videoSrc"
      ></video>
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
    loop: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.video-with-caption-container {
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
