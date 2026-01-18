<template>
  <ArticleLayout
    :title="title"
    sub-title="Learn Elasticsearch from scratch with practical examples in Python."
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
        This course is for anyone new to
        <a href="https://www.elastic.co/elasticsearch" target="_blank">Elasticsearch</a>. If you have some experience,
        you'll still find it helpful for building a strong foundation.
      </p>
      <p>
        Each topic is explained simply, with practical examples you can try on your own computer. We'll connect to
        Elasticsearch using <a href="https://www.python.org/downloads/" target="_blank">Python</a> and run Elasticsearch
        locally in a <a href="https://www.docker.com/resources/what-container/" target="_blank">Docker container</a>.
      </p>
      <p>
        You'll learn about
        <a href="https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/field-data-types" target="_blank"
          >field data types</a
        >, how to create an index, add documents, and search for them using different methods like
        <a href="https://en.wikipedia.org/wiki/Semantic_search" target="_blank">semantic search</a>,
        <a href="https://en.wikipedia.org/wiki/Full-text_search" target="_blank">full text search</a>, and
        <a href="https://www.elastic.co/what-is/hybrid-search" target="_blank">hybrid search</a>. You'll also see how to
        update and delete documents, use aggregations, and much more.
      </p>
      <p>
        At the end of the course, we'll put everything together in a
        <a href="https://www.youtube.com/watch?v=rsC96vtM5K8&t=32s" target="_blank">final project</a>. You'll work with
        real data and use Elasticsearch to build a great search feature for a web app made just for this course.
      </p>
      <p>
        All course materials, slides, and Jupyter notebooks are available on my
        <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course" target="_blank">GitHub repository</a>. By
        the end, you'll understand how Elasticsearch works and how to use it in your own projects.
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
      <YouTubePlayer video-url="https://www.youtube.com/embed/a4HBKEda_F8" />
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
import { useArticleContent } from "@/composables/useArticleContent";

export default {
  name: "ElasticsearchForBeginners",
  components: {
    ImageEnlarger,
    YouTubePlayer,
    ArticleLayout,
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "Elasticsearch for beginners";

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
      tags: ["Elasticsearch", "Search", "Python"],
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
