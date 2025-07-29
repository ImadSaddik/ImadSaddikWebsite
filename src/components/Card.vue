<template>
  <div class="card-container">
    <img :src="imageSrc" :alt="altText" />
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-subtitle">{{ subTitle }}</p>
  </div>
</template>

<script>
export default {
  name: "CourseCard",
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}

.card-title {
  font-size: var(--font-size-medium);
  margin-top: var(--gap-md);
  margin-bottom: 0;
}

.card-subtitle {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--gap-xs);
}

@media screen and (max-width: 2000px) {
  .card-title {
    margin-top: var(--gap-sm);
  }
}

@media screen and (max-width: 1100px) {
  .card-title {
    margin-top: var(--gap-xs);
  }
}
</style>
