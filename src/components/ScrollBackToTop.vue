<template>
  <div
    v-show="showScrollBackToTopButton"
    type="button"
    class="scroll-back-to-top-button"
    role="button"
    tabindex="0"
    @click="scrollToTop"
    @keydown.enter="scrollToTop"
  >
    <img class="scroll-back-to-top-button-icon" src="@/assets/rocket.svg" alt="Scroll back to the top of the page." />
  </div>
</template>

<script>
export default {
  name: "BackToTop",
  components: {},
  data() {
    return {
      showScrollBackToTopButton: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    handleScroll() {
      this.showScrollBackToTopButton = window.scrollY > 500;
    },
  },
};
</script>

<style scoped>
.scroll-back-to-top-button {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  bottom: var(--gap-lg);
  right: var(--gap-lg);
  cursor: pointer;
  z-index: 3;
  background-color: var(--color-button-primary);
  transition: background-color 0.3s ease;
}

.scroll-back-to-top-button:hover {
  background-color: var(--color-button-primary-hover);
}

.scroll-back-to-top-button-icon {
  width: 2rem;
  height: 2rem;
}

@media screen and (max-width: 1100px) {
  .scroll-back-to-top-button {
    width: 3.5rem;
    height: 3.5rem;
    bottom: var(--gap-md);
    right: var(--gap-md);
  }

  .scroll-back-to-top-button-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media screen and (max-width: 768px) {
  .scroll-back-to-top-button {
    width: 3.5rem;
    height: 3.5rem;
    bottom: var(--gap-sm);
    right: var(--gap-sm);
  }

  .scroll-back-to-top-button-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
