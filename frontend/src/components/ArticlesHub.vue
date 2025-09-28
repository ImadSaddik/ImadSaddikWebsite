<template>
  <section class="articles-hub-container">
    <div>
      <h1 class="articles-hub-title">{{ articleTitle }} hub</h1>
      <SearchBar v-model="searchQuery" :placeHolder="searchPlaceholder" @perform-search="performSearchRequest" />
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
            <div v-if="sortOption" class="order-container">
              <p>Order:</p>
              <div class="order-options">
                <i
                  class="fa-solid fa-arrow-up"
                  :class="{ selected: sortOrder === 'asc' }"
                  @click="setSortOrder('asc')"
                ></i>
                <i
                  class="fa-solid fa-arrow-down"
                  :class="{ selected: sortOrder === 'desc' }"
                  @click="setSortOrder('desc')"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div class="articles-hub-filters-year">
          <h2 @click="toggleYearExpanded" class="collapsible-header">
            Year
            <i class="fa-solid" :class="yearExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="yearExpanded" class="collapsible-content">
            <button
              v-if="selectedYears.length > 0"
              class="unselect-all-selected-checkboxes-button"
              @click="clearAllYears"
            >
              Clear all years
            </button>
            <CheckboxGroup v-model="selectedYears" :options="yearOptions" />
          </div>
        </div>

        <div class="articles-hub-filters-tags">
          <h2 @click="toggleTagsExpanded" class="collapsible-header">
            Tags
            <i class="fa-solid" :class="tagsExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="tagsExpanded" class="collapsible-content">
            <button
              v-if="selectedTags.length > 0"
              class="unselect-all-selected-checkboxes-button"
              @click="clearAllTags"
            >
              Clear all tags
            </button>
            <CheckboxGroup v-model="selectedTags" :options="tagOptions" />
          </div>
        </div>
      </div>

      <div class="articles-hub-search-result">
        <div v-if="!isSearchResponseEmpty" class="cards-group">
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

        <!-- TODO: Replace this with an illustration in the future -->
        <div v-else class="articles-hub-no-search-results">
          <p v-if="isSearchResponseEmpty">No results found</p>
        </div>

        <button v-if="showLoadMoreButton" class="load-more-button primary-button" @click="loadMoreArticles">
          Load more
        </button>
      </div>
    </div>
  </section>
</template>

<script>
// Third-party libraries
import axios from "axios";

// Utils
import { getCardsDataFromDocumentHits } from "@/utils.js";

// Components
import DropDownMenu from "@/components/DropDownMenu.vue";
import CheckboxGroup from "@/components/CheckboxGroup.vue";
import BaseCard from "@/components/BaseCard.vue";
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "ArticlesHub",
  emits: ["show-toast"],
  components: {
    DropDownMenu,
    CheckboxGroup,
    BaseCard,
    SearchBar,
  },
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
  },
  computed: {
    showLoadMoreButton() {
      return (
        !this.isSearchResponseEmpty && this.cardData.length > 0 && this.cardData.length < this.totalDocumentsInIndex
      );
    },
  },
  data() {
    return {
      sortingExpanded: true,
      yearExpanded: true,
      tagsExpanded: true,

      searchQuery: "",

      sortOrder: "desc",
      sortOption: "",
      sortOptions: [
        { value: "date", label: "Date" },
        { value: "popularity", label: "Popularity (Views)" },
        { value: "engagement", label: "Engagement (Reads)" },
        { value: "claps", label: "Claps" },
      ],

      selectedYears: [],
      yearOptions: [],

      selectedTags: [],
      tagOptions: [],

      cardData: [],
      isSearchResponseEmpty: false,

      batchSize: 10,
      totalDocumentsInIndex: 0,
    };
  },
  watch: {
    sortOption(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.performSearchRequest();
      }
    },
    selectedYears(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.performSearchRequest();
      }
    },
    selectedTags(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.performSearchRequest();
      }
    },
  },
  async mounted() {
    await this.getCardsData();
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
    setSortOrder(order) {
      this.sortOrder = order;
      this.performSearchRequest();
    },
    clearAllTags() {
      this.selectedTags = [];
    },
    clearAllYears() {
      this.selectedYears = [];
    },
    async getCardsData() {
      const data = {
        articleType: this.articleType,
      };
      await this.performSearchRequest(data);
    },
    async loadMoreArticles() {
      this.batchSize += 1;
      await this.performSearchRequest();
    },
    async performSearchRequest() {
      const data = {
        query: this.searchQuery,
        articleType: this.articleType,
        sortBy: {
          field: this.sortOption,
          order: this.sortOrder,
        },
        filters: {
          years: this.selectedYears,
          tags: this.selectedTags,
        },
        size: this.batchSize,
      };

      let searchResponse = null;
      try {
        const response = await axios.post("/api/search", JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10_000,
        });
        searchResponse = response.data;
        const hits = searchResponse?.hits || [];
        this.cardData = getCardsDataFromDocumentHits({
          hits,
          articleType: this.articleType,
        });
        this.totalDocumentsInIndex = searchResponse?.total_hits || 0;
        const facetDistribution = searchResponse?.facet_distribution || {};

        this.updateTagsFromFacetDistribution(facetDistribution.tags || {});
        this.updateYearsFromFacetDistribution(facetDistribution.year || {});
      } catch {
        this.$emit("show-toast", {
          message: "Failed to perform search",
          type: "error",
        });
      }

      this.isSearchResponseEmpty = !searchResponse || searchResponse.hits.length === 0;
    },
    updateTagsFromFacetDistribution(tagsFacet) {
      // Convert to array of objects with count and sort by count descending
      const sortedTags = Object.entries(tagsFacet)
        .map(([tag, count]) => ({
          value: tag,
          label: tag,
          count: count,
        }))
        .sort((a, b) => b.count - a.count);

      this.tagOptions = sortedTags;
    },
    updateYearsFromFacetDistribution(yearsFacet) {
      // Convert to array of objects with count and sort by count descending
      const sortedYears = Object.entries(yearsFacet)
        .map(([year, count]) => ({
          value: year,
          label: year,
          count: count,
        }))
        .sort((a, b) => b.count - a.count);

      this.yearOptions = sortedYears;
    },
  },
};
</script>

<style scoped>
p {
  font-size: var(--font-size-small);
}

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

.articles-hub-no-search-results {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.articles-hub-no-search-results {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
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

.order-container {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
}

.order-options {
  display: flex;
  gap: var(--gap-xs);
}

.order-options i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: var(--gap-xs);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.order-options i:hover {
  background-color: var(--color-primary-hover);
  color: var(--color-background);
}

.order-options i.selected {
  background-color: var(--color-primary);
  color: var(--color-background);
}

.unselect-all-selected-checkboxes-button {
  margin: 0 0 var(--gap-md) 0;
  padding: var(--gap-xs) var(--gap-md);
  font-size: var(--font-size-extra-small);
  color: var(--color-text-primary);
  background-color: transparent;
  border: 4px solid var(--color-disabled);
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.unselect-all-selected-checkboxes-button:hover {
  color: black;
  border-color: var(--color-primary);
  background-color: var(--color-primary);
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
