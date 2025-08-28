<template>
  <ArticlesHub
    article-title="Blogs"
    search-placeholder="What blogs are you curious about today?"
    sort-placeholder="Show me blogs sorted by..."
    :article-type="articleType"
    :card-data="cardData"
    @perform-search="performSearchRequest"
  />
</template>

<script>
// Third-party libraries
import axios from "axios";

// Components
import ArticlesHub from "@/components/ArticlesHub.vue";

export default {
  name: "BlogHub",
  components: {
    ArticlesHub,
  },
  data() {
    return {
      articleType: "blog-post",
      cardData: [],
      searchResponse: null,
    };
  },
  async mounted() {
    await this.getCardsData();
    this.setCardsData();
  },
  methods: {
    async getCardsData() {
      const data = {
        articleType: this.articleType,
      };
      await this.performSearchRequest(data);
    },
    async performSearchRequest(data) {
      try {
        const response = await axios.post("/api/search", JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10_000,
        });
        this.searchResponse = response.data;
        this.setCardsData();
      } catch {
        this.$emit("show-toast", {
          message: "Failed to perform search",
          type: "error",
        });
      }
    },
    setCardsData() {
      const hits = this.searchResponse?.hits || [];
      this.cardData = hits.map((hit) => ({
        imageSrc: require(`@/blogs/${hit.name}/coverImage.svg`),
        altText: `Cover image for the blog titled ${hit.title}`,
        title: hit.title,
        subTitle: this.convertUnixTimestampToReadableFormat(hit.creation_date),
        articleType: this.articleType,
        articleId: hit.name,
      }));
    },
    convertUnixTimestampToReadableFormat(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped></style>
