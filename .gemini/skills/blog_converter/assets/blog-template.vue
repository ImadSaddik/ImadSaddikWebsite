<template>
  <ArticleLayout
    :title="title"
    sub-title="{{SUBTITLE}}"
    creation-date="{{CREATION_DATE}}"
    :article-type="ARTICLE_TYPES.{{ARTICLE_TYPE}}"
    :article-tags="tags"
    :cover-image="coverImage"
    :reading-time="readingTime"
    :slug="slug"
    :markdown-content="markdownContent"
    @show-toast="handleShowToastEvent"
  >
    <!-- CONTENT_SECTION_START -->
    {{ CONTENT_BODY }}
    <!-- CONTENT_SECTION_END -->
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
// IMPORT_IMAGES_HERE

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";
// IMPORT_EXTRA_COMPONENTS_HERE

// Composables
import { useImageModal } from "@/composables/useImageModal.js";
import { useArticleContent } from "@/composables/useArticleContent.js";

export default {
  name: "{{COMPONENT_NAME}}",
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
    // REGISTER_EXTRA_COMPONENTS_HERE
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "{{TITLE}}";

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
      tags: [{{TAGS}}],
      markdownContent,

      // Images
      coverImage,
      // REGISTER_IMAGES_HERE

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
