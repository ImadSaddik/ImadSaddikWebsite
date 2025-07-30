<template>
  <NavBar />
  <RouterView />
  <StarBackground />
  <MeteorShowers />
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import StarBackground from "@/components/StarBackground.vue";
import MeteorShowers from "./components/MeteorShowers.vue";

export default {
  name: "App",
  components: {
    NavBar,
    MeteorShowers,
    StarBackground,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

:root {
  /* Colors */
  --color-background: #03071e;
  --color-button-primary: #f97316;
  --color-button-primary-hover: #cb5f12;
  --color-button-secondary: #22d3ee;
  --color-button-secondary-hover: #167595;
  --color-text-primary: #e5e7eb;
  --color-text-secondary: #9ca3af;
  --color-text-disabled: #4b5563;

  /* Font sizes */
  --font-size-big: 3rem; /* 48px */
  --font-size-big-medium: 2rem; /* 32px */
  --font-size-medium: 1.5rem; /* 24px */
  --font-size-small: 1.125rem; /* 18px */

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
  background: var(--color-button-primary);
  color: var(--color-background);
}

#app {
  font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: var(--color-text-primary);
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
  background: var(--color-background);
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
  background-color: var(--color-button-primary);
  border: none;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: var(--color-button-primary-hover);
}

.secondary-button {
  cursor: pointer;
  color: var(--color-button-secondary);
  background-color: transparent;
  border: 1px solid var(--color-button-secondary);
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-button-secondary-hover);
}

@media screen and (max-width: 1900px) {
  .title {
    font-size: var(--font-size-big-medium);
  }
}

@media screen and (max-width: 1300px) {
}

@media screen and (max-width: 768px) {
}

@media screen and (max-width: 672px) {
}

@media screen and (max-width: 576px) {
}
</style>
