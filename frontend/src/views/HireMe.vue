<template>
  <div class="hire-me-container">
    <div class="hire-me-content">
      <section>
        <h1 id="lets-build-something-great">
          <a class="clickable-header-link" href="#lets-build-something-great">Let's build something great</a>
        </h1>
        <p>
          I'm an engineer and technical educator with experience in <b>web & mobile development</b> and
          <b>AI & Data Science</b>. I help individuals and organizations achieve their goals through high-quality
          solutions and knowledge sharing. I'm seeking new opportunities — full-time or part-time — to work on exciting
          projects and collaborate with others who share my interests.
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
        <p>I offer a range of services to help you achieve your goals:</p>

        <div class="card-group">
          <div class="card">
            <i class="fa-solid fa-pen-nib service-icon"></i>
            <h3 id="technical-writing" data-table-of-contents>
              <a class="clickable-header-link" href="#technical-writing">Technical writing</a>
            </h3>
            <p>
              I enjoy explaining complex topics in a clear and concise manner through writing. I can write articles,
              tutorials, and documentation on a variety of technical subjects.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-code service-icon"></i>
            <h3 id="software-development" data-table-of-contents>
              <a class="clickable-header-link" href="#software-development">Software development</a>
            </h3>
            <p>
              I can build full stack web applications with your preferred tech stack and native Android applications. I
              write clean, maintainable code and follow best practices.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-database service-icon"></i>
            <h3 id="data-science" data-table-of-contents>
              <a class="clickable-header-link" href="#data-science">Data Science</a>
            </h3>
            <p>
              I analyze data, build predictive models, and create data-driven solutions using Python. I can help you
              extract insights and make informed decisions from your data.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-headset service-icon"></i>
            <h3 id="support-maintenance" data-table-of-contents>
              <a class="clickable-header-link" href="#support-maintenance">Support & maintenance</a>
            </h3>
            <p>
              I provide ongoing support and maintenance for your software solutions. I can help you troubleshoot issues,
              implement updates, and make sure that your applications run smoothly.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-chalkboard-user service-icon"></i>
            <h3 id="tutorials" data-table-of-contents>
              <a class="clickable-header-link" href="#tutorials">Tutorials</a>
            </h3>
            <p>
              I create step-by-step tutorials to help teach people new skills. I create tutorials on everything related
              to programming, AI, and Linux.
            </p>
          </div>
          <div class="card">
            <i class="fa-solid fa-magnifying-glass-chart service-icon"></i>
            <h3 id="code-reviews" data-table-of-contents>
              <a class="clickable-header-link" href="#code-reviews">Code reviews</a>
            </h3>
            <p>
              I provide detailed code reviews to help improve the quality of your codebase. I can identify potential
              issues, suggest improvements, and help you follow best practices.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="get-in-touch" data-table-of-contents>
          <a class="clickable-header-link" href="#get-in-touch">Get in touch</a>
        </h2>
        <p>
          If you're interested in working together or have any questions, please don't hesitate to reach out. You can
          contact me via email at <a href="mailto:simad3647@gmail.com">simad3647@gmail.com</a>.
        </p>
        <p>Prefer a quick call? Book a meeting directly with me:</p>
        <button class="primary-button book-meeting-button" @click="openCalendlyLink">Book a meeting</button>
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

// Components
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import TableOfContents from "@/components/TableOfContents.vue";

// Images
import heartShapedAntennaGalaxies from "@/assets/heart_shaped_antenna_galaxies.jpeg";

export default {
  name: "HireMe",
  emits: ["page-visited", "show-toast"],
  components: {
    ImageWithCaption,
    ImageEnlarger,
    TableOfContents,
  },
  mounted() {
    document.title = "Hire Imad Saddik";
    this.$emit("page-visited", HIRE_ME_PAGE_VISITED_KEY);
  },
  data() {
    return {
      heartShapedAntennaGalaxies,

      enlargedImageSrc: "",
      isImageModalVisible: false,
    };
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
}

.card-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-md);
}

.card {
  background-color: var(--color-code-night-owl-background);
  border: 1px solid var(--color-tag-border);
  padding: var(--gap-md);
}

.service-icon {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: var(--gap-xxl);
  display: block;
}

.book-meeting-button {
  padding: var(--gap-sm) var(--gap-md);
  font-size: var(--font-size-small);
  font-weight: 600;
  width: 200px;
}

@media screen and (max-width: 1300px) {
  .hire-me-content {
    width: 65%;
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
  }

  .card-group {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--gap-md);
  }
}

@media screen and (max-width: 768px) {
  .hire-me-container {
    padding: var(--gap-md);
  }
}
</style>
