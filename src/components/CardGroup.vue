<template>
  <section class="cards-group-container">
    <h2 class="title">{{ title }}</h2>

    <div class="cards-group">
      <Card
        v-for="(card, idx) in cardsData"
        :key="idx"
        :image-src="card.imageSrc"
        :alt-text="card.altText"
        :title="card.title"
        :sub-title="card.subTitle"
      />
    </div>

    <button class="custom-button primary-button">{{ buttonText }}</button>
  </section>
</template>

<script>
import Card from "@/components/Card.vue";

export default {
  name: "CardGroup",
  props: {
    title: {
      type: String,
      required: true,
      default: null,
    },
    cardsData: {
      type: Array,
      required: true,
      default: () => [],
    },
    buttonText: {
      type: String,
      required: true,
      default: null,
    },
  },
  components: {
    Card,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.cards-group-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--gap-between-sections);
  width: 100%;
}

.cards-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: var(--gap-md);
  margin-bottom: var(--gap-xl);
}
</style>
