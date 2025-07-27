<template>
  <section class="navbar-container">
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
        <p>
          {{ item.name }}
        </p>
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
      isMenuOpen: true,
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
.navbar-container {
  width: 100%;
}

.expanded-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--gap-xl);
}

@media screen and (max-width: 1100px) {
  .expanded-nav-bar {
    padding: var(--gap-md) var(--gap-lg);
  }
}

@media screen and (max-width: 768px) {
  .expanded-nav-bar {
    padding: var(--gap-sm) var(--gap-md);
  }
}

.collapsed-nav-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--gap-xl);
}

@media screen and (max-width: 1100px) {
  .collapsed-nav-bar {
    padding: 0 var(--gap-lg);
  }
}

@media screen and (max-width: 768px) {
  .collapsed-nav-bar {
    padding: 0 var(--gap-md);
  }
}

.nav-bar-home {
  font-size: var(--font-size-big);
  font-weight: bold;
  text-decoration: none;
  color: var(--color-text-primary);
}

.nav-bar-home:hover {
  color: var(--color-text-primary);
}

@media screen and (max-width: 1100px) {
  .nav-bar-home {
    font-size: var(--font-size-medium);
  }
}

.expanded-nav-bar-item {
  margin: var(--gap-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
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
    width: 100%;
    text-decoration: none;
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
  }

  .collapsed-nav-bar-item p {
    margin: 0;
    padding: var(--gap-sm) var(--gap-md);
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

@media (max-width: 768px) {
  .nav-menu {
    width: 1rem;
    height: 1rem;
  }
}
</style>
