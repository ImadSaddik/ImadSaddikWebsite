<template>
  <section class="footer-container">
    <div class="footer-content">
      <div class="footer-name-and-mission">
        <RouterLink :to="ROUTES.HOME.path"><h3 class="footer-name">Imad Saddik</h3></RouterLink>
        <p class="footer-mission">Sharing knowledge about programming and astronomy.</p>
      </div>

      <div class="footer-columns-container">
        <div class="footer-column">
          <h4 class="footer-column-title">Explore</h4>
          <RouterLink v-for="item in footerNavItems" :key="item.key" :to="item.path">
            <p class="clickable">{{ item.name }}</p>
          </RouterLink>
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
            <img :src="nginxLogo" alt="Nginx logo" />
            <a class="clickable" href="https://nginx.org/" target="_blank" rel="noopener noreferrer">Nginx</a>
          </div>

          <div class="footer-icon-text-container">
            <img :src="meilisearchLogo" alt="Meilisearch logo" />
            <a class="clickable" href="https://www.meilisearch.com/" target="_blank" rel="noopener noreferrer"
              >Meilisearch</a
            >
          </div>
        </div>

        <div class="footer-column">
          <h4 class="footer-column-title">Contact</h4>
          <a class="clickable" href="mailto:simad3647@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
          <a class="clickable" href="https://imadsaddik.com/resume" target="_blank" rel="noopener noreferrer">Resume</a>
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
          <h4 class="footer-column-title">Support</h4>

          <div class="footer-icon-text-container">
            <img :src="githubLogo" alt="GitHub sponsors logo" />
            <a class="clickable" href="https://github.com/sponsors/ImadSaddik" target="_blank" rel="noopener noreferrer"
              >GitHub</a
            >
          </div>

          <div class="footer-icon-text-container">
            <img :src="patreonLogo" alt="Patreon logo" />
            <a class="clickable" href="https://www.patreon.com/3CodeCamp" target="_blank" rel="noopener noreferrer"
              >Patreon</a
            >
          </div>

          <div class="footer-icon-text-container">
            <img :src="paypalLogo" alt="PayPal logo" />
            <a
              class="clickable"
              href="https://www.paypal.com/paypalme/ImadSaddik"
              target="_blank"
              rel="noopener noreferrer"
              >PayPal</a
            >
          </div>
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

            <label for="wide-articles" class="effects-toggle">
              <span
                class="effects-toggle-label clickable"
                tabindex="0"
                role="button"
                :aria-pressed="wideArticlesEnabled"
                @keydown.enter.prevent="handleWideArticlesToggle(!wideArticlesEnabled)"
                @keydown.space.prevent="handleWideArticlesToggle(!wideArticlesEnabled)"
                >Wide articles</span
              >
              <input
                id="wide-articles"
                type="checkbox"
                :checked="wideArticlesEnabled"
                @change="handleWideArticlesToggle($event.target.checked)"
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
        <div class="moon-wrapper">
          <img class="moon-image" :src="moonPhaseImage" alt="An image of today's moon phase." />
          <span class="moon-tooltip">Illumination: {{ lunarData.percentage }}%</span>
        </div>
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
import vueLogo from "@/assets/logos/vue.svg";
import emailLogo from "@/assets/logos/email.svg";
import pythonLogo from "@/assets/logos/python.svg";
import svgRepoLogo from "@/assets/logos/svg_repo.svg";
import fontAwesomeLogo from "@/assets/logos/fontAwesome.svg";
import patreonLogo from "@/assets/logos/patreon.svg";
import paypalLogo from "@/assets/logos/paypal.svg";
import nginxLogo from "@/assets/logos/nginx.svg";
import meilisearchLogo from "@/assets/logos/meilisearch.svg";

// Images
import footerLandscape from "@/assets/footer_landscape.svg";

// Constants
import { moonPhaseImages } from "@/registries/images.js";
import { ROUTES, PAGE_KEYS, PAGE_NAMES } from "@/constants";

export default {
  name: "FooterSection",
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
    wideArticlesEnabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["star-effect-toggle", "meteorite-effect-toggle", "custom-cursor-toggle", "wide-articles-toggle"],
  data() {
    return {
      githubLogo,
      huggingFaceLogo,
      youtubeLogo,
      mediumLogo,
      linkedinLogo,
      vueLogo,
      emailLogo,
      pythonLogo,
      svgRepoLogo,
      fontAwesomeLogo,
      patreonLogo,
      paypalLogo,
      nginxLogo,
      meilisearchLogo,
      footerLandscape,

      footerNavItems: [
        { name: PAGE_NAMES[PAGE_KEYS.HOME], path: ROUTES.HOME.path, key: PAGE_KEYS.HOME },
        { name: PAGE_NAMES[PAGE_KEYS.BLOGS], path: ROUTES.BLOGS_HUB.path, key: PAGE_KEYS.BLOGS },
        { name: PAGE_NAMES[PAGE_KEYS.COURSES], path: ROUTES.COURSES_HUB.path, key: PAGE_KEYS.COURSES },
        { name: PAGE_NAMES[PAGE_KEYS.ASTRONOMY], path: ROUTES.ASTRONOMY_HUB.path, key: PAGE_KEYS.ASTRONOMY },
        { name: PAGE_NAMES[PAGE_KEYS.ABOUT_ME], path: ROUTES.ABOUT_ME.path, key: PAGE_KEYS.ABOUT_ME },
        { name: PAGE_NAMES[PAGE_KEYS.HIRE_ME], path: ROUTES.HIRE_ME.path, key: PAGE_KEYS.HIRE_ME },
      ],

      ROUTES,
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    lunarData() {
      return this.getLunarData();
    },
    moonPhaseImage() {
      const lunarDay = this.lunarData.dayIndex;
      const imagePath = `/src/assets/moon_phases/moon_day_${lunarDay}.svg`;
      const fallbackPath = "/src/assets/moon_phases/moon_day_15.svg";
      return moonPhaseImages[imagePath] || moonPhaseImages[fallbackPath];
    },
  },
  methods: {
    handleStarEffectToggle(value) {
      this.$emit("star-effect-toggle", value);
    },
    handleMeteoriteEffectToggle(value) {
      this.$emit("meteorite-effect-toggle", value);
    },
    handleCustomCursorToggle(value) {
      this.$emit("custom-cursor-toggle", value);
    },
    handleWideArticlesToggle(value) {
      this.$emit("wide-articles-toggle", value);
    },
    getLunarData() {
      const date = new Date();
      const time = date.getTime() / 86400000 + 2440587.5;
      const T = (time - 2451545.0) / 36525.0;
      const rad = (deg) => deg * (Math.PI / 180);

      // Mean Anomaly Sun (M)
      let M_sun = 357.52911 + 35999.05029 * T;
      M_sun %= 360;

      // Mean Anomaly Moon (M')
      let M_moon = 134.9634 + 477198.86751 * T;
      M_moon %= 360;

      // Mean Elongation (D)
      let D = 297.8502 + 445267.11151 * T;
      D %= 360;

      // Phase Angle calculation (Meeus)
      const phaseAngle =
        180 -
        D -
        6.289 * Math.sin(rad(M_moon)) +
        2.1 * Math.sin(rad(M_sun)) -
        1.274 * Math.sin(rad(2 * D - M_moon)) -
        0.658 * Math.sin(rad(2 * D)) -
        0.214 * Math.sin(rad(2 * M_moon)) -
        0.11 * Math.sin(rad(D));

      // 1. Calculate Percentage
      const k = (1 + Math.cos(rad(phaseAngle))) / 2;
      const percentage = Math.round(k * 100);

      // 2. Calculate Day Index (1-30) for your images
      // We reverse the phase angle to get age (0-360 degrees)
      // We normalize negative angles to be positive
      let angleForAge = (180 - phaseAngle) % 360;
      if (angleForAge < 0) angleForAge += 360;

      // Map 0-360 degrees to 1-30 days
      let dayIndex = Math.floor((angleForAge / 360) * 30) + 1;

      return { percentage, dayIndex };
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

.moon-wrapper {
  position: absolute;
  top: 75px;
  right: 75px;
  width: 75px;
  height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
}

.moon-image {
  width: 100%;
  height: auto;
  filter: none;
  border-radius: 50%;
  transition: filter 0.3s;
}

.moon-tooltip {
  margin-top: var(--gap-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  white-space: nowrap;
}

.moon-wrapper:hover .moon-image {
  filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.3));
}

.moon-wrapper:hover .moon-tooltip {
  opacity: 1;
  visibility: visible;
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
  gap: var(--gap-2xl);
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

  .footer-columns-container {
    width: 80%;
  }

  .footer-name-and-mission > a {
    margin-top: var(--gap-xl);
  }

  .moon-wrapper {
    top: 40%;
  }
}

@media screen and (max-width: 1300px) {
  .moon-wrapper {
    top: 60%;
  }
}

@media screen and (max-width: 1100px) {
  .footer-content {
    padding: var(--gap-lg);
  }

  .footer-columns-container {
    width: 100%;
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

  label[for="wide-articles"],
  label[for="custom-cursor"] {
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
