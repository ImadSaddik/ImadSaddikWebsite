<template>
  <div class="home-view-container">
    <div class="main-content">
      <HeroSection />
      <!-- <SeparatorImage
        :image-src="scorpiusIllustration"
        alt-text="Scorpius constellation with connecting lines and colorful stars and galaxies."
        image-width="100%"
      /> -->

      <AboutMeSection />
      <img
        class="quasar-image"
        :src="quasarIllustration"
        alt="Blue quasar at the center of a spiral galaxy with energetic jets."
      />

      <CardGroup title="Courses" :cards-data="coursesCardData" button-text="View all courses" />
      <img
        class="solar-system-image"
        :src="solarSystemIllustration"
        alt="Stylized illustration of a solar system showing 4 planets and a sun."
      />
      <!-- 

      
      

      <CardGroup title="Articles" :cards-data="articlesCardData" button-text="View all articles" />
      <SeparatorImage
        :image-src="starTrailsIllustration"
        alt-text="White star trails forming concentric arcs."
        image-width="25%"
      />

      <CardGroup title="Universe" :cards-data="universeImagesCardData" button-text="View all images" /> -->
    </div>

    <!-- <FooterSection /> -->
  </div>
</template>

<script>
// Components
// import SeparatorImage from "@/components/SeparatorImage.vue";
import HeroSection from "@/components/HeroSection.vue";
import AboutMeSection from "@/components/AboutMeSection.vue";
import CardGroup from "@/components/CardGroup.vue";
// import FooterSection from "@/components/FooterSection.vue";

// Illustrations
import scorpiusIllustration from "@/assets/illustrations/scorpius.svg";
import quasarIllustration from "@/assets/illustrations/quasar.svg";
import solarSystemIllustration from "@/assets/illustrations/solar_system.svg";
import starTrailsIllustration from "@/assets/illustrations/star_trails.svg";

// placeholder images
import coursePlaceholder1 from "@/assets/courses/placeholder_1.svg";
import coursePlaceholder2 from "@/assets/courses/placeholder_2.svg";

export default {
  name: "HomeView",
  components: {
    // SeparatorImage,
    HeroSection,
    AboutMeSection,
    CardGroup,
    // FooterSection,
  },
  data() {
    return {
      scorpiusIllustration,
      quasarIllustration,
      solarSystemIllustration,
      starTrailsIllustration,

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
      articlesCardData: [
        {
          imageSrc: coursePlaceholder1,
          altText: "Article placeholder 1",
          title: "Article title 1",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder2,
          altText: "Article placeholder 2",
          title: "Article title 2",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder1,
          altText: "Article placeholder 3",
          title: "Article title 3",
          subTitle: "16 August 2001",
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

.solar-system-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-between-sections-big);
  width: 100%;
}

@media screen and (max-width: 2000px) {
  .main-content {
    padding: var(--gap-lg);
  }

  .quasar-image {
    width: 30%;
  }
}

@media screen and (max-width: 1500px) {
  .quasar-image {
    width: 40%;
    margin-top: var(--gap-between-sections-medium);
  }

  .solar-system-image {
    margin-top: var(--gap-between-sections-medium);
  }
}

@media screen and (max-width: 1100px) {
  .quasar-image {
    width: 50%;
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

  .solar-system-image {
    margin-top: var(--gap-between-sections-small);
  }
}

@media screen and (max-width: 576px) {
  .quasar-image {
    width: 70%;
  }
}
</style>
