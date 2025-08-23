<template>
  <div class="home-view-container">
    <div class="main-content">
      <HeroSection />

      <AboutMeSection />
      <img
        class="orion-image"
        :src="orionIllustration"
        alt="Orion constellation with connecting lines and colorful stars and galaxies."
      />
      <img
        class="scorpius-image"
        :src="scorpiusIllustration"
        alt="Scorpius constellation with connecting lines and colorful stars and galaxies."
      />

      <CardGroup title="Blogs" :cards-data="blogsCardData" button-text="View all blogs" />
      <img
        class="horizontal-solar-system-image"
        :src="horizontalSolarSystemIllustration"
        alt="Stylized illustration of a solar system showing 4 planets and a sun."
      />
      <img
        class="vertical-solar-system-image"
        :src="verticalSolarSystemIllustration"
        alt="Stylized illustration of a solar system showing 4 planets and a sun."
      />

      <CardGroup title="Courses" :cards-data="coursesCardData" button-text="View all courses" />
      <img
        class="quasar-image"
        :src="quasarIllustration"
        alt="Blue quasar at the center of a spiral galaxy with energetic jets."
      />

      <CardGroup title="Universe" :cards-data="universeImagesCardData" button-text="View all images" />
    </div>
  </div>
</template>

<script>
// Components
import HeroSection from "@/components/HeroSection.vue";
import AboutMeSection from "@/components/AboutMeSection.vue";
import CardGroup from "@/components/CardGroup.vue";

// Illustrations
import scorpiusIllustration from "@/assets/illustrations/scorpius.svg";
import orionIllustration from "@/assets/illustrations/orion.svg";
import quasarIllustration from "@/assets/illustrations/quasar.svg";
import horizontalSolarSystemIllustration from "@/assets/illustrations/solarSystemHorizontal.svg";
import verticalSolarSystemIllustration from "@/assets/illustrations/solarSystemVertical.svg";

// Images
import blogcoverImage1 from "@/blogs/ElasticsearchPreFilteringWithKnnSearch/coverImage.svg";
import blogcoverImage2 from "@/blogs/ElasticsearchCollapseSearchResults/coverImage.svg";
import blogcoverImage3 from "@/blogs/ElasticsearchChangeHeapSize/coverImage.svg";
import coursePlaceholder1 from "@/assets/courses/placeholder_1.svg";
import coursePlaceholder2 from "@/assets/courses/placeholder_2.svg";

export default {
  name: "HomeView",
  components: {
    HeroSection,
    AboutMeSection,
    CardGroup,
  },
  data() {
    return {
      scorpiusIllustration,
      quasarIllustration,
      orionIllustration,
      horizontalSolarSystemIllustration,
      verticalSolarSystemIllustration,

      coursesCardData: [
        {
          imageSrc: coursePlaceholder1,
          altText: "Course placeholder 1",
          title: "Image title 1",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder2,
          altText: "Course placeholder 2",
          title: "Image title 2",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder1,
          altText: "Course placeholder 3",
          title: "Image title 3",
          subTitle: "16 August 2001",
        },
      ],
      blogsCardData: [
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
      universeImagesCardData: [
        {
          imageSrc: coursePlaceholder1,
          altText: "Cosmos image placeholder 1",
          title: "Cosmos Image Title 1",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder2,
          altText: "Cosmos image placeholder 2",
          title: "Cosmos Image Title 2",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder1,
          altText: "Cosmos image placeholder 3",
          title: "Cosmos Image Title 3",
          subTitle: "16 August 2001",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
.home-view-container {
  width: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--gap-xl);
}

.quasar-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-between-sections-big);
  width: 20%;
}

.horizontal-solar-system-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-between-sections-big);
  width: 100%;
}

.vertical-solar-system-image {
  display: none;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-between-sections-big);
  width: 100%;
}

.scorpius-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-between-sections-big);
  width: 100%;
}

.orion-image {
  display: none;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-between-sections-big);
  width: 100%;
}

@media screen and (max-width: 2000px) {
  .quasar-image {
    width: 30%;
  }
}

@media screen and (max-width: 1500px) {
  .quasar-image {
    width: 40%;
    margin-top: var(--gap-between-sections-medium);
  }

  .horizontal-solar-system-image {
    margin-top: var(--gap-between-sections-medium);
  }

  .scorpius-image {
    margin-top: var(--gap-between-sections-medium);
  }
}

@media screen and (max-width: 1100px) {
  .main-content {
    padding: var(--gap-lg);
  }

  .quasar-image {
    width: 50%;
  }

  .scorpius-image {
    display: none;
  }

  .orion-image {
    display: flex;
    width: 70%;
    margin-top: var(--gap-between-sections-small);
  }

  .horizontal-solar-system-image {
    display: none;
  }

  .vertical-solar-system-image {
    display: flex;
    width: 100%;
    margin-top: var(--gap-between-sections-small);
  }
}

@media screen and (max-width: 768px) {
  .main-content {
    padding: var(--gap-md);
  }

  .quasar-image {
    width: 60%;
    margin-top: var(--gap-between-sections-small);
  }

  .orion-image {
    display: flex;
    width: 100%;
  }

  .scorpius-image {
    margin-top: var(--gap-between-sections-small);
  }
}

@media screen and (max-width: 576px) {
  .quasar-image {
    width: 70%;
  }
}
</style>
