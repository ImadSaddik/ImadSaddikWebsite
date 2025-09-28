<template>
  <RouterLink :to="articleRoute" class="card-container">
    <div class="image-wrapper">
      <img :src="imageSrc" :alt="altText" />
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <div class="card-subtitle">
      <p class="card-stats">
        <span class="card-date">{{ creationDate }}</span>
        <span v-if="viewCount || readCount || clapsCount">&bull;</span>
        <span v-if="viewCount" class="stat-item"
          ><i class="fa-solid fa-eye"></i><span class="stat-num">{{ viewCount }}</span></span
        >
        <span v-if="readCount" class="stat-item"
          ><i class="fa-solid fa-book-open"></i><span class="stat-num">{{ readCount }}</span></span
        >
        <span v-if="clapsCount" class="stat-item"
          ><i class="fa-solid fa-hands-clapping"></i><span class="stat-num">{{ clapsCount }}</span></span
        >
      </p>
    </div>
  </RouterLink>
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
    creationDate: {
      type: String,
      required: true,
    },
    articleType: {
      type: String,
      required: true,
    },
    articleId: {
      type: String,
      required: true,
    },
    viewCount: {
      type: Number,
      required: false,
    },
    readCount: {
      type: Number,
      required: false,
    },
    clapsCount: {
      type: Number,
      required: false,
    },
  },
  computed: {
    articleRoute() {
      return { name: this.articleType, params: { slug: this.articleId } };
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}

img {
  width: 100%;
  height: auto;
  display: block;
}

a.card-container {
  text-decoration: none;
  color: inherit;
}

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

.card-container {
  cursor: pointer;
}

.card-title {
  font-size: var(--font-size-medium);
  margin-top: var(--gap-md);
  margin-bottom: 0;
}

.card-subtitle {
  margin-top: var(--gap-sm);
}

.card-date {
  font-weight: bold;
}

.card-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--gap-sm);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
}

.stat-item i {
  color: var(--color-secondary);
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
