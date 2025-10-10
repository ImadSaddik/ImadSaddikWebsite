<template>
  <NavBar :visited-page="visitedPage" />
  <RouterView @show-toast="handleShowToastEvent" @page-visited="handlePageVisitedEvent" />
  <StarBackground v-if="starEffectEnabled" />
  <MeteorShowers v-if="cometEffectEnabled" />
  <ScrollBackToTop />
  <FooterSection
    :star-effect-enabled="starEffectEnabled"
    :comet-effect-enabled="cometEffectEnabled"
    @star-effect-toggle="handleStarEffectToggle"
    @comet-effect-toggle="handleCometEffectToggle"
  />
  <ToastNotificationManager ref="toastManager" />
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import StarBackground from "@/components/StarBackground.vue";
import MeteorShowers from "./components/MeteorShowers.vue";
import ScrollBackToTop from "./components/ScrollBackToTop.vue";
import FooterSection from "@/components/FooterSection.vue";
import ToastNotificationManager from "@/components/ToastNotificationManager.vue";

// Constants
import { STAR_EFFECT_TOGGLE_LOCAL_STORAGE_KEY, COMET_EFFECT_TOGGLE_LOCAL_STORAGE_KEY } from "@/constants";

export default {
  name: "App",
  components: {
    NavBar,
    MeteorShowers,
    StarBackground,
    ScrollBackToTop,
    FooterSection,
    ToastNotificationManager,
  },
  data() {
    return {
      visitedPage: "",
      starEffectEnabled: true,
      cometEffectEnabled: true,
    };
  },
  mounted() {
    this.loadEffectsPreference();
  },
  methods: {
    handleStarEffectToggle(enabled) {
      this.starEffectEnabled = enabled;
    },
    handleCometEffectToggle(enabled) {
      this.cometEffectEnabled = enabled;
    },
    loadEffectsPreference() {
      const storedStarEffectEnabled = localStorage.getItem(STAR_EFFECT_TOGGLE_LOCAL_STORAGE_KEY);
      const storedCometEffectEnabled = localStorage.getItem(COMET_EFFECT_TOGGLE_LOCAL_STORAGE_KEY);
      if (storedStarEffectEnabled !== null) {
        this.starEffectEnabled = JSON.parse(storedStarEffectEnabled);
      }
      if (storedCometEffectEnabled !== null) {
        this.cometEffectEnabled = JSON.parse(storedCometEffectEnabled);
      }
    },
    handleShowToastEvent(data) {
      this.$refs.toastManager.showToast(data);
    },
    handlePageVisitedEvent(pageKey) {
      this.visitedPage = pageKey;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

:root {
  /* General colors */
  --color-background: #03071e;
  --color-primary: #f97316;
  --color-primary-hover: #cb5f12;
  --color-secondary: #22d3ee;
  --color-secondary-hover: #167595;
  --color-disabled: #4b5563;

  /* Text colors */
  --color-text-primary: #e5e7eb;
  --color-text-secondary: #9ca3af;
  --color-text-disabled: #4b5563;

  /* Tag colors */
  --color-tag-background: #22d3ee1a;
  --color-tag-background-hover: #22d3ee26;
  --color-tag-border: #22d3ee33;
  --color-tag-border-hover: #22d3ee4d;

  /* Code colors */
  --color-code-night-owl-background: #011627;
  --color-code-highlighted-background: #00ddff22;
  --color-code-line-inset-background: #82aaff;
  --color-code-border: #444654;

  /* Toast colors */
  --color-toast-error-background: #af1a1a;
  --color-toast-error-foreground: #ffffff;
  --color-toast-success-background: #10662f;
  --color-toast-success-foreground: #ffffff;
  --color-toast-warning-background: #e87800;
  --color-toast-warning-foreground: #000000;
  --color-toast-info-background: #5996f7;
  --color-toast-info-foreground: #000000;

  /* Admonition colors */
  --color-admonition-note-background: #9ca3af1a;
  --color-admonition-note-border: #9ca3af;
  --color-admonition-tip-background: #22c55e1a;
  --color-admonition-tip-border: #22c55e;
  --color-admonition-info-background: #5996f71a;
  --color-admonition-info-border: #5996f7;
  --color-admonition-warning-background: #e878001a;
  --color-admonition-warning-border: #e87800;
  --color-admonition-danger-background: #ef44441a;
  --color-admonition-danger-border: #ef4444;

  /* Modal */
  --color-background-overlay: #000000cc;

  /* Shadow colors */
  --color-shadow: rgba(0, 0, 0, 0.1);
  --color-shadow-hover: rgba(0, 0, 0, 0.15);

  /* Font sizes */
  --font-size-big: 3rem; /* 48px */
  --font-size-big-medium: 2rem; /* 32px */
  --font-size-medium: 1.5rem; /* 24px */
  --font-size-big-small: 1.25rem; /* 20px */
  --font-size-small: 1.125rem; /* 18px */
  --font-size-extra-small: 0.875rem; /* 14px */

  /* Gaps */
  --gap-xs: 0.5rem; /* 8px */
  --gap-sm: 1rem; /* 16px */
  --gap-md: 1.5rem; /* 24px */
  --gap-lg: 2rem; /* 32px */
  --gap-xl: 3rem; /* 48px */
  --gap-xxl: 4rem; /* 64px */

  /* Gaps between sections */
  --gap-between-sections-small: 5rem;
  --gap-between-sections-medium: 10rem;
  --gap-between-sections-big: 15rem;
}

::selection {
  background: var(--color-primary);
  color: var(--color-background);
}

html {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) var(--color-background); /* Thumb color then track color */
}

#app {
  font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: var(--color-text-primary);
  caret-color: var(--color-primary);
  max-width: 2000px;
  margin: 0 auto;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background: var(--color-background);
  cursor: url("@/assets/customCursor.svg"), auto;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.title {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-xl);
}

.paragraph {
  font-size: var(--font-size-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--gap-xl);
  margin-top: 0;
  text-align: center;
}

.primary-button {
  cursor: pointer;
  color: black;
  background-color: var(--color-primary);
  border: none;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: var(--color-primary-hover);
}

.secondary-button {
  cursor: pointer;
  color: var(--color-secondary);
  background-color: transparent;
  border: 1px solid var(--color-secondary);
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-secondary-hover);
}

.clickable-header-link {
  color: var(--color-text-primary);
}

@media screen and (max-width: 1900px) {
  .title {
    font-size: var(--font-size-big-medium);
  }
}
</style>
