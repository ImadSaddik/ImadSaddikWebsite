<template>
  <div class="hire-me-container">
    <div class="hire-me-content" :class="{ wide: wideArticlesEnabled }">
      <HireMeContent />

      <ImageWithCaption
        :image-src="heartShapedAntennaGalaxies"
        image-alt="Heart shaped antenna galaxies"
        @open-image-modal="handleOpenImageModal"
      >
        A photo of the heart shaped Antennae Galaxies.
        <a href="https://esahubble.org/images/heic0812c/" target="_blank" rel="noopener noreferrer"
          >Credit: Robert Gendler</a
        >
      </ImageWithCaption>

      <section class="get-in-touch-section">
        <h2 id="get-in-touch" data-table-of-contents>
          <a class="clickable-header-link" href="#get-in-touch">Get in touch</a>
        </h2>
        <p>
          I am always open to discussing complex systems, backend scaling challenges, or how to integrate intelligent
          automation into your workflow.
        </p>
        <div class="action-buttons">
          <button class="primary-button book-meeting-button" @click="openCalendlyLink">Book a meeting</button>
          <button class="secondary-button resume-button" @click="openResumeLink">Download resume</button>
        </div>
      </section>
    </div>

    <TableOfContents />
  </div>

  <ImageEnlarger
    :is-visible="isImageModalVisible"
    :enlarged-image-src="enlargedImageSrc"
    @close-image-modal="handleCloseImageModal"
  />
</template>

<script>
// Constants
import { PAGE_KEYS } from "@/constants";

// Utils
import { trackVisitorData } from "@/utils";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";

// Components
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import TableOfContents from "@/components/TableOfContents.vue";
import HireMeContent from "./content.md";

// Images
import heartShapedAntennaGalaxies from "@/assets/heart_shaped_antenna_galaxies.jpeg";

export default {
  name: "HireMe",
  components: {
    ImageWithCaption,
    ImageEnlarger,
    TableOfContents,
    HireMeContent,
  },
  inject: ["wideArticlesEnabled"],
  emits: ["page-visited", "show-toast"],
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
      // Images
      heartShapedAntennaGalaxies,
    };
  },
  mounted() {
    document.title = "Hire Imad Saddik";
    this.$emit("page-visited", PAGE_KEYS.HIRE_ME);
    trackVisitorData(PAGE_KEYS.HIRE_ME);
  },
  methods: {
    openCalendlyLink() {
      const calendlyWindow = window.open("https://calendly.com/simad3647/30min", "_blank", "noopener,noreferrer");
      if (!calendlyWindow) {
        this.emitToastEvent({
          type: "error",
          message: "Popup was blocked! Please allow popups for this site to book a meeting.",
        });
      }
    },
    openResumeLink() {
      window.open("https://imadsaddik.com/resume", "_blank", "noopener,noreferrer");
    },
    emitToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped>
.hire-me-container {
  display: flex;
  position: relative;
  width: 100%;
  padding: var(--gap-xl);
  margin-top: var(--gap-2xl);
  box-sizing: border-box;
}

.hire-me-content {
  width: 50%;
  transition: width 0.3s;
}

.hire-me-content.wide {
  width: 75%;
}

.hire-me-content :deep(p) {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

.hire-me-content :deep(.unordered-item p) {
  margin: 0;
}

.hire-me-content :deep(h1) {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

.hire-me-content :deep(.article-body-header) {
  font-size: var(--font-size-big-medium);
  margin: var(--gap-md) 0;
}

.hire-me-content :deep(.article-body-subheader) {
  font-size: var(--font-size-medium);
  margin: var(--gap-sm) 0;
}

.get-in-touch-section {
  text-align: left;
  border: 1px solid var(--color-tag-border);
  margin-top: var(--gap-xl);
  padding: var(--gap-2xl) var(--gap-xl);
  background: rgba(255, 255, 255, 0.02);
}

.get-in-touch-section h2 {
  font-size: var(--font-size-big-medium);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

.get-in-touch-section p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-md);
  margin-top: var(--gap-lg);
}

.book-meeting-button,
.resume-button {
  padding: var(--gap-sm) var(--gap-md);
  font-size: var(--font-size-small);
  font-weight: 600;
  width: 220px;
}

@media screen and (max-width: 1300px) {
  .hire-me-content,
  .hire-me-content.wide {
    width: 65%;
  }
}

@media screen and (max-width: 1100px) {
  .hire-me-content,
  .hire-me-content.wide {
    width: 100%;
  }

  .hire-me-container {
    padding: var(--gap-lg);
    margin-top: var(--gap-md);
    flex-direction: column;
  }

  .get-in-touch-section {
    padding: var(--gap-lg);
  }
}

@media screen and (max-width: 768px) {
  .hire-me-container {
    padding: var(--gap-md);
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .book-meeting-button,
  .resume-button {
    width: 100%;
  }
}
</style>
