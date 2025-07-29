<template>
  <section class="about-me-container">
    <h2 class="about-me-title">About me</h2>
    <p class="about-me-paragraph">
      I'm Imad Saddik from Morocco. I enjoy programming, astronomy, and teaching. I created a YouTube channel called
      3CodeCamp where I share tutorials about cool things I learn, like mobile apps, web development, AI, and more. At
      night, I love looking at the stars and capturing images of the sky.
    </p>
    <button class="about-me-button primary-button">Read my full story</button>
  </section>
</template>

<style scoped>
.about-me-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: var(--gap-between-sections-big);
  width: 60%;
}

.about-me-title {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-xl);
}

.about-me-paragraph {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-bottom: var(--gap-xl);
  margin-top: 0;
  text-align: center;
}

.about-me-button {
  padding: var(--gap-sm) var(--gap-xs);
  font-size: var(--font-size-small);
  font-weight: 600;
  width: 200px;
}

@media screen and (max-width: 1500px) {
  .about-me-container {
    width: 80%;
  }

  .about-me-paragraph {
    text-align: center;
  }
}

@media screen and (max-width: 1100px) {
  .about-me-container {
    width: 90%;
  }
}

@media screen and (max-width: 768px) {
  .about-me-container {
    width: 100%;
  }

  .about-me-title {
    font-size: var(--font-size-big-medium);
  }

  .about-me-paragraph {
    text-align: justify;
  }
}
</style>
