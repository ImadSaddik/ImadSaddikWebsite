<template>
  <NavBar />
  <router-view />
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
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
  --font-size-medium: 1.5rem; /* 24px */
  --font-size-small: 1.125rem; /* 18px */

  /* Gaps */
  --gap-xs: 0.5rem; /* 8px */
  --gap-sm: 1rem; /* 16px */
  --gap-md: 1.5rem; /* 24px */
  --gap-lg: 2rem; /* 32px */
  --gap-xl: 3rem; /* 48px */
  --gap-xxl: 4rem; /* 64px */
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

.primary-button {
  color: var(--color-text-primary);
  background-color: var(--color-button-primary);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-medium);
  font-weight: 600;
  padding: var(--gap-sm) var(--gap-md);
  margin-right: var(--gap-md);
  width: 300px;
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
  width: 300px;
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-button-secondary-hover);
}
</style>
