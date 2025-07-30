<template>
  <section class="hero-container">
    <div class="actions-column">
      <h1 id="hero-title" class="title">
        Explore articles, images and courses I create about programming and the universe.
      </h1>

      <div class="buttons-container">
        <button class="hero-button primary-button">Explore articles</button>
        <button class="hero-button secondary-button">View courses</button>
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
.hero-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 75%;
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
  gap: var(--gap-md);
}

.hero-button {
  padding: var(--gap-sm) var(--gap-xs);
  font-size: var(--font-size-small);
  font-weight: 600;
  width: 200px;
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

@media screen and (max-width: 1700px) {
  .hero-container {
    margin-top: 0;
    width: 80%;
    gap: var(--gap-xxl);
  }

  .buttons-container {
    flex-direction: row;
    gap: var(--gap-sm);
  }

  .image-column img {
    width: 75%;
  }

  #hero-title {
    width: 100%;
    margin-bottom: var(--gap-xl);
  }
}

@media screen and (max-width: 1500px) {
  .hero-container {
    width: 85%;
    gap: var(--gap-xl);
  }

  .image-column img {
    width: 85%;
  }
}

@media screen and (max-width: 1300px) {
  .hero-container {
    width: 90%;
  }

  .buttons-container {
    flex-direction: column;
  }

  .image-column img {
    width: 90%;
  }
}

@media screen and (max-width: 1100px) {
  .hero-container {
    width: 100%;
  }

  .buttons-container {
    gap: var(--gap-xs);
  }

  .image-column img {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .hero-container {
    flex-direction: column-reverse;
  }

  .image-column img {
    width: 90%;
  }

  #hero-title {
    width: 85%;
  }
}

@media screen and (max-width: 576px) {
  .image-column img {
    width: 80%;
  }

  #hero-title {
    width: 100%;
  }
}
</style>
