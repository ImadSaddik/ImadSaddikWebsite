<template>
  <section class="youtube-player-container">
    <iframe
      :src="videoUrl"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </section>
</template>

<script>
export default {
  name: "YouTubePlayer",
  props: {
    videoUrl: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>

<style scoped>
.youtube-player-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: var(--gap-md) 0;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
