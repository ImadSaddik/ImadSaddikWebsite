<template>
  <aside v-if="sections.length > 0" class="table-of-contents-container">
    <h2>In this article</h2>
    <ul>
      <li v-for="value in sections" :key="value.id" :class="{ active: value.id === activeSectionId }">
        <a
          :href="`#${value.id}`"
          :class="[`level-${value.level}`, { active: value.id === activeSectionId }]"
          @click.prevent="handleSectionClick(value.id)"
          >{{ value.text }}</a
        >
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: "TableOfContents",
  data() {
    return {
      activeSectionId: null,
      sections: [],
    };
  },
  mounted() {
    this.extractSections();
  },
  methods: {
    extractSections() {
      this.$nextTick(() => {
        const selectors = [".article-body h2[id]", ".article-body h3[id]", ".article-body h4[id]"];
        const headersNodeList = document.querySelectorAll(selectors.join(", "));

        this.sections = Array.from(headersNodeList).map((headerNode) => ({
          id: headerNode.id,
          text: headerNode.textContent.trim(),
          level: parseInt(headerNode.tagName.charAt(1)), // tagName is like 'H2', 'H3', so we take the number part
        }));
      });
    },
    handleSectionClick(sectionId) {
      this.activeSectionId = sectionId;

      const sectionElement = document.getElementById(sectionId);
      const articleHeaderElement = document.getElementsByClassName("article-header")[0];
      const navbarContainerElement = document.getElementsByClassName("navbar-container")[0];
      if (sectionElement && articleHeaderElement && navbarContainerElement) {
        window.scrollTo({
          top:
            sectionElement.offsetTop +
            articleHeaderElement.offsetHeight +
            navbarContainerElement.offsetHeight +
            this.getArticleContainerMarginTop(),
          behavior: "smooth",
        });
      }
    },
    getArticleContainerMarginTop() {
      const articleContainerElement = document.getElementsByClassName("article-container")[0];
      const computedStyle = window.getComputedStyle(articleContainerElement);
      return parseInt(computedStyle.getPropertyValue("margin-top"), 10);
    },
  },
};
</script>

<style scoped>
a {
  color: var(--color-text-disabled);
}

a:hover {
  color: var(--color-text-secondary);
}

a.active {
  color: var(--color-primary);
  font-weight: bold;
}

h2 {
  font-size: var(--font-size-big-medium);
  margin: 0;
}

ul {
  margin: 0;
  margin-top: var(--gap-md);
  padding: 0;
}

li {
  position: relative;
  list-style: none;
  margin: 0;
  padding: var(--gap-xs) 0;
}

li::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: var(--color-text-disabled);
}

li:hover::before {
  background-color: var(--color-primary);
}

li.active::before {
  background-color: var(--color-primary);
}

li .level-2 {
  font-weight: bold;
  padding-right: var(--gap-md);
  padding-left: var(--gap-md);
}

li .level-3 {
  padding-right: var(--gap-lg);
  padding-left: var(--gap-lg);
}

li .level-4 {
  padding-right: var(--gap-xl);
  padding-left: var(--gap-xl);
}

.table-of-contents-container {
  position: sticky;
  top: var(--gap-xxl);
  align-self: flex-start;
  z-index: 2;
  margin: var(--gap-md) 0;
  margin-left: var(--gap-xxl);
}

@media screen and (max-width: 1500px) {
  .table-of-contents-container {
    display: none;
  }
}
</style>
