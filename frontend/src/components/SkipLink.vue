<template>
  <div>
    <a href="#skip-link" class="skip-link">Skip to main content</a>
  </div>
</template>

<script>
export default {
  name: "SkipLink",
};
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: 16px;
  left: -999px;
  width: 200px;
  padding: var(--gap-sm) var(--gap-xs);
  color: #000;
  background-color: var(--color-primary);
  font-size: var(--font-size-small);
  font-weight: 600;
  text-align: center;
  transition:
    left 0.2s ease,
    background-color 0.3s ease;
  z-index: 1000;
}

.skip-link:hover {
  background-color: var(--color-primary-hover);
}

.skip-link:focus {
  left: 16px;
}
</style>
