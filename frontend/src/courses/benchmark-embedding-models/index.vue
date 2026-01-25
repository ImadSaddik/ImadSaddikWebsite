<template>
  <ArticleLayout
    :title="title"
    sub-title="Learn how to benchmark embedding models on your own data in this course for beginners."
    creation-date="January 25, 2026"
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
        In this course, you will learn the limitations of extracting text from PDF files with Python libraries and how
        to solve that with the help of VLMs (Vision Language Models).
      </p>
      <p>
        We will cover how to divide the extracted text into chunks that preserve context and generate questions for each
        chunk using LLMs (Large Language Models). You will learn to use embedding models to create vector
        representations of the chunks and questions, utilizing both open source and proprietary embedding models.
      </p>
      <p>
        You'll also discover how to use
        <a href="https://github.com/ggerganov/llama.cpp" target="_blank">llama.cpp</a> to run models in the GGUF format
        locally on your machine. We will perform benchmarking of different embedding models using various metrics and
        statistical tests with the help of <a href="https://github.com/AmenRa/ranx" target="_blank">ranx</a>.
      </p>
      <p>
        Furthermore, we will plot the vector representations to visualize if clusters are being formed and understand
        how to interpret the p-value that a statistical test provides.
      </p>
      <p>
        You can find the slides, notebook, and scripts in this
        <a href="https://github.com/ImadSaddik/Benchmark_Embedding_Models" target="_blank">GitHub repository</a>. The
        dataset is available here:
        <a href="https://huggingface.co/datasets/ImadSaddik/BenchmarkEmbeddingModelsCourse" target="_blank"
          >HuggingFace dataset</a
        >.
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
      <YouTubePlayer video-url="https://www.youtube.com/embed/7G9q_5q82hY" />
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
import markdownContent from "./content.md";

// Images
import coverImage from "./coverImage.svg";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";
import { useArticleContent } from "@/composables/useArticleContent.js";

export default {
  name: "BenchmarkEmbeddingModels",
  components: {
    ImageEnlarger,
    YouTubePlayer,
    ArticleLayout,
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "How to benchmark embedding models on your own data";

    const { enlargedImageSrc, isImageModalVisible, handleOpenImageModal, handleCloseImageModal } = useImageModal();
    const { slug, readingTime } = useArticleContent({ title, emit, content: markdownContent });
    return {
      // Variables
      title,
      slug,
      readingTime,
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
      tags: ["Embedding", "LLM", "VLM", "Python", "Benchmarking", "Statistical tests", "t-SNE"],
      coverImage,
      markdownContent,

      // Constants
      ARTICLE_TYPES,
    };
  },
  methods: {
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped></style>
