<template>
  <aside v-if="sections.length > 0" class="table-of-contents-container">
    <h2>On this page</h2>
    <ul>
      <li v-for="value in sections" :key="value.id" :class="{ active: shouldActivateSection(value.y) }">
        <a
          href="#"
          :class="[`level-${value.level}`, { active: shouldActivateSection(value.y) }]"
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
    this.$nextTick(() => {
      this.collectSections();
      this.checkIfURLContainsHash();

      window.addEventListener("scroll", this.handleScrollEvent);
      window.addEventListener("resize", this.handleResize);
    });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScrollEvent);
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    activeSectionId(newId) {
      if (newId) {
        history.replaceState(null, "", `#${newId}`);
      }
    },
  },
  methods: {
    collectSections() {
      const selectors = [
        "h2[id][data-table-of-contents]",
        "h3[id][data-table-of-contents]",
        "h4[id][data-table-of-contents]",
      ];
      const headersNodeList = document.querySelectorAll(selectors.join(", "));

      this.sections = Array.from(headersNodeList).map((headerNode) => {
        const y = this.computeAbsoluteYPosition(headerNode);
        return {
          id: headerNode.id,
          text: headerNode.textContent.trim(),
          level: parseInt(headerNode.tagName.charAt(1)), // tagName is like 'H2', 'H3', so we take the number part
          y: parseInt(y, 10),
        };
      });
    },
    checkIfURLContainsHash() {
      const hash = window.location.hash;
      if (hash) {
        const sectionIdWithoutHash = hash.substring(1);
        this.handleSectionClick(sectionIdWithoutHash);
      }
    },
    handleSectionClick(sectionId) {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return;

      const y = this.computeAbsoluteYPosition(sectionElement);
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      this.activeSectionId = sectionId;
    },
    computeAbsoluteYPosition(element) {
      const rect = element.getBoundingClientRect();
      return rect.top + window.scrollY;
    },
    handleScrollEvent() {
      this.collectSections();
    },
    handleResize() {
      this.collectSections();
    },
    shouldActivateSection(sectionYValue) {
      return sectionYValue - window.scrollY <= 0;
    },
  },
};
</script>

<style scoped>
a {
  color: var(--color-text-disabled);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
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
  width: 25%;
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
