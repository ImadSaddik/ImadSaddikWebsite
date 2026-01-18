<template>
  <ArticleLayout
    ref="articleContent"
    title="OSRM for beginners"
    sub-title="Learn the different ways to use OSRM (Open Source Routing Machine) with practical examples in Python."
    creation-date="September 26, 2025"
    :article-type="ARTICLE_TYPES.COURSE"
    :article-tags="tags"
    :cover-image="coverImage"
    :reading-time="readingTime"
    :slug="slug"
    :markdown-content="markdownContent"
    @show-toast="handleShowToastEvent"
  >
    <section>
      <h2 id="course-overview" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#course-overview">Course overview</a>
      </h2>
      <p>
        This course will teach you how to use
        <a href="https://github.com/Project-OSRM/osrm-backend" target="_blank">OSRM (Open Source Routing Machine)</a>
        for different routing tasks. OSRM is a free and powerful tool that helps you find the shortest route between
        places, solve the
        <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem" target="_blank"
          >traveling salesman problem (TSP)</a
        >, and much more.
      </p>
      <p>
        You’ll learn how to set up OSRM on your computer using
        <a href="https://www.docker.com/" target="_blank">Docker</a>, download a map area to focus your searches, and
        use OSRM with <a href="https://www.python.org/downloads/" target="_blank">Python</a>. The course is made for
        beginners, so you don’t need any previous experience with OSRM or routing tools.
      </p>

      <div>
        <p>Here’s what you’ll learn:</p>
        <BulletPoint v-for="(item, index) in bulletPoints" :key="index">{{ item }}</BulletPoint>
      </div>

      <p>
        All course materials, slides, and Jupyter notebooks are available on my
        <a href="https://github.com/ImadSaddik/OSRM_Course_Python" target="_blank">GitHub repository</a>. By the end of
        the course, you’ll know how OSRM works and how to use it in your own projects.
      </p>
    </section>

    <section>
      <h2 id="watch-the-course" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#watch-the-course">Watch the course</a>
      </h2>
      <p>
        I believe knowledge should be free, so I am sharing this course for free on the freeCodeCamp YouTube channel.
        You can watch the full course below.
      </p>
      <YouTubePlayer video-url="https://www.youtube.com/embed/o9Bgwq_H-rE" />
      <p>
        Creating courses like this takes months of research, experiments, designing illustrations, recording, and more.
        If you want to support my mission to share free knowledge, you can
        <a href="https://github.com/sponsors/ImadSaddik" target="_blank">sponsor me on GitHub</a>,
        <a href="https://www.patreon.com/3CodeCamp" target="_blank">support me on Patreon</a>, or
        <a href="https://www.paypal.com/paypalme/ImadSaddik" target="_blank">donate via PayPal</a>.
      </p>
    </section>
  </ArticleLayout>

  <ImageEnlarger
    :is-visible="isImageModalVisible"
    :enlarged-image-src="enlargedImageSrc"
    @close-image-modal="handleCloseImageModal"
  />
</template>

<script>
// Text & Utils
import { calculateReadingTime } from "@/utils";
import markdownContent from "./content.md";

// Images
import coverImage from "./coverImage.svg";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";
import BulletPoint from "@/components/BulletPoint.vue";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";

export default {
  name: "OSRMForBeginners",
  components: {
    ImageEnlarger,
    YouTubePlayer,
    ArticleLayout,
    BulletPoint,
  },
  emits: ["show-toast", "article-read"],
  setup() {
    const { enlargedImageSrc, isImageModalVisible, handleOpenImageModal, handleCloseImageModal } = useImageModal();
    return {
      // Refs
      enlargedImageSrc,
      isImageModalVisible,

      // Methods
      handleOpenImageModal,
      handleCloseImageModal,
    };
  },
  data() {
    return {
      // Variables
      tags: ["OSRM", "Routing", "Python", "Docker", "TSP"],
      readingTime: 0,
      markdownContent,
      bulletPoints: [
        "How to set up OSRM with Docker.",
        "How to download and prepare map data from any region in the world.",
        "How to find the shortest path between two points.",
        "How to generate a distance matrix (table) between multiple locations.",
        "How to solve the Traveling Salesman Problem (TSP).",
      ],

      // Images
      coverImage,

      // Constants
      ARTICLE_TYPES,
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  mounted() {
    document.title = "OSRM for beginners";
    const articleContent = this.$refs.articleContent.$el.innerText;
    this.readingTime = calculateReadingTime(articleContent);
    const readTimeThresholdInMilliseconds = this.readingTime * 0.25 * 60 * 1000;
    setTimeout(() => {
      this.$emit("article-read");
    }, readTimeThresholdInMilliseconds);
  },
  methods: {
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped></style>
