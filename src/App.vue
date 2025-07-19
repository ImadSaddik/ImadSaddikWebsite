<template>
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

:root {
  /* Colors */
  --color-background: #03071e;
  --color-button-primary: #f97316;
  --color-button-secondary: #22d3ee;
  --color-text-primary: #e5e7eb;
  --color-text-secondary: #9ca3af;
  --color-text-disabled: #4b5563;

  /* Font sizes */
  --font-size-page-title: 2.1875rem; /* 35px */
  --font-size-section-title: 1.75rem; /* 28px */
  --font-size-sub-title: 1.4375rem; /* 23px */
  --font-size-paragraph: 1.125rem; /* 18px */

  /* Gaps */
  --gap-xs: 0.5rem; /* 8px */
  --gap-sm: 1rem; /* 16px */
  --gap-md: 1.5rem; /* 24px */
  --gap-lg: 2rem; /* 32px */
  --gap-xl: 3rem; /* 48px */

  background: var(--color-background);
}

#app {
  font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: var(--color-text-primary);
}
</style>
