<template>
  <section class="hero-container">
    <div class="actions-column">
      <h1 class="hero-title">Explore articles, images and courses I create about programming and the universe.</h1>

      <div class="buttons-container">
        <button id="skip-link" class="hero-button primary-button" @click="navigateToPath('blogs')">
          Explore articles
        </button>
        <button class="hero-button secondary-button" @click="navigateToPath('courses')">View courses</button>
      </div>
    </div>

    <div class="image-column">
      <img
        class="vertical-big-dipper"
        :src="verticalBigDipper"
        alt="Ursa major constellation with connecting lines and colorful stars and galaxies."
      />
      <img
        class="horizontal-big-dipper"
        :src="horizontalBigDipper"
        alt="Ursa major constellation with connecting lines and colorful stars and galaxies."
      />
    </div>
  </section>
</template>

<script>
import verticalBigDipper from "@/assets/illustrations/bigDipperVertical.svg";
import horizontalBigDipper from "@/assets/illustrations/bigDipperHorizontal.svg";

export default {
  name: "HeroSection",
  data() {
    return {
      verticalBigDipper,
      horizontalBigDipper,
    };
  },
  methods: {
    navigateToPath(path) {
      this.$router.push({ path });
    },
  },
};
</script>

<style scoped>
.hero-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: var(--gap-2xl);
}

.hero-title {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-xl);
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
  width: 100%;
}

.vertical-big-dipper {
  display: block;
  width: 75%;
  height: auto;
}

.horizontal-big-dipper {
  display: none;
}

@media screen and (max-width: 1100px) {
  .vertical-big-dipper {
    width: 70%;
  }

  .hero-title {
    font-size: var(--font-size-big-medium);
  }
}

@media screen and (max-width: 900px) {
  .hero-container {
    flex-direction: column-reverse;
  }

  .vertical-big-dipper {
    display: none;
  }

  .horizontal-big-dipper {
    display: block;
    width: 100%;
    height: auto;
  }

  .hero-title {
    font-size: var(--font-size-big-medium);
  }
}

@media screen and (max-width: 576px) {
  .buttons-container {
    flex-direction: column;
    gap: var(--gap-sm);
  }
}
</style>
