<template>
  <ArticleLayout
    ref="articleContent"
    title="Train your own language model"
    sub-title="Learn every step needed to train a language model from scratch in Python."
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
        This course is for beginners who want to understand how
        <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank">large language models</a>
        (<InlineCode text="LLMs" />) work and learn how to build one from scratch. We will cover all the steps needed to
        train a language model, including collecting data, processing it, understanding the
        <a href="https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)" target="_blank"
          >Transformer architecture</a
        >, pre-training, and <a href="https://arxiv.org/html/2408.13296v1" target="_blank">fine-tuning</a>.
      </p>
      <p>
        In this course, I will show you how I trained a language model on
        <a href="https://en.wikipedia.org/wiki/Moroccan_Arabic" target="_blank">Moroccan Darija</a> using a dataset from
        my conversations with friends. Later, I used a larger dataset from
        <a href="https://huggingface.co/datasets" target="_blank">Hugging Face</a> and will explain how to work with big
        datasets without
        <a href="https://en.wikipedia.org/wiki/Out_of_memory" target="_blank">running out of memory</a>. Finally, I will
        show you how to fine-tune the base model on a
        <a href="https://huggingface.co/learn/llm-course/en/chapter11/1" target="_blank"
          >Supervised Fine-Tuning (SFT)</a
        >
        dataset to make the model conversational.
      </p>
      <p>
        Each step is divided into two parts: <InlineCode text="theory" /> and <InlineCode text="practice" />. The theory
        is explained in detail in the
        <a href="https://github.com/ImadSaddik/Train_Your_Language_Model_Course/blob/main/Slides.pdf" target="_blank"
          >slides</a
        >, and the practical part is available as a Jupyter notebook on
        <a href="https://github.com/ImadSaddik/Train_Your_Language_Model_Course" target="_blank">GitHub</a>. The course
        is easy to follow, and I explain each step along the way.
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
      <YouTubePlayer video-url="https://www.youtube.com/embed/9Ge0sMm65jo" />
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

// Components
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";
import InlineCode from "@/components/InlineCode.vue";

export default {
  name: "TrainYourOwnLanguageModel",
  components: {
    ImageEnlarger,
    YouTubePlayer,
    ArticleLayout,
    InlineCode,
  },
  emits: ["show-toast", "article-read"],
  data() {
    return {
      tags: ["LLM", "Transformer", "Fine-tuning", "Attention", "PyTorch", "Python", "AI", "NLP", "Machine learning"],
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
    document.title = "Train your own language model";
    const articleContent = this.$refs.articleContent.$el.innerText;
    this.readingTime = calculateReadingTime(articleContent);
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
