<template>
  <section class="container">
    <div class="actions-column">
      <h1 class="title">Explore articles and courses I create about programming and the universe.</h1>

      <div class="buttons-container">
        <button class="custom-button primary-button">Explore articles</button>
        <button class="custom-button secondary-button">View courses</button>
      </div>
    </div>

    <div class="image-column">
      <img :src="blueGalaxy" alt="Blue spiral galaxy with a dark core." />
    </div>
  </section>
</template>

<script>
import blueGalaxy from "@/assets/hero_section/blue_galaxy.svg";

export default {
  name: "HeroSection",
  data() {
    return {
      blueGalaxy,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: var(--gap-xxl);
  margin-top: var(--gap-xxl);
}

.actions-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  gap: var(--gap-xs);
}

.image-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-column img {
  width: 75%;
  height: auto;
}
</style>
