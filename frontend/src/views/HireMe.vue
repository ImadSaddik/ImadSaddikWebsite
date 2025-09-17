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

    <section>
      <h2>Services</h2>
      <p>I offer a range of services to help you achieve your goals:</p>

      <div class="card-group">
        <div class="card">
          <i class="fa-solid fa-pen-nib service-icon"></i>
          <h2>Technical writing</h2>
          <p>I write high-quality documentation, tutorials, and guides to help users understand complex topics.</p>
        </div>
        <div class="card">
          <i class="fa-solid fa-code service-icon"></i>
          <h2>Software development</h2>
          <p>I build software solutions that are efficient, scalable, and tailored to your needs.</p>
        </div>
        <div class="card">
          <i class="fa-solid fa-headset service-icon"></i>
          <h2>Support & maintenance</h2>
          <p>
            I provide ongoing support and maintenance for your software solutions, ensuring they remain up-to-date and
            continue to meet your needs.
          </p>
        </div>
        <div class="card">
          <i class="fa-solid fa-server service-icon"></i>
          <h2>Project hosting</h2>
          <p>I can host your projects on reliable platforms, ensuring they are accessible and performant.</p>
        </div>
        <div class="card">
          <i class="fa-solid fa-chalkboard-user service-icon"></i>
          <h2>Tutorials</h2>
          <p>
            I create step-by-step tutorials to help you learn new skills and technologies or to create tutorials
            featuring your projects.
          </p>
        </div>
        <div class="card">
          <i class="fa-solid fa-magnifying-glass-chart service-icon"></i>
          <h2>Code reviews</h2>
          <p>
            I provide thorough code reviews to help you improve your code quality and ensure best practices are
            followed.
          </p>
        </div>
      </div>
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

.card-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-md);
}

.card {
  border: 1px solid var(--color-tag-border);
  padding: var(--gap-md);
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.service-icon {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: var(--gap-sm);
  display: block;
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
