<template>
  <ArticleLayout
    ref="articleContent"
    title="How to remove hidden data from Inkscape files to reduce the file size"
    sub-title="A simple guide to removing invisible data from embedded images to keep your Inkscape projects lightweight."
    creation-date="December 21, 2025"
    article-type="blog-post"
    :article-tags="tags"
    :cover-image="coverImage"
    :reading-time="readingTime"
    :slug="slug"
    :markdown-content="markdownContent"
    @show-toast="handleShowToastEvent"
  >
    <section>
      <h2 id="introduction" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#introduction">Introduction</a>
      </h2>
      <p>
        I recently ran into an issue where an Inkscape file I kept reusing grew from just 12KB to over 12MB. The problem
        was that embedded images remained hidden in the file even after I had deleted them from the canvas.
      </p>
      <p>This guide will show you a simple fix to remove this invisible data to keep your files small.</p>
    </section>

    <section>
      <h2 id="the-problem" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#the-problem">The problem</a>
      </h2>
      <p>
        This issue often happens when working with <b>embedded</b>
        <a href="https://en.wikipedia.org/wiki/Raster_graphics" target="_blank"> raster images</a> (like PNGs or JPEGs).
        When you delete an image from the canvas, Inkscape doesn't always remove the image's data from the SVG file
        itself.
      </p>
      <p>
        You won't see the deleted image on your canvas or even in the <InlineCode text="Layers and Objects" /> panel,
        but the data remains hidden in the file's code, keeping the size unnecessarily large.
      </p>

      <ImageWithCaption
        :image-src="layersPanel"
        image-alt="The Layers and Objects panel in Inkscape not showing the hidden images."
        image-caption="The <b>Layers and Objects</b> panel is not showing the images."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        If you open the SVG file in a text editor, you will find the image data still there. It is encoded in a format
        called <a href="https://en.wikipedia.org/wiki/Base64" target="_blank">base64</a> and looks something like this:
      </p>
      <p><InlineCode text="data:image/png;base64,iVBORw0KGgoAAAANS..." /></p>

      <div>
        <h3 id="replicate-the-issue" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#replicate-the-issue">Replicate the issue</a>
        </h3>
        <p>
          First, drag a large raster image into your Inkscape document and select <InlineCode text="Embed" /> and
          <InlineCode text="Default import resolution" />.
        </p>

        <ImageWithCaption
          :image-src="importDialog"
          image-alt="The Inkscape image import dialog with Embed selected."
          image-caption="The image import dialog."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Add another rectangle and try clipping the image using the shape builder tool. Select both the rectangle and
          the image, then press <InlineCode text="X" /> or click the tool directly. Choose the part of the image you
          want to keep, and click the <InlineCode text="Accept" /> button to confirm.
        </p>

        <ImageWithCaption
          :image-src="shapeBuilder"
          image-alt="Using the shape builder tool to clip an image in Inkscape."
          image-caption="Use the shape builder tool to clip the image."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Now, save the file and close Inkscape. Check the file size, you should notice it has increased because we
          added a new image. In my case, it went from 12 MB to 17.5 MB.
        </p>
        <p>
          Next, open the document again in Inkscape, delete the image, and save the file. Close or minimize Inkscape and
          check the file size once more. It didn't change, right? That's the problem, the file is still 17.5 MB because
          Inkscape keeps storing images that are no longer in use.
        </p>
      </div>
    </section>

    <section>
      <h2 id="the-solution" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#the-solution">The solution</a>
      </h2>
      <p>
        Luckily, there is an easy fix to this issue. Click on <InlineCode text="File > Clean Up Document" /> and save
        the file. This option removes any unused elements from your document.
      </p>

      <ImageWithCaption
        :image-src="cleanUpMenu"
        image-alt="The File menu in Inkscape highlighting the Clean Up Document option."
        image-caption="The Clean Up Document option."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Did the file size change? In my case, it shrank to only 12KB. That is a <b>1458x</b> reduction.</p>
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        As you've seen, the <InlineCode text="Clean Up Document" /> feature removes unused data, such as deleted raster
        images, that can make your files unnecessarily large.
      </p>
      <p>I hope this guide helps you keep your Inkscape projects clean.</p>
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
import { calculateReadingTime } from "@/utils";

// Images
import coverImage from "./coverImage.svg";
import layersPanel from "./layers_panel_hidden_images.png";
import importDialog from "./image_import_dialog.jpg";
import shapeBuilder from "./shape_builder_clipping.jpg";
import cleanUpMenu from "./clean_up_document_menu.jpg";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";

export default {
  name: "InkscapeCleanUpDocument",
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
  },
  emits: ["show-toast", "article-read"],
  data() {
    return {
      tags: ["Inkscape", "SVG", "Optimization"],
      readingTime: 0,
      markdownContent,
      enlargedImageSrc: "",
      isImageModalVisible: false,

      coverImage,
      layersPanel,
      importDialog,
      shapeBuilder,
      cleanUpMenu,
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  mounted() {
    document.title = "How to remove hidden data from Inkscape files";
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
