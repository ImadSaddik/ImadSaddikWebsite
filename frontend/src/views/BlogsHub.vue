<template>
  <section class="blog-hub-container">
    <div>
      <h1 class="blog-hub-title">Blogs hub</h1>
      <SearchBar placeHolder="What article are you curious about today?" @search-request="handleSearchRequest" />
    </div>

    <div class="blog-hub-columns">
      <div class="blog-hub-filters-column">
        <div class="blog-hub-filters-sorting">
          <h2 @click="toggleSortingExpanded" class="collapsible-header">
            Sort
            <i class="fa-solid" :class="sortingExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="sortingExpanded" class="collapsible-content">
            <DropDownMenu
              clearable
              v-model="sortOption"
              placeholder="Show me articles sorted by..."
              :options="sortOptions"
            />
          </div>
        </div>

        <div class="blog-hub-filters-year">
          <h2 @click="toggleYearExpanded" class="collapsible-header">
            Year
            <i class="fa-solid" :class="yearExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="yearExpanded" class="collapsible-content">
            <CheckboxGroup v-model="selectedYears" :options="yearOptions" />
          </div>
        </div>

        <div class="blog-hub-filters-tags">
          <h2 @click="toggleTagsExpanded" class="collapsible-header">
            Tags
            <i class="fa-solid" :class="tagsExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </h2>
          <div v-if="tagsExpanded" class="collapsible-content">
            <CheckboxGroup v-model="selectedTags" :options="tagOptions" />
          </div>
        </div>
      </div>

      <div class="blog-hub-search-result">
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

// Images
import blogcoverImage1 from "@/blogs/ElasticsearchPreFilteringWithKnnSearch/coverImage.svg";
import blogcoverImage2 from "@/blogs/ElasticsearchCollapseSearchResults/coverImage.svg";
import blogcoverImage3 from "@/blogs/ElasticsearchChangeHeapSize/coverImage.svg";

export default {
  name: "BlogHub",
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

      cardData: [
        {
          imageSrc: blogcoverImage1,
          altText: "Cover image for the blog titled Pre-filtering with kNN search in Elasticsearch",
          title: "Pre-filtering with kNN search in Elasticsearch",
          subTitle: "12 August 2025",
          articleType: "blog-post",
          articleId: "ElasticsearchPreFilteringWithKnnSearch",
        },
        {
          imageSrc: blogcoverImage2,
          altText: "Cover image for the blog titled Collapse search results in Elasticsearch",
          title: "Collapse search results in Elasticsearch",
          subTitle: "20 August 2025",
          articleType: "blog-post",
          articleId: "ElasticsearchCollapseSearchResults",
        },
        {
          imageSrc: blogcoverImage3,
          altText: "Cover image for the blog titled Change the heap size for Elasticsearch",
          title: "Change the heap size for Elasticsearch",
          subTitle: "12 August 2025",
          articleType: "blog-post",
          articleId: "ElasticsearchChangeHeapSize",
        },
      ],
    };
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
    handleSearchRequest() {},
  },
};
</script>

<style scoped>
.blog-hub-container {
  padding: var(--gap-xl);
  margin-top: var(--gap-xxl);
}

.blog-hub-title {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

.blog-hub-columns {
  display: flex;
  flex-direction: row;
  gap: var(--gap-xl);
  margin-top: var(--gap-xxl);
}

.blog-hub-filters-column {
  flex: 1;
}

.blog-hub-filters-column h2 {
  margin: 0;
  font-size: var(--font-size-medium);
}

.blog-hub-filters-year {
  margin-top: var(--gap-lg);
}

.blog-hub-filters-tags {
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

.blog-hub-search-result {
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
  .blog-hub-container {
    padding: var(--gap-lg);
    margin-top: var(--gap-md);
  }

  .blog-hub-title {
    font-size: var(--font-size-big-medium);
    margin-bottom: var(--gap-md);
  }

  .blog-hub-search-result {
    flex: 2;
  }

  .cards-group {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .blog-hub-container {
    padding: var(--gap-md);
    margin-top: var(--gap-sm);
  }

  .blog-hub-columns {
    flex-direction: column;
    gap: var(--gap-lg);
    margin-top: var(--gap-lg);
  }

  .blog-hub-filters-column h2 {
    font-size: var(--font-size-big-small);
  }
}
</style>
