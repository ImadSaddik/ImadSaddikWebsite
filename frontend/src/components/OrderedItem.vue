<template>
  <div class="ordered-item">
    <div class="step-number" v-html="svgContent"></div>
    <span><slot></slot></span>
  </div>
</template>

<script>
import starsOrderedItemSvg from "@/assets/stars_ordered_item.svg?raw";

export default {
  name: "OrderedItem",
  data() {
    return {
      svgContent: "",
      itemNumber: 1,
    };
  },
  mounted() {
    this.updateSvgNumber();
  },
  methods: {
    updateSvgNumber() {
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(starsOrderedItemSvg, "image/svg+xml");
      const orderedItemLabel = svgDocument.getElementById("order_label");

      if (orderedItemLabel) {
        const orderedItem = this.$el;
        const orderedList = orderedItem.parentElement;
        const items = Array.from(orderedList.children).filter((child) => child.classList.contains("ordered-item"));
        const index = items.indexOf(orderedItem);

        this.itemNumber = index + 1;
        orderedItemLabel.textContent = this.itemNumber;
      }

      const serializer = new XMLSerializer();
      this.svgContent = serializer.serializeToString(svgDocument.documentElement);
    },
  },
};
</script>

<style scoped>
.ordered-item {
  display: flex;
  align-items: flex-start;
  gap: var(--gap-sm);
  margin-bottom: var(--gap-sm);
  counter-increment: ordered-list-counter;
}

.step-number {
  flex-shrink: 0;
  width: auto;
  height: 24px;
}

.step-number :deep(svg) {
  width: auto;
  height: 100%;
  display: block;
}

.ordered-item span {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>
