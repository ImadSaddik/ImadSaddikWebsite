<template>
  <section class="articles-hub-container">
    <div>
      <h1 class="articles-hub-title">{{ articleTitle }} hub</h1>
      <SearchBar v-model="searchQuery" :placeHolder="searchPlaceholder" @perform-search="sendRequestToPerformSearch" />
    </div>

    <div class="articles-hub-columns">
      <div class="articles-hub-filters-column">
        <div class="articles-hub-filters-sorting">
          <h2 @click="toggleSortingExpanded" class="collapsible-header">
            Sort
            <i class="fa-solid" :class="sortingExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="sortingExpanded" class="collapsible-content">
            <DropDownMenu clearable v-model="sortOption" :placeholder="sortPlaceholder" :options="sortOptions" />
          </div>
        </div>

        <div class="articles-hub-filters-year">
          <h2 @click="toggleYearExpanded" class="collapsible-header">
            Year
            <i class="fa-solid" :class="yearExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="yearExpanded" class="collapsible-content">
            <CheckboxGroup v-model="selectedYears" :options="yearOptions" />
          </div>
        </div>

        <div class="articles-hub-filters-tags">
          <h2 @click="toggleTagsExpanded" class="collapsible-header">
            Tags
            <i class="fa-solid" :class="tagsExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="tagsExpanded" class="collapsible-content">
            <CheckboxGroup v-model="selectedTags" :options="tagOptions" />
          </div>
        </div>
      </div>

      <div class="articles-hub-search-result">
        <div class="cards-group">
          <BaseCard
            v-for="(card, idx) in cardData"
            :key="idx"
            :image-src="card.imageSrc"
            :alt-text="card.altText"
            :title="card.title"
            :sub-title="card.subTitle"
            :article-type="card.articleType"
            :article-id="card.articleId"
          />
        </div>

        <button class="load-more-button primary-button">Load more</button>
      </div>
    </div>
  </section>
</template>

<script>
// Components
import DropDownMenu from "@/components/DropDownMenu.vue";
import CheckboxGroup from "@/components/CheckboxGroup.vue";
import BaseCard from "@/components/BaseCard.vue";
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "ArticlesHub",
  emits: ["perform-search"],
  props: {
    articleTitle: {
      type: String,
      required: true,
    },
    articleType: {
      type: String,
      required: true,
    },
    searchPlaceholder: {
      type: String,
      required: true,
      default: "What article are you curious about today?",
    },
    sortPlaceholder: {
      type: String,
      required: true,
      default: "Show me articles sorted by...",
    },
    cardData: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  components: {
    DropDownMenu,
    CheckboxGroup,
    BaseCard,
    SearchBar,
  },
  data() {
    return {
      sortingExpanded: true,
      yearExpanded: true,
      tagsExpanded: true,

      searchQuery: "",

      sortOption: null,
      sortOptions: [
        { value: "date", label: "Date" },
        { value: "relevance", label: "Relevance" },
      ],

      selectedYears: [],
      yearOptions: [
        { value: 2025, label: "2025" },
        { value: 2024, label: "2024" },
        { value: 2023, label: "2023" },
      ],

      selectedTags: [],
      tagOptions: [
        { value: "vue", label: "Vue.js" },
        { value: "javascript", label: "JavaScript" },
        { value: "css", label: "CSS" },
      ],
    };
  },
  watch: {
    sortOption(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.sendRequestToPerformSearch();
      }
    },
    selectedYears(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.sendRequestToPerformSearch();
      }
    },
    selectedTags(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.sendRequestToPerformSearch();
      }
    },
  },
  methods: {
    toggleSortingExpanded() {
      this.sortingExpanded = !this.sortingExpanded;
    },
    toggleYearExpanded() {
      this.yearExpanded = !this.yearExpanded;
    },
    toggleTagsExpanded() {
      this.tagsExpanded = !this.tagsExpanded;
    },
    sendRequestToPerformSearch() {
      const data = {
        query: this.searchQuery,
        articleType: this.articleType,
        sortBy: this.sortOption,
        filters: {
          years: this.selectedYears,
          tags: this.selectedTags,
        },
      };
      this.$emit("perform-search", data);
    },
  },
};
</script>

<style scoped>
.articles-hub-container {
  padding: var(--gap-xl);
  margin-top: var(--gap-xxl);
}

.articles-hub-title {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

.articles-hub-columns {
  display: flex;
  flex-direction: row;
  gap: var(--gap-xl);
  margin-top: var(--gap-xxl);
}

.articles-hub-filters-column {
  flex: 1;
}

.articles-hub-filters-column h2 {
  margin: 0;
  font-size: var(--font-size-medium);
}

.articles-hub-filters-year {
  margin-top: var(--gap-lg);
}

.articles-hub-filters-tags {
  margin-top: var(--gap-lg);
}

.collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
}

.collapsible-header:hover {
  color: var(--color-primary);
}

.collapsible-header i {
  color: var(--color-text-primary);
  transition: color 0.2s ease;
}

.collapsible-header:hover i {
  color: var(--color-primary);
}

.collapsible-content {
  margin-top: var(--gap-sm);
}

.articles-hub-search-result {
  flex: 4;
}

.cards-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-md);
  width: 100%;
}

.load-more-button {
  padding: var(--gap-sm) var(--gap-xs);
  font-size: var(--font-size-small);
  font-weight: 600;
  width: 200px;
  margin-top: var(--gap-xl);
}

@media screen and (max-width: 1100px) {
  .articles-hub-container {
    padding: var(--gap-lg);
    margin-top: var(--gap-md);
  }

  .articles-hub-title {
    font-size: var(--font-size-big-medium);
    margin-bottom: var(--gap-md);
  }

  .articles-hub-search-result {
    flex: 2;
  }

  .cards-group {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .articles-hub-container {
    padding: var(--gap-md);
    margin-top: var(--gap-sm);
  }

  .articles-hub-columns {
    flex-direction: column;
    gap: var(--gap-lg);
    margin-top: var(--gap-lg);
  }

  .articles-hub-filters-column h2 {
    font-size: var(--font-size-big-small);
  }
}
</style>
