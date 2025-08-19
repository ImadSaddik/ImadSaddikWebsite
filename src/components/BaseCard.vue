<template>
  <div class="card-container" @click="handleCardClick">
    <div class="image-wrapper">
      <img :src="imageSrc" :alt="altText" />
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-subtitle">{{ subTitle }}</p>
  </div>
</template>

<script>
export default {
  name: "BaseCard",
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
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleCardClick() {
      this.$router.push({ name: "blog-post", params: { slug: this.id } });
    },
  },
};
</script>

<style scoped>
.image-wrapper {
  position: relative;
}

.image-wrapper::after {
  content: "";
  position: absolute;
  top: -6px;
  right: -6px;
  bottom: -6px;
  left: -6px;
  border: 4px solid transparent;
  transition: border-color 0.3s ease-in-out;
}

.card-container:hover .image-wrapper::after {
  border-color: var(--color-secondary);
}

img {
  width: 100%;
  height: auto;
  display: block;
}

.card-container {
  cursor: pointer;
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
  margin-bottom: 0;
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
