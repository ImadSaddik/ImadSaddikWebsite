<template>
  <section class="container">
    <div class="actions">
      <h1 class="title">Explore articles and courses I create about coding and the cosmos.</h1>

      <button class="primary-button">Explore articles</button>
      <button class="secondary-button">View courses</button>
    </div>

    <div class="image">
      <img src="@/assets/hero_section/blue_galaxy.svg" alt="Blue Galaxy" />
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: var(--gap-xxl);
  padding: var(--gap-xl);
  /* background-color: rgb(36, 13, 25); */
}

.actions {
  flex: 1;
  color: white;
}

.primary-button {
  color: var(--color-text-primary);
  background-color: var(--color-button-primary);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sub-title);
  font-weight: 600;
  padding: var(--gap-sm) var(--gap-md);
  margin-right: var(--gap-md);
  width: 250px;
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
  font-size: var(--font-size-sub-title);
  font-weight: 600;
  padding: var(--gap-sm) var(--gap-md);
  width: 250px;
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-button-secondary-hover);
}

.title {
  font-size: var(--font-size-page-huge-title);
  margin-bottom: var(--gap-xl);
}

.image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image img {
  width: 75%;
  height: auto;
}
</style>
