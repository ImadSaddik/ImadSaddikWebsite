<template>
  <ArticleLayout
    :title="title"
    sub-title="A simple guide to warping designs to fit angled or curved surfaces for realistic mockups."
    creation-date="January 31, 2026"
    :article-type="ARTICLE_TYPES.BLOG"
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
        Recently, I wanted to place a logo on a 3D server design, but I ran into a problem. When I pasted the logo on
        top, it looked flat and fake because it didn't align with the perspective of the surface.
      </p>
      <p>This guide will show you two ways to fix this: one for flat text and one for curved surfaces.</p>
      <YouTubePlayer video-url="https://www.youtube.com/embed/pFrnlXTtLZU" />
    </section>

    <section>
      <h2 id="the-problem" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#the-problem">The problem</a>
      </h2>
      <p>
        When you place a flat 2D design onto a picture of a 3D object, it doesn't account for the perspective. It looks
        like something floating on top rather than an integrated part of the object.
      </p>
      <p>
        To fix this, you need to warp your design. However, Inkscape has different tools for this: the
        <b>Perspective</b> extension and the <b>Envelope Deformation</b> path effect.
      </p>

      <ImageWithCaption
        :image-src="flatLogo"
        image-alt="Flat logo and text do not match the top surface"
        image-caption="The flat logo and text do not match the top surface."
        @open-image-modal="handleOpenImageModal"
      />
    </section>

    <section>
      <h2 id="the-solution" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#the-solution">The solution</a>
      </h2>
      <p>
        Before starting, there is one critical rule: These tools only work on <b>Paths</b>. They won't work on editable
        text or standard imported images.
      </p>
      <div>
        <BulletPoint>
          <b>For text:</b> Select it and press <InlineCode text="Shift + Ctrl + C" /> to convert it to a path or go to
          <InlineCode text="Path > Object to Path" />.
        </BulletPoint>
        <BulletPoint>
          <b>For images:</b> You must trace them first using <InlineCode text="Path > Trace Bitmap" />.
        </BulletPoint>
      </div>

      <h3 id="the-perspective-extension" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#the-perspective-extension">The Perspective extension</a>
      </h3>
      <p>
        This method works best on flat, angled surfaces like a wall or a book cover. Draw a shape that matches the
        surface you want to place your text or logo on.
      </p>

      <AdmonitionBlock title="Note" type="info">
        <p>
          When drawing the shape, start at the bottom-left corner and move clockwise. This ensures the text orientation
          remains correct.
        </p>
        <p>However, the drawing order does not matter for logos.</p>
      </AdmonitionBlock>

      <ImageWithCaption
        :image-src="drawShape"
        image-alt="Draw a shape matching the surface"
        image-caption="Draw a shape matching the surface."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Make sure your text is on top of the shape in the layer order. You can check this in the
        <InlineCode text="Layers" /> panel (<InlineCode text="Shift + Ctrl + L" />). After that, select your text path
        first, hold <InlineCode text="Shift" />, and select the target shape second.
      </p>

      <AdmonitionBlock title="Warning" type="warning">
        <p>Make sure that both objects are paths. If they are not, the extension will not work correctly.</p>
      </AdmonitionBlock>

      <p>Go to <InlineCode text="Extensions > Modify Path > Perspective" />.</p>
      <p>Inkscape will snap the four corners of your text to the corners of the shape.</p>

      <ImageWithCaption
        :image-src="usingPerspective"
        image-alt="Using the Perspective extension"
        image-caption="The text snaps perfectly when drawn clockwise from bottom left (left), but fails with incorrect drawing direction (right)."
        @open-image-modal="handleOpenImageModal"
      />

      <p>As you can see, the text matches the surface angle perfectly, provided it was drawn correctly.</p>

      <h3 id="envelope-deformation" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#envelope-deformation">Envelope Deformation</a>
      </h3>
      <p>
        The Perspective extension falls short on curved surfaces because it creates a linear distortion between corners.
        For a curved roof or a bottle, you need <b>Envelope Deformation</b>.
      </p>

      <ImageWithCaption
        :image-src="perspectiveFails"
        image-alt="Perspective extension fails on curved surfaces"
        image-caption="The Perspective extension distorts text poorly on curved surfaces because it only maps to the four corners."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Select your logo path and open the <InlineCode text="Path Effects" /> panel by pressing
        <InlineCode text="Ctrl + &" />. Click the arrow icon and search for "Envelope Deformation".
      </p>

      <ImageWithCaption
        :image-src="addingEnvelope"
        image-alt="Adding Envelope Deformation"
        image-caption="Select Envelope Deformation from the Path Effects panel."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Draw a shape that matches the curved surface you want to place your logo on. This shape will act as a guide for
        warping. Center the logo over this shape.
      </p>

      <ImageWithCaption
        :image-src="drawCurvedShape"
        image-alt="Draw a shape matching the curved surface"
        image-caption="Draw a shape matching the curved surface."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Select the logo and make sure that it is on top of the guide shape in the layer order. In the Path Effects
        panel, you will see options for <b>Top bend path</b>, <b>Right bend path</b>, etc.
      </p>
      <p>
        Click the small "Edit on-canvas" <InlineIcon :icon="toolNodeEditorIcon" /> icon next to the
        <b>Top bend path</b> option. You will see a green line appear with two handles.
      </p>

      <ImageWithCaption
        :image-src="editingTopBend"
        image-alt="Editing the top bend path"
        image-caption="Click the 'Edit on-canvas' icon to reveal the green bend line with handles."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Pick one of the green handles and snap it to the corresponding corner of your guide shape. Do the same for the
        other handle.
      </p>

      <ImageWithCaption
        :image-src="aligningTopBend"
        image-alt="Aligning the top bend handles"
        image-caption="Align the top bend handles to the guide shape corners."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Repeat this process for the other sides: <b>Right bend path</b>, <b>Bottom bend path</b>, and
        <b>Left bend path</b>. Each time, click the "Edit on-canvas" <InlineIcon :icon="toolNodeEditorIcon" /> icon and
        snap the handles to the corners of your guide shape.
      </p>

      <ImageWithCaption
        :image-src="aligningAllBend"
        image-alt="Aligning all bend handles"
        image-caption="Align all bend handles to the guide shape corners."
        @open-image-modal="handleOpenImageModal"
      />

      <AdmonitionBlock title="Important" type="warning">
        <p>
          This tool creates a "live" effect. To make the shape permanent, select your finished object and go to
          <InlineCode text="Path > Object to Path" />.
        </p>
      </AdmonitionBlock>
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>You now have two powerful techniques to make your designs fit perfectly onto 3D objects:</p>
      <div>
        <BulletPoint><b>Perspective</b> for flat, angled surfaces like walls and book covers</BulletPoint>
        <BulletPoint
          ><b>Envelope Deformation</b> for curved surfaces like bottles, spheres, and rounded objects</BulletPoint
        >
      </div>
      <p>
        With these tools, your logos and text will sit naturally within the 3D space rather than floating on top.
        Remember to convert your text and images to paths first, and always finalize your work with
        <InlineCode text="Path > Object to Path" /> to lock in your effects.
      </p>
      <p>Happy designing!</p>
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
import flatLogo from "./1_flat_logo_does_not_match_the_top_surface.svg";
import drawShape from "./2_draw_shape_matching_surface.svg";
import usingPerspective from "./3_using_perspective_extension.svg";
import perspectiveFails from "./4_perspective_fails_on_circle.svg";
import addingEnvelope from "./5_adding_envelope_deformation.svg";
import drawCurvedShape from "./6_draw_shape_matching_curved_surface.svg";
import editingTopBend from "./7_editing_top_bend_path.svg";
import aligningTopBend from "./8_aligning_top_bend_handles.svg";
import aligningAllBend from "./9_aligning_all_bend_handles.svg";
import toolNodeEditorIcon from "@/assets/icons/tool_node_editor.svg";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";
import InlineIcon from "@/components/InlineIcon.vue";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";
import BulletPoint from "@/components/BulletPoint.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";
import { useArticleContent } from "@/composables/useArticleContent.js";

export default {
  name: "HowToWarpAndAngleYourDesignsInInkscape",
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
    InlineIcon,
    AdmonitionBlock,
    BulletPoint,
    YouTubePlayer,
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "How to place text and logos in perspective in Inkscape";

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
      tags: ["Inkscape", "Design", "SVG", "Perspective"],
      markdownContent,

      // Images
      coverImage,
      flatLogo,
      drawShape,
      usingPerspective,
      perspectiveFails,
      addingEnvelope,
      drawCurvedShape,
      editingTopBend,
      aligningTopBend,
      aligningAllBend,
      toolNodeEditorIcon,

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
