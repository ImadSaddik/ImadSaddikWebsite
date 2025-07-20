<template>
  <section class="container">
    <div class="expanded-nav-bar">
      <RouterLink class="nav-bar-home" to="/">Imad Saddik</RouterLink>

      <div>
        <RouterLink v-for="item in navigationBarItems" :key="item.path" class="expanded-nav-bar-item" :to="item.path">
          {{ item.name }}
        </RouterLink>
      </div>

      <div role="button" aria-label="Toggle navigation" class="nav-menu" @click="isMenuOpen = !isMenuOpen">
        <i v-if="!isMenuOpen" class="fa-solid fa-bars fa-xl custom-icons"></i>
        <i v-else class="fa-solid fa-xmark fa-xl custom-icons"></i>
      </div>
    </div>

    <div v-if="isMenuOpen" class="collapsed-nav-bar">
      <RouterLink v-for="item in navigationBarItems" :key="item.path" class="collapsed-nav-bar-item" :to="item.path">
        {{ item.name }}
      </RouterLink>
    </div>
  </section>
</template>

<script>
export default {
  name: "NavBar",
  components: {},
  data() {
    return {
      isMenuOpen: false,
      navigationBarItems: [
        { name: "Blogs", path: "/blogs" },
        { name: "Courses", path: "/courses" },
        { name: "Astrophotography", path: "/astrophotography" },
        { name: "About me", path: "/about-me" },
        { name: "Hire me", path: "/hire-me" },
      ],
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  margin-top: var(--gap-xl);
}

.expanded-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collapsed-nav-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
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

.expanded-nav-bar-item {
  margin: var(--gap-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-paragraph);
}

.expanded-nav-bar-item:hover {
  color: var(--color-text-primary);
}

.collapsed-nav-bar-item {
  display: none;
}

.collapsed-nav-bar-item:hover {
  color: var(--color-text-primary);
}

.selected {
  color: var(--color-text-primary);
  text-decoration: underline;
  text-decoration-thickness: 0.125rem;
  text-underline-offset: 0.625rem;
  text-decoration-color: var(--color-text-primary);
}

.nav-menu {
  display: none;
}

.nav-menu:hover {
  border: 0.125rem solid var(--color-text-primary);
}

.custom-icons {
  color: var(--color-text-primary);
}

@media (max-width: 1100px) {
  .expanded-nav-bar-item {
    display: none;
  }

  .collapsed-nav-bar-item {
    display: block;
    padding: var(--gap-sm) 0;
    text-decoration: none;
    color: var(--color-text-secondary);
    font-size: var(--font-size-paragraph);
    width: 100%;
  }

  .collapsed-nav-bar-item:hover {
    background-color: var(--color-text-disabled);
  }

  .nav-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: var(--gap-sm);
    border: 0.125rem solid var(--color-text-disabled);
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
