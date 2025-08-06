<template>
  <section class="footer-container">
    <div class="footer-content">
      <h3 class="footer-title">Imad Saddik</h3>
      <p class="footer-description">Programming, exploring the sky, and sharing everything I learn.</p>

      <div class="footer-logos">
        <a href="https://github.com/ImadSaddik" target="_blank" rel="noopener noreferrer">
          <img :src="githubLogo" alt="GitHub logo" />
        </a>
        <a href="https://huggingface.co/ImadSaddik" target="_blank" rel="noopener noreferrer">
          <img :src="huggingFaceLogo" alt="Hugging Face logo" />
        </a>
        <a href="https://www.youtube.com/@3CodeCampers" target="_blank" rel="noopener noreferrer">
          <img :src="youtubeLogo" alt="YouTube logo" />
        </a>
        <a href="https://medium.com/@imadsaddik" target="_blank" rel="noopener noreferrer">
          <img :src="mediumLogo" alt="Medium logo" />
        </a>
        <a href="https://www.linkedin.com/in/imadsaddik/" target="_blank" rel="noopener noreferrer">
          <img :src="linkedinLogo" alt="LinkedIn logo" />
        </a>
      </div>

      <p class="footer-credits">
        Built with
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
          <img :src="vueLogo" alt="Vue.js logo" class="footer-credit-logo" />
        </a>
        &amp; illustrations made in
        <a href="https://inkscape.org/" target="_blank" rel="noopener noreferrer">
          <img :src="inkscapeLogo" alt="Inkscape logo" class="footer-credit-logo" /> </a
        >.
        <span class="separator">|</span>
        All rights reserved © {{ currentYear }} Imad Saddik
      </p>
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
import inkscapeLogo from "@/assets/logos/inkscape.svg";
import vueLogo from "@/assets/logos/vue.svg";

// Images
import telescopeImage from "@/assets/telescope.svg";
import objectsImage from "@/assets/objects_telescope_looking_at.svg";

export default {
  name: "FooterSection",
  data() {
    return {
      currentYear: new Date().getFullYear(),

      githubLogo,
      huggingFaceLogo,
      youtubeLogo,
      mediumLogo,
      linkedinLogo,
      inkscapeLogo,
      vueLogo,

      telescopeImage,
      objectsImage,
    };
  },
};
</script>

<style scoped>
.footer-container {
  width: 100%;
  margin-top: var(--gap-between-sections-big);
  position: relative;
}

.footer-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 1px;
  background-color: var(--color-text-secondary);
  z-index: 1;
}

.footer-title {
  font-size: var(--font-size-big);
  margin-top: 5rem;
  margin-bottom: var(--gap-sm);
}

.footer-description {
  font-size: var(--font-size-small);
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
}

.footer-logos img {
  height: 40px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.footer-logos img:hover {
  filter: brightness(0.9);
}

.footer-credit-logo {
  height: 32px;
  vertical-align: middle;
}

.footer-credit-logo:hover {
  filter: brightness(0.9);
}

.footer-credits {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--gap-lg);
  margin-bottom: 5rem;
  width: 100%;
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
  left: 50%;
}

.deep-sky-objects-image {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 360px;
  height: auto;
}

@media screen and (max-width: 2000px) {
  .footer-content {
    padding: var(--gap-lg);
  }
}

@media screen and (max-width: 1500px) {
  .footer-container {
    margin-top: var(--gap-between-sections-medium);
  }

  .footer-title {
    margin-top: var(--gap-xl);
    margin-bottom: var(--gap-md);
  }

  .footer-logos {
    gap: var(--gap-sm);
  }

  .footer-logos img {
    height: 32px;
  }

  .telescope-image {
    position: absolute;
    bottom: 0;
    left: 40%;
  }

  .footer-credits {
    width: 30%;
  }
}

@media screen and (max-width: 1100px) {
  .footer-images {
    display: none;
  }

  .footer-title {
    font-size: var(--font-size-big-medium);
    margin-top: var(--gap-lg);
    margin-bottom: var(--gap-sm);
  }

  .footer-credits {
    margin-bottom: 0;
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .footer-container {
    margin-top: var(--gap-between-sections-small);
  }

  .footer-content {
    padding: var(--gap-md);
  }

  .footer-logos {
    gap: var(--gap-xs);
  }

  .footer-logos img {
    height: 24px;
  }

  .footer-credit-logo {
    height: 24px;
  }
}
</style>
