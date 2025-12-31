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

      <CardGroup title="Blogs" :cards-data="blogsCardData" button-text="View all blogs" path="blogs" />
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

      <CardGroup title="Courses" :cards-data="coursesCardData" button-text="View all courses" path="courses" />
      <img
        class="quasar-image"
        :src="quasarIllustration"
        alt="Blue quasar at the center of a spiral galaxy with energetic jets."
      />

      <CardGroup title="Universe" :cards-data="universeImagesCardData" button-text="View all images" path="astronomy" />
    </div>
  </div>
</template>

<script>
// Third-party libraries
import axios from "axios";

// Utils
import { getCardsDataFromDocumentHits, trackVisitorData } from "@/utils";

// Constants
import { PAGE_KEYS, ARTICLE_TYPES } from "@/constants";

// Components
import HeroSection from "@/components/HeroSection.vue";
import AboutMeSection from "@/components/AboutMeSection.vue";
import CardGroup from "@/components/CardGroup.vue";

// Illustrations
import scorpiusIllustration from "@/assets/illustrations/scorpius.svg";
import orionIllustration from "@/assets/illustrations/orion.svg";
import quasarIllustration from "@/assets/illustrations/quasar.svg";
import horizontalSolarSystemIllustration from "@/assets/illustrations/codingSolarSystemHorizontal.svg";
import verticalSolarSystemIllustration from "@/assets/illustrations/codingSolarSystemVertical.svg";

export default {
  name: "HomeView",
  components: {
    HeroSection,
    AboutMeSection,
    CardGroup,
  },
  emits: ["page-visited", "show-toast"],
  data() {
    return {
      scorpiusIllustration,
      quasarIllustration,
      orionIllustration,
      horizontalSolarSystemIllustration,
      verticalSolarSystemIllustration,

      coursesCardData: [],
      blogsCardData: [],
      universeImagesCardData: [],
    };
  },
  async mounted() {
    document.title = "Imad Saddik";
    this.$emit("page-visited", PAGE_KEYS.HOME);
    this.blogsCardData = await this.getLatestArticlesPerType(ARTICLE_TYPES.BLOG);
    this.coursesCardData = await this.getLatestArticlesPerType(ARTICLE_TYPES.COURSE);
    this.universeImagesCardData = await this.getLatestArticlesPerType(ARTICLE_TYPES.ASTRONOMY);
    trackVisitorData(PAGE_KEYS.HOME);
  },
  methods: {
    async getLatestArticlesPerType(articleType) {
      try {
        const endpoint = "/api/articles/latest";
        const response = await axios.post(endpoint, { article_type: articleType });

        const data = response.data;
        const hits = data?.hits || [];
        return getCardsDataFromDocumentHits({
          hits,
          articleType,
        });
      } catch (error) {
        if (error.response && error.response.status === 429) {
          this.$emit("show-toast", {
            message: "Patience, stargazer! Even the universe needs a second to update the latest discoveries.",
            type: "warning",
          });
        } else {
          this.$emit("show-toast", {
            message: `Failed to fetch the latest ${articleType} articles`,
            type: "error",
          });
        }
      }
    },
  },
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
