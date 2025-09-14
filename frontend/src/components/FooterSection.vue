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
        <a href="mailto:simad3647@gmail.com" target="_blank" rel="noopener noreferrer">
          <img :src="emailLogo" alt="Email logo" />
        </a>
      </div>

      <div class="footer-effects-container">
        <p>Your browser can't handle the star and meteor shower effects?</p>
        <label class="effects-toggle">
          <input type="checkbox" :checked="effectsEnabled" @change="handleEffectsToggle($event.target.checked)" />
          <span class="effects-slider"></span>
          <span class="effects-toggle-label">{{ toggleLabel }}</span>
        </label>
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
        All rights reserved &copy; {{ currentYear }} Imad Saddik
      </p>
    </div>

    <div class="footer-images">
      <img
        class="telescope-image"
        :src="telescopeImage"
        alt="White telescope on a tripod pointing toward the night sky."
      />
      <img class="moon-image" :src="crescentMoon" alt="An image of a crescent moon." />
    </div>
  </section>
</template>

<script>
// Logos
import githubLogo from "@/assets/logos/github.svg";
import huggingFaceLogo from "@/assets/logos/huggingFace.svg";
import youtubeLogo from "@/assets/logos/youtube.svg";
import mediumLogo from "@/assets/logos/medium.svg";
import linkedinLogo from "@/assets/logos/linkedin.svg";
import inkscapeLogo from "@/assets/logos/inkscape.svg";
import vueLogo from "@/assets/logos/vue.svg";
import emailLogo from "@/assets/logos/email.svg";

// Images
import telescopeImage from "@/assets/telescope.svg";
import crescentMoon from "@/assets/crescentMoon.svg";

// Constants
import { EFFECTS_TOGGLE_LOCAL_STORAGE_KEY } from "@/constants";

export default {
  name: "FooterSection",
  emits: ["effects-toggle"],
  props: {
    effectsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    toggleLabel() {
      return this.effectsEnabled ? "On" : "Off";
    },
  },
  data() {
    return {
      githubLogo,
      huggingFaceLogo,
      youtubeLogo,
      mediumLogo,
      linkedinLogo,
      inkscapeLogo,
      vueLogo,
      emailLogo,

      telescopeImage,
      crescentMoon,
    };
  },
  methods: {
    handleEffectsToggle(value) {
      this.$emit("effects-toggle", value);
      localStorage.setItem(EFFECTS_TOGGLE_LOCAL_STORAGE_KEY, value);
    },
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

.moon-image {
  position: absolute;
  top: 100px;
  right: 100px;
  width: 50px;
  height: auto;
}

.footer-effects-container {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: var(--gap-lg);
  margin-bottom: 0rem;
}

.footer-effects-container p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: 0;
}

.effects-toggle {
  display: inline-flex;
  align-items: center;
  margin-left: 1rem;
  cursor: pointer;
  user-select: none;
}

.effects-toggle input[type="checkbox"] {
  display: none;
}

.effects-slider {
  width: 44px;
  height: 24px;
  background: var(--color-text-secondary);
  position: relative;
  transition: background 0.3s;
  margin-right: 0.5rem;
}

.effects-slider::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 4px;
  width: 16px;
  height: 16px;
  background: var(--color-background);
  transition: transform 0.3s;
}

.effects-toggle input:checked + .effects-slider {
  background: var(--color-primary);
}

.effects-toggle input:checked + .effects-slider::before {
  transform: translateX(20px);
  background: var(--color-text-primary);
}

.effects-toggle-label {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-left: 0.25rem;
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
    width: 35%;
  }

  .footer-effects-container {
    width: 45%;
  }
}

@media screen and (max-width: 1100px) {
  .footer-content {
    padding: var(--gap-lg);
  }

  .footer-images {
    display: none;
  }

  .footer-title {
    font-size: var(--font-size-big-medium);
    margin-top: var(--gap-lg);
    margin-bottom: var(--gap-sm);
  }

  .footer-credits {
    margin-bottom: 3rem;
    width: 100%;
  }

  .footer-effects-container {
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

@media screen and (max-width: 576px) {
  .effects-toggle {
    margin-left: 1rem;
  }

  .effects-toggle-label {
    display: none;
  }
}
</style>
