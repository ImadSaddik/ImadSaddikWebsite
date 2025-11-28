<template>
  <div class="not-found-page-container">
    <img :src="notFoundIllustration" alt="404 Not Found" />
    <p>The page you are looking for does not exist. <router-link to="/">Go back to home</router-link></p>
  </div>
</template>

<script>
import notFoundIllustration from "@/assets/404_page.svg";

export default {
  name: "NotFoundPage",
  data() {
    return {
      notFoundIllustration,
    };
  },
  mounted() {
    document.title = "Page not found";
  },
};
</script>

<style scoped>
img {
  width: 70%;
  height: auto;
}

p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-xxl) 0;
  line-height: 1.6;
}

.not-found-page-container {
  width: 100%;
  text-align: center;
  margin-top: var(--gap-between-sections-medium);
  box-sizing: border-box;
}

@media screen and (max-width: 1500px) {
  img {
    width: 80%;
  }
}

@media screen and (max-width: 1100px) {
  img {
    width: 90%;
  }

  p {
    margin: var(--gap-xl) 0;
  }
}

@media screen and (max-width: 768px) {
  img {
    width: 100%;
  }

  p {
    margin: var(--gap-lg) 0;
  }

  .not-found-page-container {
    margin-top: var(--gap-between-sections-small);
  }
}
</style>
