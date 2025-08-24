<template>
  <ArticlesHub
    article-title="Blogs"
    search-placeholder="What blogs are you curious about today?"
    sort-placeholder="Show me blogs sorted by..."
    :article-type="articleType"
    :card-data="cardData"
    @search-request="handleSearchRequest"
  />
</template>

<script>
// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

// Images
import blogcoverImage1 from "@/blogs/ElasticsearchPreFilteringWithKnnSearch/coverImage.svg";
import blogcoverImage2 from "@/blogs/ElasticsearchCollapseSearchResults/coverImage.svg";
import blogcoverImage3 from "@/blogs/ElasticsearchChangeHeapSize/coverImage.svg";

export default {
  name: "BlogHub",
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "blog-post",
      cardData: [],
    };
  },
  mounted() {
    this.getCardsData();
  },
  methods: {
    getCardsData() {
      // TODO: Replace this with an actual API call
      this.cardData = [
        {
          imageSrc: blogcoverImage1,
          altText: "Cover image for the blog titled Pre-filtering with kNN search in Elasticsearch",
          title: "Pre-filtering with kNN search in Elasticsearch",
          subTitle: "12 August 2025",
          articleType: this.articleType,
          articleId: "ElasticsearchPreFilteringWithKnnSearch",
        },
        {
          imageSrc: blogcoverImage2,
          altText: "Cover image for the blog titled Collapse search results in Elasticsearch",
          title: "Collapse search results in Elasticsearch",
          subTitle: "20 August 2025",
          articleType: this.articleType,
          articleId: "ElasticsearchCollapseSearchResults",
        },
        {
          imageSrc: blogcoverImage3,
          altText: "Cover image for the blog titled Change the heap size for Elasticsearch",
          title: "Change the heap size for Elasticsearch",
          subTitle: "12 August 2025",
          articleType: this.articleType,
          articleId: "ElasticsearchChangeHeapSize",
        },
      ];
    },
    handleSearchRequest(data) {
      console.log("Search requested for:", data);
    },
  },
};
</script>

<style scoped></style>
