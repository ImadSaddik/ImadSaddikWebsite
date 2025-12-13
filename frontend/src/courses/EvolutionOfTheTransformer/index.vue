<template>
  <ArticleLayout
    ref="articleContent"
    title="Evolution of the Transformer architecture from 2017 to 2025"
    sub-title="Discover how the Transformer architecture has evolved over the years. Implement the different ideas that researchers proposed to improve the original Transformer architecture."
    creation-date="September 26, 2025"
    article-type="course-post"
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
        This course explores how the
        <a href="https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)" target="_blank"
          >Transformer architecture</a
        >
        has changed from its introduction in the famous paper
        <a href="https://arxiv.org/pdf/1706.03762" target="_blank">Attention is all you need</a> in 2017 to the latest
        updates in 2025. We will look at the main ideas that researchers have used to improve the original Transformer,
        and you will learn how to build these improvements step by step.
      </p>
      <p>
        You will learn both the theory and the practical side. We will cover different ways to encode the position of
        tokens, new
        <a href="https://en.wikipedia.org/wiki/Attention_(machine_learning)" target="_blank">attention mechanisms</a>,
        <a href="https://en.wikipedia.org/wiki/Activation_function" target="_blank">activation functions</a>,
        <a href="https://en.wikipedia.org/wiki/Normalization_(machine_learning)" target="_blank"
          >normalization methods</a
        >, and other ideas that have helped make Transformers better.
      </p>
      <p>
        You will use <a href="https://www.python.org/downloads/" target="_blank">Python</a> and
        <a href="https://pytorch.org/" target="_blank">PyTorch</a> to implement everything. I explain each idea in
        simple terms so anyone can follow along. All course materials, slides, and Jupyter notebooks are available on my
        <a href="https://github.com/ImadSaddik/Train_Your_Language_Model_Course" target="_blank">GitHub repository</a>.
      </p>
      <p>
        By the end of the course, you will build several models using the ideas we discuss. We will compare their
        performance to see which ones work best. This will help us understand which improvements are most effective.
      </p>
    </section>

    <section>
      <h2 id="watch-the-course" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#watch-the-course">Watch the course</a>
      </h2>
      <p>
        I believe knowledge should be free, so I am sharing this course for free on the freeCodeCamp YouTube channel.
        You can watch the full course below:
      </p>
      <YouTubePlayer video-url="https://www.youtube.com/embed/8WBS0dT0h2I" />
      <p>
        Creating courses like this takes months of research, experiments, designing illustrations, recording, and more.
        If you want to support my mission to share free knowledge, you can
        <a href="https://github.com/sponsors/ImadSaddik" target="_blank">sponsor me on GitHub</a>
        or <a href="https://www.patreon.com/3CodeCamp" target="_blank">support me on Patreon</a>.
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
import { calculateReadingTime } from "@/utils.js";
import markdownContent from "./content.md";

// Images
import coverImage from "./coverImage.svg";

// Components
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";

export default {
  name: "EvolutionOfTheTransformer",
  components: {
    ImageEnlarger,
    YouTubePlayer,
    ArticleLayout,
  },
  emits: ["show-toast", "article-read"],
  data() {
    return {
      tags: [
        "LLM",
        "Transformer",
        "Attention",
        "Positional encoding",
        "Normalization",
        "PyTorch",
        "Python",
        "AI",
        "NLP",
        "Machine learning",
      ],
      coverImage,
      enlargedImageSrc: "",
      isImageModalVisible: false,
      readingTime: 0,
      markdownContent,
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  mounted() {
    document.title = "Evolution of the Transformer architecture from 2017 to 2025";
    this.readingTime = calculateReadingTime(this.$refs);
    const readTimeThresholdInMilliseconds = this.readingTime * 0.25 * 60 * 1000;
    setTimeout(() => {
      this.$emit("article-read");
    }, readTimeThresholdInMilliseconds);
  },
  methods: {
    handleOpenImageModal(event) {
      this.enlargedImageSrc = event.target.src;
      this.isImageModalVisible = true;
      window.addEventListener("keydown", this.handleEscape);
    },
    handleCloseImageModal() {
      this.isImageModalVisible = false;
      this.enlargedImageSrc = "";
      window.removeEventListener("keydown", this.handleEscape);
    },
    handleEscape(event) {
      if (event.key === "Escape") {
        this.handleCloseImageModal();
      }
    },
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped></style>
