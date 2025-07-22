<template>
  <div class="container">
    <div class="main-content">
      <HeroSection />
      <SeparatorImage
        :image-src="scorpiusIllustration"
        alt-text="Scorpius constellation with connecting lines and colorful stars and galaxies."
        image-width="100%"
      />

      <AboutMeSection />
      <SeparatorImage
        :image-src="quasarIllustration"
        alt-text="Blue quasar at the center of a spiral galaxy with energetic jets."
        image-width="20%"
      />

      <CardGroup title="Courses" :cards-data="coursesCardData" button-text="View all courses" />
      <SeparatorImage
        :image-src="solarSystemIllustration"
        alt-text="Stylized illustration of a solar system showing 4 planets and a sun."
        image-width="100%"
      />

      <CardGroup title="Articles" :cards-data="articlesCardData" button-text="View all articles" />
      <SeparatorImage
        :image-src="starTrailsIllustration"
        alt-text="White star trails forming concentric arcs."
        image-width="50%"
      />

      <CardGroup title="Cosmos Images" :cards-data="cosmosImagesCardData" button-text="View all cosmos images" />

      <section class="footer-section">
        <div class="footer-content">
          <h3 class="footer-title">Imad Saddik</h3>
          <p class="footer-description">Programming, exploring the sky, and sharing everything I learn.</p>

          <div class="footer-logos">
            <img :src="githubLogo" alt="GitHub logo" />
            <img :src="huggingFaceLogo" alt="Hugging Face logo" />
            <img :src="youtubeLogo" alt="YouTube logo" />
            <img :src="mediumLogo" alt="Medium logo" />
            <img :src="linkedinLogo" alt="LinkedIn logo" />
          </div>

          <p class="footer-rights">All rights reserved © 2025 Imad Saddik</p>
        </div>

        <div class="footer-images">
          <img class="footer-telescope" src="@/assets/telescope.svg" alt="Telescope" />
          <img
            class="footer-objects"
            src="@/assets/objects_telescope_looking_at.svg"
            alt="Objects Telescope Looking At"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// Components
import SeparatorImage from "@/components/SeparatorImage.vue";
import HeroSection from "@/components/HeroSection.vue";
import AboutMeSection from "@/components/AboutMeSection.vue";
import CardGroup from "@/components/CardGroup.vue";

// Illustrations
import scorpiusIllustration from "@/assets/illustrations/scorpius.svg";
import quasarIllustration from "@/assets/illustrations/quasar.svg";
import solarSystemIllustration from "@/assets/illustrations/solar_system.svg";
import starTrailsIllustration from "@/assets/illustrations/star_trails.svg";

// Logos
import githubLogo from "@/assets/logos/github.svg";
import huggingFaceLogo from "@/assets/logos/hugging_face.svg";
import youtubeLogo from "@/assets/logos/youtube.svg";
import mediumLogo from "@/assets/logos/medium.svg";
import linkedinLogo from "@/assets/logos/linkedin.svg";

// placeholder images
import coursePlaceholder1 from "@/assets/courses/placeholder_1.svg";
import coursePlaceholder2 from "@/assets/courses/placeholder_2.svg";

export default {
  name: "HomeView",
  components: {
    SeparatorImage,
    HeroSection,
    AboutMeSection,
    CardGroup,
  },
  data() {
    return {
      scorpiusIllustration,
      quasarIllustration,
      solarSystemIllustration,
      starTrailsIllustration,

      githubLogo,
      huggingFaceLogo,
      youtubeLogo,
      mediumLogo,
      linkedinLogo,

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
      cosmosImagesCardData: [
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
.container {
  width: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--gap-xl);
}

.footer-section {
  width: 100%;
  margin-top: 15rem;
  border-top: 1px solid var(--color-text-secondary);
  position: relative;
}

.footer-title {
  font-size: var(--font-size-big);
  margin-top: 6rem;
  margin-bottom: var(--gap-sm);
}

.footer-description {
  font-size: var(--font-size-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--gap-md);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: var(--gap-xl);
}

.footer-logos {
  display: flex;
  gap: var(--gap-sm);
  margin-bottom: var(--gap-md);
}

.footer-logos img {
  height: 32px;
}

.footer-rights {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: var(--gap-xl);
}

.footer-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.footer-telescope {
  position: absolute;
  bottom: 0;
  left: 60%;
}

.footer-objects {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 360px;
  height: auto;
}
</style>
