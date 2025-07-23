<template>
  <section class="footer-container">
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
      <img
        class="telescope-image"
        :src="telescopeImage"
        alt="White telescope on a tripod pointing toward the night sky."
      />
      <img
        class="deep-sky-objects-image"
        :src="objectsImage"
        alt="Planet with a moon, colorful stars, and spiral galaxies in the night sky."
      />
    </div>
  </section>
</template>

<script>
// Logos
import githubLogo from "@/assets/logos/github.svg";
import huggingFaceLogo from "@/assets/logos/hugging_face.svg";
import youtubeLogo from "@/assets/logos/youtube.svg";
import mediumLogo from "@/assets/logos/medium.svg";
import linkedinLogo from "@/assets/logos/linkedin.svg";

// Images
import telescopeImage from "@/assets/telescope.svg";
import objectsImage from "@/assets/objects_telescope_looking_at.svg";

export default {
  name: "FooterSection",
  data() {
    return {
      githubLogo,
      huggingFaceLogo,
      youtubeLogo,
      mediumLogo,
      linkedinLogo,

      telescopeImage,
      objectsImage,
    };
  },
};
</script>

<style scoped>
.footer-container {
  width: 100%;
  margin-top: var(--gap-between-sections);
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
  margin-bottom: var(--gap-xl);
}

.footer-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.telescope-image {
  position: absolute;
  bottom: 0;
  left: 60%;
}

.deep-sky-objects-image {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 360px;
  height: auto;
}
</style>
