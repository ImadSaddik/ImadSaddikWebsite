<template>
  <div class="unordered-item">
    <img :src="starsIcon" alt="A galaxy icon" />
    <span><slot></slot></span>
  </div>
</template>

<script>
import starsIcon from "@/assets/stars_bullet_point.svg";

export default {
  name: "UnorderedItem",
  data() {
    return {
      starsIcon,
    };
  },
};
</script>

<style scoped>
.unordered-item {
  display: flex;
  align-items: flex-start;
  gap: var(--gap-sm);
  margin-bottom: var(--gap-sm);
}

.unordered-item img {
  width: 24px;
  height: auto;
}

.unordered-item span {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>
