<template>
  <div class="bullet-point">
    <img :src="starsIcon" alt="A galaxy icon" />
    <span><slot></slot></span>
  </div>
</template>

<script>
import starsIcon from "@/assets/stars_bullet_point.svg";

export default {
  name: "BulletPoint",
  data() {
    return {
      starsIcon,
    };
  },
};
</script>

<style scoped>
.bullet-point {
  display: flex;
  align-items: flex-start;
  gap: var(--gap-sm);
  margin-bottom: var(--gap-sm);
}

.bullet-point img {
  width: 24px;
  height: auto;
}

.bullet-point span {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>
