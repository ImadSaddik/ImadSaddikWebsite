<template>
  <div class="container">
    <div class="main-content">
      <section class="hero-section">
        <div class="actions">
          <h1 class="title">Explore articles and courses I create about coding and the cosmos.</h1>

          <button class="primary-button">Explore articles</button>
          <button class="secondary-button">View courses</button>
        </div>

        <div class="hero-image">
          <img src="@/assets/hero_section/blue_galaxy.svg" alt="Blue Galaxy" />
        </div>
      </section>

      <div class="separator-section-1">
        <img src="@/assets/scorpius_and_stars.svg" alt="Scorpius and Stars" />
      </div>

      <section class="about-me-section">
        <h2 class="title">About me</h2>
        <p class="paragraph">
          I'm a developer and content creator based in Morocco, with a passion for building beautiful things for the
          web. From crafting code with Vue.js to capturing distant galaxies, my work is driven by a love for exploration
          and sharing what I learn along the way.
        </p>
        <button class="primary-button">Read my full story</button>
      </section>

      <div class="separator-section-2">
        <img src="@/assets/quasar.svg" alt="Quasar" />
      </div>

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

        <button class="primary-button">View more courses</button>
      </section>

      <div class="separator-section-3">
        <img src="@/assets/solar_system.svg" alt="Solar System" />
      </div>

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

        <button class="primary-button">View all articles</button>
      </section>

      <div class="separator-section-4">
        <img src="@/assets/star_trails.svg" alt="Star Trail" />
      </div>

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

        <button class="primary-button">View all images</button>
      </section>
    </div>

    <section class="footer-section">
      <div class="footer-content">
        <h3 class="footer-title">Imad Saddik</h3>
        <p class="footer-description">Programming, exploring the sky, and sharing everything I learn.</p>

        <div class="footer-logos">
          <img src="@/assets/logos/github.svg" alt="GitHub" />
          <img src="@/assets/logos/hugging_face.svg" alt="Hugging Face" />
          <img src="@/assets/logos/youtube.svg" alt="YouTube" />
          <img src="@/assets/logos/medium.svg" alt="Medium" />
          <img src="@/assets/logos/linkedin.svg" alt="LinkedIn" />
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
export default {
  name: "HomeView",
  components: {},
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

.hero-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: var(--gap-xxl);
  /* background-color: rgb(72, 56, 64); */
}

.actions {
  flex: 1;
  color: var(--color-text-primary);
}

.primary-button {
  color: var(--color-text-primary);
  background-color: var(--color-button-primary);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-medium);
  font-weight: 600;
  padding: var(--gap-sm) var(--gap-md);
  margin-right: var(--gap-md);
  width: 250px;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: var(--color-button-primary-hover);
}

.secondary-button {
  color: var(--color-button-secondary);
  background-color: transparent;
  border: 1px solid var(--color-button-secondary);
  cursor: pointer;
  font-size: var(--font-size-medium);
  font-weight: 600;
  padding: var(--gap-sm) var(--gap-md);
  width: 250px;
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-button-secondary-hover);
}

.title {
  font-size: var(--font-size-big);
  margin-bottom: var(--gap-xl);
}

.paragraph {
  font-size: var(--font-size-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--gap-xl);
  margin-top: 0;
  text-align: center;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  width: 75%;
  height: auto;
}

.separator-section-1 {
  width: 100%;
  margin-top: 15rem;
}

.separator-section-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 15rem;
}

.separator-section-3 {
  width: 100%;
  margin-top: 15rem;
}

.separator-section-4 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 15rem;
}

.separator-section-1 img {
  width: 100%;
  height: auto;
}

.separator-section-2 img {
  width: 20%;
  height: auto;
}

.separator-section-3 img {
  width: 100%;
  height: auto;
}

.separator-section-4 img {
  width: 50%;
  height: auto;
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
  margin-bottom: 5rem;
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
