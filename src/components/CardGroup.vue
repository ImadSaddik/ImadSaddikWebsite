<template>
  <section class="cards-group-container">
    <h2 class="cards-group-title">{{ title }}</h2>

    <div class="cards-group">
      <BaseCard
        v-for="(card, idx) in cardsData"
        :key="idx"
        :image-src="card.imageSrc"
        :alt-text="card.altText"
        :title="card.title"
        :sub-title="card.subTitle"
        :id="card.id"
      />
    </div>

    <button class="cards-group-button primary-button">{{ buttonText }}</button>
  </section>
</template>

<script>
import BaseCard from "@/components/BaseCard.vue";

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
    BaseCard,
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
  margin-top: var(--gap-between-sections-big);
  width: 75%;
}

.cards-group-title {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

.cards-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: var(--gap-md);
  margin-bottom: var(--gap-xl);
}

.cards-group-button {
  padding: var(--gap-sm) var(--gap-xs);
  font-size: var(--font-size-small);
  font-weight: 600;
  width: 200px;
}

@media screen and (max-width: 2000px) {
  .cards-group-container {
    width: 80%;
  }
}

@media screen and (max-width: 1500px) {
  .cards-group-container {
    width: 90%;
    margin-top: var(--gap-between-sections-medium);
  }
}

@media screen and (max-width: 1100px) {
  .cards-group-container {
    width: 100%;
    margin-top: var(--gap-between-sections-small);
  }
}

@media screen and (max-width: 768px) {
  .cards-group-title {
    font-size: var(--font-size-big-medium);
  }

  .cards-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 576px) {
  .cards-group {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
