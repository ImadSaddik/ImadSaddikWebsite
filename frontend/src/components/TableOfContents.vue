<template>
  <aside v-if="sections.length > 0" class="table-of-contents-container" :class="{ wide: wideArticlesEnabled }">
    <div class="toc-content-wrapper">
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
    </div>
  </aside>
</template>

<script>
// Third-party libraries
import { useThrottleFn } from "@vueuse/core";

export default {
  name: "TableOfContents",
  inject: ["wideArticlesEnabled"],
  data() {
    return {
      activeSectionId: null,
      sections: [],
      throttledScrollHandler: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.collectSections();
      this.checkIfURLContainsHash();

      this.throttledScrollHandler = useThrottleFn(
        this.handleScrollEvent,
        100 /* wait time in ms */,
        true /* trailing */,
        true /* leading */
      );
      window.addEventListener("scroll", this.throttledScrollHandler);
      window.addEventListener("resize", this.handleResize);
    });
  },
  beforeUnmount() {
    if (this.throttledScrollHandler) {
      window.removeEventListener("scroll", this.throttledScrollHandler);
    }
    window.removeEventListener("resize", this.handleResize);
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
      history.replaceState(null, "", `#${sectionId}`);

      this.scrollToActiveLink();
    },
    computeAbsoluteYPosition(element) {
      const rect = element.getBoundingClientRect();
      return rect.top + window.scrollY;
    },
    handleScrollEvent() {
      this.collectSections();
      this.scrollToActiveLink();
    },
    scrollToActiveLink() {
      this.$nextTick(() => {
        const container = this.$el.querySelector("ul");
        const activeLinks = container.querySelectorAll("a.active");
        const lastActiveLink = activeLinks[activeLinks.length - 1];

        if (container && lastActiveLink) {
          const containerRect = container.getBoundingClientRect();
          const linkRect = lastActiveLink.getBoundingClientRect();
          const distanceToLink = linkRect.top - containerRect.top;

          container.scrollTo({
            top: container.scrollTop + distanceToLink - containerRect.height / 2 + linkRect.height / 2,
            behavior: "smooth",
          });
        }
      });
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
  display: block;
  width: 100%;
  box-sizing: border-box;
  color: var(--color-text-disabled);
  transition: color 0.3s ease-in-out;
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
  margin-top: var(--gap-md);
  margin-bottom: 0;
}

ul {
  margin: 0;
  margin-top: var(--gap-md);
  padding: 0;
  padding-right: var(--gap-sm);
  overflow-y: auto;
  scrollbar-width: none;
}

ul::-webkit-scrollbar {
  display: none;
}

li {
  position: relative;
  list-style: none;
  margin: 0;
  padding: var(--gap-xs) 0;
  line-height: 1.6;
}

li::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: var(--color-text-disabled);
  opacity: 0.3;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease;
}

li:hover::before {
  background-color: var(--color-primary);
  opacity: 1;
}

li.active::before {
  background-color: var(--color-primary);
  opacity: 1;
}

li .level-2 {
  font-weight: bold;
  padding: 0 var(--gap-md);
}

li .level-3 {
  padding: 0 var(--gap-lg);
}

li .level-4 {
  padding: 0 var(--gap-xl);
}

.table-of-contents-container {
  position: sticky;
  top: var(--gap-2xl);
  align-self: flex-start;
  width: 50%;
  max-height: 85vh;
  margin: 0;
  margin-left: var(--gap-2xl);
  z-index: 2;
  transition: width 0.3s;
}

.table-of-contents-container.wide {
  width: 25%;
}

.toc-content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: inherit;
}

@media screen and (max-width: 1300px) {
  .table-of-contents-container,
  .table-of-contents-container.wide {
    width: 35%;
    margin-left: var(--gap-lg);
  }

  li {
    padding: var(--gap-xs) var(--gap-sm);
  }

  li .level-2 {
    padding: 0 var(--gap-xs);
  }

  li .level-3 {
    padding: 0 var(--gap-sm);
  }

  li .level-4 {
    padding: 0 var(--gap-md);
  }
}

@media screen and (max-width: 1100px) {
  .table-of-contents-container {
    display: none;
  }
}
</style>
