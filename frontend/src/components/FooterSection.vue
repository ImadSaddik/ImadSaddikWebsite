<template>
  <section class="footer-container">
    <div class="footer-content">
      <div class="footer-name-and-mission">
        <RouterLink to="/"><h3 class="footer-name">Imad Saddik</h3></RouterLink>
        <p class="footer-mission">Sharing knowledge about programming and astronomy.</p>
      </div>

      <div class="footer-columns-container">
        <div class="footer-column">
          <h4 class="footer-column-title">Explore</h4>
          <RouterLink to="/"><p class="clickable">Home</p></RouterLink>
          <RouterLink to="/blogs"><p class="clickable">Blogs</p></RouterLink>
          <RouterLink to="/courses"><p class="clickable">Courses</p></RouterLink>
          <RouterLink to="/astronomy"><p class="clickable">Astronomy</p></RouterLink>
          <RouterLink to="/about-me"><p class="clickable">About me</p></RouterLink>
          <RouterLink to="/hire-me"><p class="clickable">Hire me</p></RouterLink>
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">Connect</h4>
          <div class="footer-icon-text-container">
            <img :src="githubLogo" alt="GitHub logo" />
            <a class="clickable" href="https://github.com/ImadSaddik" target="_blank" rel="noopener noreferrer"
              >GitHub</a
            >
          </div>

          <div class="footer-icon-text-container">
            <img :src="huggingFaceLogo" alt="Hugging Face logo" />
            <a class="clickable" href="https://huggingface.co/ImadSaddik" target="_blank" rel="noopener noreferrer"
              >Hugging Face</a
            >
          </div>

          <div class="footer-icon-text-container">
            <img :src="youtubeLogo" alt="YouTube logo" />
            <a class="clickable" href="https://www.youtube.com/@3CodeCampers" target="_blank" rel="noopener noreferrer"
              >YouTube</a
            >
          </div>

          <div class="footer-icon-text-container">
            <img :src="mediumLogo" alt="Medium logo" />
            <a class="clickable" href="https://medium.com/@imadsaddik" target="_blank" rel="noopener noreferrer"
              >Medium</a
            >
          </div>

          <div class="footer-icon-text-container">
            <img :src="linkedinLogo" alt="LinkedIn logo" />
            <a
              class="clickable"
              href="https://www.linkedin.com/in/imadsaddik/"
              target="_blank"
              rel="noopener noreferrer"
              >LinkedIn</a
            >
          </div>
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">Built with</h4>

          <div class="footer-icon-text-container">
            <img :src="vueLogo" alt="Vue.js logo" />
            <a class="clickable" href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue.js</a>
          </div>

          <div class="footer-icon-text-container">
            <img :src="pythonLogo" alt="Python logo" />
            <a class="clickable" href="https://www.python.org/" target="_blank" rel="noopener noreferrer">Python</a>
          </div>

          <div class="footer-icon-text-container">
            <img :src="inkscapeLogo" alt="Inkscape logo" />
            <a class="clickable" href="https://inkscape.org/" target="_blank" rel="noopener noreferrer">Inkscape</a>
          </div>
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">Contact</h4>
          <a class="clickable" href="mailto:simad3647@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
          <a class="clickable" href="https://calendly.com/simad3647/30min" target="_blank" rel="noopener noreferrer"
            >Book a meeting</a
          >
          <a
            class="clickable"
            href="https://github.com/ImadSaddik/ImadSaddikWebsite/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            >Report an issue</a
          >
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">Preferences</h4>

          <div class="footer-effects-toggle-buttons">
            <label for="star-effect" class="effects-toggle">
              <span
                class="effects-toggle-label clickable"
                tabindex="0"
                role="button"
                :aria-pressed="starEffectEnabled"
                @keydown.enter.prevent="handleStarEffectToggle(!starEffectEnabled)"
                @keydown.space.prevent="handleStarEffectToggle(!starEffectEnabled)"
                >Star effect</span
              >
              <input
                id="star-effect"
                type="checkbox"
                :checked="starEffectEnabled"
                @change="handleStarEffectToggle($event.target.checked)"
              />
              <span class="effects-slider"></span>
            </label>

            <label for="meteorite-effect" class="effects-toggle">
              <span
                class="effects-toggle-label clickable"
                tabindex="0"
                role="button"
                :aria-pressed="meteoriteEffectEnabled"
                @keydown.enter.prevent="handleMeteoriteEffectToggle(!meteoriteEffectEnabled)"
                @keydown.space.prevent="handleMeteoriteEffectToggle(!meteoriteEffectEnabled)"
                >Meteorite effect</span
              >
              <input
                id="meteorite-effect"
                type="checkbox"
                :checked="meteoriteEffectEnabled"
                @change="handleMeteoriteEffectToggle($event.target.checked)"
              />
              <span class="effects-slider"></span>
            </label>

            <label for="custom-cursor" class="effects-toggle">
              <span
                class="effects-toggle-label clickable"
                tabindex="0"
                role="button"
                :aria-pressed="customCursorEnabled"
                @keydown.enter.prevent="handleCustomCursorToggle(!customCursorEnabled)"
                @keydown.space.prevent="handleCustomCursorToggle(!customCursorEnabled)"
                >Custom cursor</span
              >
              <input
                id="custom-cursor"
                type="checkbox"
                :checked="customCursorEnabled"
                @change="handleCustomCursorToggle($event.target.checked)"
              />
              <span class="effects-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="footer-rights">
        <p>All rights reserved &copy; {{ currentYear }} Imad Saddik</p>
      </div>

      <div class="footer-images">
        <img class="landscape-image" :src="footerLandscape" alt="A beautiful landscape." />
        <img class="moon-image" :src="moonPhaseImage" alt="An image of a crescent moon." />
      </div>
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
import pythonLogo from "@/assets/logos/python.svg";
import svgRepoLogo from "@/assets/logos/svg_repo.svg";
import fontAwesomeLogo from "@/assets/logos/fontAwesome.svg";

// Images
import footerLandscape from "@/assets/footer_landscape.svg";

// Constants
import {
  STAR_EFFECT_TOGGLE_LOCAL_STORAGE_KEY,
  METEORITE_EFFECT_TOGGLE_LOCAL_STORAGE_KEY,
  CUSTOM_CURSOR_TOGGLE_LOCAL_STORAGE_KEY,
  KNOWN_NEW_MOON_DATE,
  LUNAR_MONTH_DAYS,
} from "@/constants";

export default {
  name: "FooterSection",
  emits: ["star-effect-toggle", "meteorite-effect-toggle", "custom-cursor-toggle"],
  props: {
    starEffectEnabled: {
      type: Boolean,
      default: true,
    },
    meteoriteEffectEnabled: {
      type: Boolean,
      default: true,
    },
    customCursorEnabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },

    moonPhaseImage() {
      const lunarDay = this.getLunarDay();
      return require(`@/assets/moon_phases/moon_day_${lunarDay}.svg`);
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
      pythonLogo,
      svgRepoLogo,
      fontAwesomeLogo,

      footerLandscape,
    };
  },
  methods: {
    handleStarEffectToggle(value) {
      this.$emit("star-effect-toggle", value);
      localStorage.setItem(STAR_EFFECT_TOGGLE_LOCAL_STORAGE_KEY, value);
    },
    handleMeteoriteEffectToggle(value) {
      this.$emit("meteorite-effect-toggle", value);
      localStorage.setItem(METEORITE_EFFECT_TOGGLE_LOCAL_STORAGE_KEY, value);
    },
    handleCustomCursorToggle(value) {
      this.$emit("custom-cursor-toggle", value);
      localStorage.setItem(CUSTOM_CURSOR_TOGGLE_LOCAL_STORAGE_KEY, value);
    },
    getLunarDay() {
      const now = new Date();
      const millisecondsInDay = 1000 * 60 * 60 * 24;
      const daysSinceKnownNewMoon = (now.getTime() - KNOWN_NEW_MOON_DATE.getTime()) / millisecondsInDay;

      const lunarDayFloat = daysSinceKnownNewMoon % LUNAR_MONTH_DAYS;
      const lunarDayInteger = Math.ceil(lunarDayFloat);
      return Math.max(1, Math.min(30, lunarDayInteger));
    },
  },
};
</script>

<style scoped>
a,
p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: 0;
}

a:hover,
p:hover {
  color: var(--color-text-secondary);
  text-decoration: none;
  cursor: default;
}

.clickable:hover {
  color: var(--color-primary);
  cursor: pointer;
}

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

.footer-content {
  padding: var(--gap-xl);
}

.footer-name-and-mission > a {
  display: inline-block;
  width: auto;
  margin-top: 5rem;
}

.footer-name {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: 0;
  color: var(--color-text-primary);
}

.footer-name:hover {
  color: var(--color-primary);
  cursor: pointer;
}

.footer-mission {
  margin: var(--gap-md) 0;
  color: var(--color-text-secondary);
}

.footer-icon-text-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-sm);
}

.footer-icon-text-container img {
  width: 28px;
}

.footer-rights {
  margin-top: var(--gap-between-sections-big);
}

.footer-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.landscape-image {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: -1;
}

.moon-image {
  position: absolute;
  top: 75px;
  right: 75px;
  width: 75px;
  height: auto;
}

.footer-effects-toggle-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.effects-toggle {
  display: inline-flex;
  align-items: center;
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
  margin-left: auto;
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
  margin-right: 1rem;
}

.footer-columns-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--gap-xxl);
  margin-top: var(--gap-xl);
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  min-width: 150px;
}

.footer-column-title {
  font-size: var(--font-size-small);
  margin-bottom: 0;
  color: var(--color-text-primary);
}

@media screen and (max-width: 1500px) {
  .footer-container {
    margin-top: var(--gap-between-sections-medium);
  }

  .footer-name-and-mission > a {
    margin-top: var(--gap-xl);
  }

  .moon-image {
    position: absolute;
    top: 50%;
    right: 75px;
  }
}

@media screen and (max-width: 1300px) {
  .moon-image {
    position: absolute;
    top: 60%;
    right: 75px;
  }
}

@media screen and (max-width: 1100px) {
  .footer-content {
    padding: var(--gap-lg);
  }

  .footer-name-and-mission > a {
    margin-top: var(--gap-xl);
  }

  .footer-name {
    font-size: var(--font-size-big-medium);
  }

  .footer-rights {
    margin: var(--gap-between-sections-small) 0;
  }

  .footer-columns-container {
    gap: var(--gap-lg);
  }

  .footer-images {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .footer-container {
    margin-top: var(--gap-between-sections-small);
  }

  .footer-content {
    padding: var(--gap-md);
  }

  .footer-icon-text-container img {
    height: 24px;
  }

  .footer-rights {
    margin: var(--gap-between-sections-small) 0;
  }

  .footer-columns-container {
    gap: var(--gap-md);
  }
}
</style>
