<template>
  <div class="hire-me-container">
    <div class="hire-me-content" :class="{ wide: wideArticlesEnabled }">
      <section>
        <h1 id="lets-build-something-great">
          <a class="clickable-header-link" href="#lets-build-something-great">Let's build something great</a>
        </h1>
        <p>
          I am Imad Saddik. I found my passion at the intersection of electrical engineering, programming, and
          astronomy. My journey began in Meknes, Morocco, where I spent five years studying electrical engineering
          before diving into machine learning, AI, and web development. I love solving problems, building applications,
          and sharing what I learn with others.
        </p>
        <p>
          I believe that great things happen when people work together. I am looking for opportunities to collaborate
          and bring my engineering mindset to your team.
        </p>
        <ImageWithCaption
          :image-src="heartShapedAntennaGalaxies"
          image-alt="Heart shaped antenna galaxies"
          image-caption="A photo of the heart shaped antenna galaxies. <a href='https://esahubble.org/images/heic0812c/' target='_blank'>Credit: Robert Gendler</a>"
          @open-image-modal="handleOpenImageModal"
        />
      </section>

      <section>
        <h2 id="services" data-table-of-contents>
          <a class="clickable-header-link" href="#services">Services</a>
        </h2>
        <p>Here is how I can help you build your next project:</p>

        <div class="card-group">
          <div class="card">
            <i class="fa-solid fa-pen-nib service-icon" aria-hidden="true"></i>
            <h3 id="technical-writing" data-table-of-contents>
              <a class="clickable-header-link" href="#technical-writing">Technical writing</a>
            </h3>
            <p>
              I create educational content on complex topics. I have written courses for freeCodeCamp on Elasticsearch,
              LLMs, and Transformers. I also run a YouTube channel called 3CodeCamp where I teach programming and Linux.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-code service-icon" aria-hidden="true"></i>
            <h3 id="software-development" data-table-of-contents>
              <a class="clickable-header-link" href="#software-development">Software development</a>
            </h3>
            <p>
              I build full stack web applications using Vue.js and Python and mobile apps with Java. I enjoy creating
              useful tools.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-database service-icon" aria-hidden="true"></i>
            <h3 id="data-science" data-table-of-contents>
              <a class="clickable-header-link" href="#data-science">Data science</a>
            </h3>
            <p>
              I hold an engineering degree in Industrial Engineering, AI, and Data Science. I built an award-winning
              solar energy prediction model using machine learning during my time at a research lab in France.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-headset service-icon" aria-hidden="true"></i>
            <h3 id="support-maintenance" data-table-of-contents>
              <a class="clickable-header-link" href="#support-maintenance">Support & maintenance</a>
            </h3>
            <p>
              I approach software with an engineering mindset. I focus on building reliable systems that work well over
              time. I can help maintain existing projects and ensure they keep running smoothly.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-chalkboard-user service-icon" aria-hidden="true"></i>
            <h3 id="tutorials" data-table-of-contents>
              <a class="clickable-header-link" href="#tutorials">Tutorials</a>
            </h3>
            <p>
              Teaching is a big part of who I am. I started by sharing organized notes with classmates and now I create
              step-by-step tutorials to help people learn new skills in programming and technology.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-magnifying-glass-chart service-icon" aria-hidden="true"></i>
            <h3 id="code-reviews" data-table-of-contents>
              <a class="clickable-header-link" href="#code-reviews">Code reviews</a>
            </h3>
            <p>
              I believe in the power of open source and clean code. I can review your codebase to identify issues and
              suggest improvements, helping you maintain high quality standards.
            </p>
          </div>
        </div>
      </section>

      <section class="get-in-touch-section">
        <h2 id="get-in-touch" data-table-of-contents>
          <a class="clickable-header-link" href="#get-in-touch">Get in touch</a>
        </h2>
        <p>
          I am always open to discussing new projects or just chatting about technology and the universe. You can find
          me on <a href="https://github.com/ImadSaddik" target="_blank" rel="noopener noreferrer">GitHub</a>,
          <a href="https://www.linkedin.com/in/imadsaddik/" target="_blank" rel="noopener noreferrer">LinkedIn</a>, or
          send me an email at <a href="mailto:simad3647@gmail.com">simad3647@gmail.com</a>.
        </p>
        <p>Prefer a quick call? Book a meeting directly with me:</p>
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
import { HIRE_ME_PAGE_VISITED_KEY } from "@/constants.js";

// Utils
import { trackVisitorData } from "@/utils.js";

// Components
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import TableOfContents from "@/components/TableOfContents.vue";

// Images
import heartShapedAntennaGalaxies from "@/assets/heart_shaped_antenna_galaxies.jpeg";

export default {
  name: "HireMe",
  components: {
    ImageWithCaption,
    ImageEnlarger,
    TableOfContents,
  },
  inject: ["wideArticlesEnabled"],
  emits: ["page-visited", "show-toast"],
  data() {
    return {
      heartShapedAntennaGalaxies,

      enlargedImageSrc: "",
      isImageModalVisible: false,
    };
  },
  mounted() {
    document.title = "Hire Imad Saddik";
    this.$emit("page-visited", HIRE_ME_PAGE_VISITED_KEY);
    trackVisitorData(HIRE_ME_PAGE_VISITED_KEY);
  },
  methods: {
    openCalendlyLink() {
      const calendlyWindow = window.open("https://calendly.com/simad3647/30min", "_blank");
      if (!calendlyWindow) {
        this.emitToastEvent({
          type: "error",
          message: "Popup was blocked! Please allow popups for this site to book a meeting.",
        });
      }
    },
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
    openResumeLink() {
      window.open("https://imadsaddik.com/resume", "_blank");
    },
    emitToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped>
p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

h1 {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

h2 {
  font-size: var(--font-size-big-medium);
  margin: var(--gap-md) 0;
}

h3 {
  font-size: var(--font-size-medium);
  margin: var(--gap-sm) 0;
}

.hire-me-container {
  display: flex;
  position: relative;
  width: 100%;
  padding: var(--gap-xl);
  margin-top: var(--gap-xxl);
  box-sizing: border-box;
}

.hire-me-content {
  width: 50%;
  transition: width 0.3s;
}

.hire-me-content.wide {
  width: 75%;
}

.card-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
}

.card-group::before {
  content: "";
  position: absolute;
  top: 0px;
  left: calc(48px / 2);
  bottom: 0px;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--color-primary-transparent) 0%,
    var(--color-primary) 15%,
    var(--color-secondary) 85%,
    var(--color-secondary-transparent) 100%
  );
  opacity: 0.3;
}

.card {
  display: grid;
  align-items: start;
  grid-template-columns: 48px 1fr;
  gap: 0 var(--gap-md);
  border: none;
  background: transparent;
}

.card p {
  grid-column: 2;
  grid-row: 2;
}
.card h3 {
  align-self: center;
  grid-column: 2;
  grid-row: 1;
  margin: 0;
}

.service-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 1;
  grid-row: 1 / span 2;
  width: 48px;
  height: 48px;
  color: var(--color-primary);
  border: 2px solid var(--color-tag-border);
  font-size: 1.2rem;
  background: var(--color-background);
  transition: all 0.3s ease;
  z-index: 1;
}

.card:hover .service-icon {
  color: var(--color-secondary);
  border-color: var(--color-secondary);
  box-shadow:
    0 0 15px rgba(34, 211, 238, 0.4),
    0 0 0 4px var(--color-background);
}

.get-in-touch-section {
  text-align: left;
  border: 1px solid var(--color-tag-border);
  margin-top: var(--gap-xxl);
  padding: var(--gap-xxl) var(--gap-xl);
  background: rgba(255, 255, 255, 0.02);
}

.get-in-touch-section h2 {
  margin-top: 0;
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
  .hire-me-content {
    width: 70%;
  }
}

@media screen and (max-width: 1100px) {
  .hire-me-content {
    width: 100%;
  }

  .hire-me-container h1 {
    font-size: var(--font-size-big-medium);
  }

  .hire-me-container h2 {
    font-size: var(--font-size-medium);
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
