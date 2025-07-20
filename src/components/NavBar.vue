<template>
  <section class="container">
    <RouterLink class="nav-bar-home" to="/">Imad Saddik</RouterLink>

    <div>
      <RouterLink class="nav-bar-item" to="/blogs">Blogs</RouterLink>
      <RouterLink class="nav-bar-item" to="/courses">Courses</RouterLink>
      <RouterLink class="nav-bar-item" to="/astrophotography">Astrophotography</RouterLink>
      <RouterLink class="nav-bar-item" to="/about-me">About me</RouterLink>
      <RouterLink class="nav-bar-item" to="/hire-me">Hire me</RouterLink>
    </div>
  </section>
</template>

<script>
export default {
  name: "NavBar",
  components: {},
  data() {
    return {};
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.nav-bar-home {
  font-size: var(--font-size-page-title);
  font-weight: bold;
  text-decoration: none;
  color: var(--color-text-primary);
}

.nav-bar-home:hover {
  color: var(--color-text-primary);
}

.nav-bar-item {
  margin: var(--gap-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-paragraph);
}

.nav-bar-item:hover {
  color: var(--color-text-primary);
}

.selected {
  color: var(--color-text-primary);
  text-decoration: underline;
  text-decoration-thickness: 0.125rem;
  text-underline-offset: 0.625rem;
  text-decoration-color: var(--color-text-primary);
}
</style>
