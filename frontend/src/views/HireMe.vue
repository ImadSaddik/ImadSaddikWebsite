<template>
  <div class="hire-me-container">
    <section>
      <h1>Let's build something great</h1>
      <p>
        I'm an engineer and technical educator with experience in <b>web & mobile development</b> and
        <b>AI & Data Science</b>. I help individuals and organizations achieve their goals through high-quality
        solutions and knowledge sharing. I'm seeking new opportunities — full-time or part-time — to work on exciting
        projects and collaborate with others who share my interests.
      </p>
    </section>
  </div>
</template>

<script>
// Constants
import { HIRE_ME_PAGE_VISITED_KEY } from "@/constants.js";

export default {
  name: "HireMe",
  emits: ["page-visited"],

  mounted() {
    document.title = "Hire Imad Saddik";
    this.$emit("page-visited", HIRE_ME_PAGE_VISITED_KEY);
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

h1 {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

h2 {
  font-size: var(--font-size-big-medium);
  margin: var(--gap-md) 0;
}

h3 {
  font-size: var(--font-size-big-small);
  margin: var(--gap-sm) 0;
}

.hire-me-container {
  width: 50%;
  padding: var(--gap-xl);
  margin-top: var(--gap-xxl);
  box-sizing: border-box;
}

@media screen and (max-width: 1500px) {
  .hire-me-container {
    width: 100%;
  }

  .hire-me-container h1 {
    font-size: var(--font-size-big-medium);
  }

  .hire-me-container h2 {
    font-size: var(--font-size-medium);
  }
}

@media screen and (max-width: 768px) {
  .hire-me-container {
    padding: var(--gap-md);
  }
}
</style>
