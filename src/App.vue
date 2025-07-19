<template>
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

:root {
  --color-background: #03071e;
  --color-button-primary: #f97316;
  --color-button-secondary: #22d3ee;
  --color-text-primary: #e5e7eb;
  --color-text-secondary: #9ca3af;
  --color-text-disabled: #4b5563;

  background: var(--color-background);
}

#app {
  font-family: "Inter", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: var(--color-text-primary);
}
</style>
