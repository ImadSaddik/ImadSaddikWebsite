<template>
  <aside v-if="sections.length > 0" class="table-of-contents-container">
    <h2>In this article</h2>
    <ul>
      <li v-for="value in sections" :key="value.id" :class="{ active: value.id === activeSectionId }">
        <a
          href="#"
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
      yIntervalsBetweenSections: [],
      topPadding: 0,
      initializationDelayMilliseconds: 500,
    };
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.collectSections();
        this.checkIfURLContainsHash();

        window.addEventListener("scroll", this.handleScrollEvent);
        window.addEventListener("resize", this.handleResize);
      });
    }, this.initializationDelayMilliseconds);
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
      const selectors = [".article-body h2[id]", ".article-body h3[id]", ".article-body h4[id]"];
      const headersNodeList = document.querySelectorAll(selectors.join(", "));

      this.sections = Array.from(headersNodeList).map((headerNode) => {
        const y = headerNode.getBoundingClientRect().top + window.scrollY - this.topPadding;
        return {
          id: headerNode.id,
          text: headerNode.textContent.trim(),
          level: parseInt(headerNode.tagName.charAt(1)), // tagName is like 'H2', 'H3', so we take the number part
          y: parseInt(y, 10),
        };
      });
      this.computeYIntervalsBetweenSections();
    },
    checkIfURLContainsHash() {
      const hash = window.location.hash;
      if (hash) {
        const sectionIdWithoutHash = hash.substring(1);
        this.handleSectionClick(sectionIdWithoutHash);
      }
    },
    computeYIntervalsBetweenSections() {
      for (let i = 0; i < this.sections.length; i++) {
        const currentSection = this.sections[i];
        const nextSection = this.sections[i + 1];

        const yOffsetCurrent = currentSection.y;
        const yOffsetNext = nextSection ? nextSection.y : Infinity;
        const currentSectionId = currentSection.id;

        this.yIntervalsBetweenSections.push({ yOffsetCurrent, yOffsetNext, currentSectionId });
      }
    },
    handleSectionClick(sectionId) {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return;

      const y = sectionElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: y - this.topPadding,
        behavior: "smooth",
      });

      this.activeSectionId = sectionId;
    },
    handleScrollEvent() {
      const scrollAmount = window.scrollY;

      for (let i = 0; i < this.yIntervalsBetweenSections.length; i++) {
        const interval = this.yIntervalsBetweenSections[i];
        if (scrollAmount >= interval.yOffsetCurrent && scrollAmount < interval.yOffsetNext) {
          this.activeSectionId = interval.currentSectionId;
          return;
        }
      }
    },
    handleResize() {
      this.collectSections();
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
