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
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

.not-found-page-container {
  text-align: center;
  margin-top: 50px;
}
</style>
