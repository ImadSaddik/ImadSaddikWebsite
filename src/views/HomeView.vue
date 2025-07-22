<template>
  <div class="container">
    <div class="main-content">
      <HeroSection />
      <SeparatorImage
        :image-src="scorpiusIllustration"
        alt-text="Scorpius constellation with connecting lines and colorful stars and galaxies."
        image-width="100%"
      />

      <section class="about-me-section">
        <h2 class="title">About me</h2>
        <p class="paragraph">
          I'm a developer and content creator based in Morocco, with a passion for building beautiful things for the
          web. From crafting code with Vue.js to capturing distant galaxies, my work is driven by a love for exploration
          and sharing what I learn along the way.
        </p>
        <button class="custom-button primary-button">Read my full story</button>
      </section>

      <SeparatorImage
        :image-src="quasarIllustration"
        alt-text="Blue quasar at the center of a spiral galaxy with energetic jets."
        image-width="20%"
      />

      <section class="courses-section">
        <h2 class="title">Featured courses</h2>

        <div class="courses-list">
          <div class="course-card">
            <img src="@/assets/card_placeholders/placeholder_1.svg" alt="" />
            <h3 class="course-title">Course title 1</h3>
            <p class="course-upload-date">16 August 2001</p>
          </div>
          <div class="course-card">
            <img src="@/assets/card_placeholders/placeholder_2.svg" alt="" />
            <h3 class="course-title">Course title 2</h3>
            <p class="course-upload-date">16 August 2001</p>
          </div>
          <div class="course-card">
            <img src="@/assets/card_placeholders/placeholder_1.svg" alt="" />
            <h3 class="course-title">Course title 3</h3>
            <p class="course-upload-date">16 August 2001</p>
          </div>
        </div>

        <button class="custom-button primary-button">View more courses</button>
      </section>

      <SeparatorImage
        :image-src="solarSystemIllustration"
        alt-text="Stylized illustration of a solar system showing 4 planets and a sun."
        image-width="100%"
      />

      <section class="articles-section">
        <h2 class="title">Latest articles</h2>

        <div class="articles-list">
          <div class="article-card">
            <img src="@/assets/card_placeholders/placeholder_1.svg" alt="" />
            <h3 class="article-title">Article title 1</h3>
            <p class="article-upload-date">16 August 2001</p>
          </div>
          <div class="article-card">
            <img src="@/assets/card_placeholders/placeholder_2.svg" alt="" />
            <h3 class="article-title">Article title 2</h3>
            <p class="article-upload-date">16 August 2001</p>
          </div>
          <div class="article-card">
            <img src="@/assets/card_placeholders/placeholder_1.svg" alt="" />
            <h3 class="article-title">Article title 3</h3>
            <p class="article-upload-date">16 August 2001</p>
          </div>
        </div>

        <button class="custom-button primary-button">View all articles</button>
      </section>

      <SeparatorImage
        :image-src="starTrailsIllustration"
        alt-text="White star trails forming concentric arcs."
        image-width="50%"
      />

      <section class="cosmos-images-section">
        <h2 class="title">Capturing the cosmos</h2>

        <div class="cosmos-images-list">
          <div class="cosmos-image-card">
            <img src="@/assets/card_placeholders/placeholder_1.svg" alt="" />
            <h3 class="cosmos-image-title">Image title 1</h3>
            <p class="cosmos-image-upload-date">16 August 2001</p>
          </div>
          <div class="cosmos-image-card">
            <img src="@/assets/card_placeholders/placeholder_2.svg" alt="" />
            <h3 class="cosmos-image-title">Image title 2</h3>
            <p class="cosmos-image-upload-date">16 August 2001</p>
          </div>
          <div class="cosmos-image-card">
            <img src="@/assets/card_placeholders/placeholder_1.svg" alt="" />
            <h3 class="cosmos-image-title">Image title 3</h3>
            <p class="cosmos-image-upload-date">16 August 2001</p>
          </div>
        </div>

        <button class="custom-button primary-button">View all images</button>
      </section>
    </div>

    <section class="footer-section">
      <div class="footer-content">
        <h3 class="footer-title">Imad Saddik</h3>
        <p class="footer-description">Programming, exploring the sky, and sharing everything I learn.</p>

        <div class="footer-logos">
          <img :src="githubLogo" alt="GitHub logo" />
          <img :src="huggingFaceLogo" alt="Hugging Face logo" />
          <img :src="youtubeLogo" alt="YouTube logo" />
          <img :src="mediumLogo" alt="Medium logo" />
          <img :src="linkedinLogo" alt="LinkedIn logo" />
        </div>

        <p class="footer-rights">All rights reserved © 2025 Imad Saddik</p>
      </div>

      <div class="footer-images">
        <img class="footer-telescope" src="@/assets/telescope.svg" alt="Telescope" />
        <img
          class="footer-objects"
          src="@/assets/objects_telescope_looking_at.svg"
          alt="Objects Telescope Looking At"
        />
      </div>
    </section>
  </div>
</template>

<script>
// Components
import SeparatorImage from "@/components/SeparatorImage.vue";
import HeroSection from "@/components/HeroSection.vue";

// Illustrations
import scorpiusIllustration from "@/assets/illustrations/scorpius.svg";
import quasarIllustration from "@/assets/illustrations/quasar.svg";
import solarSystemIllustration from "@/assets/illustrations/solar_system.svg";
import starTrailsIllustration from "@/assets/illustrations/star_trails.svg";

// Logos
import githubLogo from "@/assets/logos/github.svg";
import huggingFaceLogo from "@/assets/logos/hugging_face.svg";
import youtubeLogo from "@/assets/logos/youtube.svg";
import mediumLogo from "@/assets/logos/medium.svg";
import linkedinLogo from "@/assets/logos/linkedin.svg";

export default {
  name: "HomeView",
  components: {
    SeparatorImage,
    HeroSection,
  },
  data() {
    return {
      scorpiusIllustration,
      quasarIllustration,
      solarSystemIllustration,
      starTrailsIllustration,

      githubLogo,
      huggingFaceLogo,
      youtubeLogo,
      mediumLogo,
      linkedinLogo,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
}

.main-content {
  padding: var(--gap-xl);
  margin: 0 auto;
}

.paragraph {
  font-size: var(--font-size-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--gap-xl);
  margin-top: 0;
  text-align: center;
}

.about-me-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15rem;
  width: 100%;
}

.courses-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15rem;
  width: 100%;
}

.courses-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
  width: 100%;
  margin-bottom: var(--gap-xl);
}

.course-card img {
  width: 100%;
  height: auto;
}

.course-title {
  font-size: var(--font-size-medium);
  margin-top: var(--gap-md);
  margin-bottom: 0;
}

.course-upload-date {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--gap-xs);
}

.articles-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15rem;
  width: 100%;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
  width: 100%;
  margin-bottom: var(--gap-xl);
}

.article-card img {
  width: 100%;
  height: auto;
}

.article-title {
  font-size: var(--font-size-medium);
  margin-top: var(--gap-md);
  margin-bottom: 0;
}

.article-upload-date {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--gap-xs);
}

.cosmos-images-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15rem;
  width: 100%;
}

.cosmos-images-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
  width: 100%;
  margin-bottom: var(--gap-xl);
}

.cosmos-image-card img {
  width: 100%;
  height: auto;
}

.cosmos-image-title {
  font-size: var(--font-size-medium);
  margin-top: var(--gap-md);
  margin-bottom: 0;
}

.cosmos-image-upload-date {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--gap-xs);
}

.footer-section {
  width: 100%;
  margin-top: 15rem;
  border-top: 1px solid var(--color-text-secondary);
  position: relative;
}

.footer-title {
  font-size: var(--font-size-big);
  margin-top: 6rem;
  margin-bottom: var(--gap-sm);
}

.footer-description {
  font-size: var(--font-size-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--gap-md);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: var(--gap-xl);
}

.footer-logos {
  display: flex;
  gap: var(--gap-sm);
  margin-bottom: var(--gap-md);
}

.footer-logos img {
  height: 32px;
}

.footer-rights {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--gap-xl);
}

.footer-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.footer-telescope {
  position: absolute;
  bottom: 0;
  left: 60%;
}

.footer-objects {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 360px;
  height: auto;
}
</style>
