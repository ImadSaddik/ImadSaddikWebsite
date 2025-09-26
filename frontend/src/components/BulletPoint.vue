<template>
  <div class="bullet-point">
    <img :src="galaxyIcon" alt="A galaxy icon" />
    <span><slot></slot></span>
  </div>
</template>

<script>
import galaxyIcon from "@/assets/galaxy_bullet_point.svg";

export default {
  name: "BulletPoint",
  data() {
    return {
      galaxyIcon,
    };
  },
};
</script>

<style scoped>
.bullet-point {
  display: flex;
  align-items: center;
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
  line-height: 1;
}
</style>
