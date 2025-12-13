<template>
  <section class="article-footer">
    <h2 class="article-footer-header">You might also like</h2>
    <div v-if="cardData.length > 0" class="article-footer-cards-group">
      <BaseCard
        v-for="(card, idx) in cardData"
        :key="idx"
        :image-src="card.imageSrc"
        :alt-text="card.altText"
        :title="card.title"
        :creation-date="card.creationDate"
        :article-type="card.articleType"
        :article-id="card.articleId"
        :view-count="card.viewCount"
        :read-count="card.readCount"
        :claps-count="card.clapsCount"
      />
    </div>
    <p v-else class="no-recommendations-message">
      No related articles found at the moment. I'm constantly adding new content to this website. Check out the
      <router-link :to="hubLink">{{ hubName }}</router-link> to explore all available articles.
    </p>
  </section>
</template>

<script>
import BaseCard from "@/components/BaseCard.vue";
import { hubMapping } from "@/utils.js";

export default {
  name: "ArticleFooter",
  components: {
    BaseCard,
  },
  props: {
    cardData: {
      type: Array,
      required: true,
    },
    articleType: {
      type: String,
      required: true,
    },
  },
  computed: {
    hubLink() {
      return hubMapping[this.articleType]?.path || "/blogs";
    },
    hubName() {
      return hubMapping[this.articleType]?.name || "blogs page";
    },
  },
};
</script>

<style scoped>
.article-footer {
  width: 100%;
}

.article-footer-header {
  font-size: var(--font-size-big-medium);
  margin-top: var(--gap-xxl);
  margin-bottom: var(--gap-md);
}

.article-footer-cards-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: var(--gap-md);
}

.no-recommendations-message {
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  margin-top: var(--gap-md);
  margin-bottom: 0;
}

@media screen and (max-width: 1300px) {
  .article-footer-cards-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .article-footer-cards-group {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
