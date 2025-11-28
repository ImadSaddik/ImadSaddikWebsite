<template>
  <ArticleLayout
    ref="articleContent"
    title="How to make star trails and time-lapses with Python"
    sub-title="A guide to creating star trail images and time-lapse videos on any platform using Python."
    creation-date="October 24, 2025"
    article-type="astronomy-post"
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
        I created <InlineCode text="PyStarTrails" /> because I needed a simple tool to make star trail images and
        time-lapse videos on Linux. In this article, I'll show you how to create your own using Python, which works on
        any platform.
      </p>
      <p>
        You will learn the basics of how to <b>blend photos</b> together to create a beautiful star trail image. I will
        also show you how to add cool effects like <b>comet trails</b> and <b>fades</b>. Finally, we'll use the same
        code to turn all those images into a time-lapse video, like the one below.
      </p>

      <VideoWithCaption :video-src="timelapse60Fps" video-caption="Time-lapse generated from 408 images at 60 FPS." />

      <p>
        The source code for this project is available on
        <a href="https://github.com/ImadSaddik/PyStarTrails" target="_blank">GitHub</a>.
      </p>
    </section>

    <section>
      <h2 id="creating-your-first-star-trail-image" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#creating-your-first-star-trail-image"
          >Creating your first star trail image</a
        >
      </h2>

      <div>
        <h3 id="how-it-works" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#how-it-works">How it works</a>
        </h3>

        <p>
          You've captured hundreds of photos, and now it's time to blend them together to create your first star trail
          image. Each photo can be thought of as having two parts: the stars and the background.
        </p>
        <p>
          The background remains still, while the stars appear to move from frame to frame due to Earth's rotation. Our
          goal is to keep the background consistent while revealing the stars' motion across the sky.
        </p>
        <p>
          To do this, we gradually blend the images together to trace the path of each star. The pixels representing the
          background are mostly dark, while the ones representing the stars are bright.
        </p>
        <p>
          We use the
          <a href="https://en.wikipedia.org/wiki/Blend_modes#Lighten_Only" target="_blank">lighten blending mode</a> for
          this process, it takes the brighter value between a pixel in one image and the corresponding pixel in the
          next. This simple rule creates the illusion of continuous trails.
        </p>
        <p>
          If you can't quite visualize it yet, don't worry, I've included some illustrations to show exactly how this
          blending algorithm works.
        </p>
        <p>
          To demonstrate how the <InlineCode text="lighten blending mode" /> works, I created five small
          <InlineCode text="8x8" /> images. Each cell is colored either black (background) or white (stars).
        </p>
        <p>
          In the white cells, I've placed the number <InlineCode text="1" />, which represents full brightness. In
          practice, each pixel in an
          <a href="https://en.wikipedia.org/wiki/8-bit_color" target="_blank">8-bit image</a> stores a value between
          <InlineCode text="0" /> and <InlineCode text="255" />, where <InlineCode text="255" /> corresponds to the
          maximum brightness. So, in this simplified example, <InlineCode text="1" /> stands for
          <InlineCode text="255" />.
        </p>
        <p>
          The black cells correspond to a brightness value of <InlineCode text="0" />. For clarity, they are left empty
          in the diagram because they are greater in number than the white cells.
        </p>

        <ImageWithCaption
          :image-src="fiveFramesArrangedChronologically"
          image-alt="A diagram showing five 8x8 grids, with 'stars' (white cells) moving diagonally."
          image-caption="A sequence of five 8x8 grids arranged in chronological order."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          In the first image, there are three stars. From one frame to the next, each star moves one pixel to the right
          and one pixel down. By the final frame, only one star remains visible, as the other two have moved outside the
          <InlineCode text="8x8" /> grid.
        </p>
        <p>
          Now, let's apply the <InlineCode text="lighten blending mode" /> to the first two images. In the illustration,
          you'll see them represented as inputs to the <InlineCode text="max()" /> function. This function compares the
          pixel values from both images and keeps the brighter one for each position. The resulting image is a blend of
          the two, showing all the stars that were visible in either frame.
        </p>

        <ImageWithCaption
          :image-src="basicBlendingStep1"
          image-alt="A diagram showing the max() function combining the first two 8x8 grids."
          image-caption="Blending the first two images with the max function."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          The blended image becomes the new input for the next iteration of the <InlineCode text="max()" /> function.
          The third image is then used as the second argument. Blend these two together, and repeat the process with the
          remaining images until you reach the fifth one.
        </p>
        <p>
          The final blended result is your complete star trail image, showing the continuous paths traced by the stars
          over time.
        </p>

        <ImageWithCaption
          :image-src="basicBlendingStepN"
          image-alt="A diagram showing the iterative blending process using the max() function across all five grids."
          image-caption="Iteratively applying the max function to combine the brightest pixels from each frame."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h3 id="putting-it-into-practice" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#putting-it-into-practice">Putting it into practice</a>
        </h3>

        <p>Before running the script, make sure you have the necessary libraries installed:</p>
        <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToastEvent" />

        <p>
          The following Python script implements the <InlineCode text="lighten blending mode" /> algorithm. Make sure
          your input images are stored in the <InlineCode text="/images/stacking_input" /> directory and are in either
          <InlineCode text="JPG" /> or <InlineCode text="PNG" /> format.
        </p>
        <CodeBlock :code="pythonCodeSnippet1" language="python" @show-toast="handleShowToastEvent" />

        <p>
          The code begins by reading all images from the <InlineCode text="stacking_input" /> directory inside the
          <InlineCode text="images" /> folder.
        </p>
        <p>It then loops through the images one by one:</p>
        <BulletPoint
          >In the first iteration, the first image is simply stored in <InlineCode text="stacked_array" />, since
          there's nothing to blend with yet.</BulletPoint
        >
        <BulletPoint
          >In the second iteration, the next image is blended with the previous one stored in
          <InlineCode text="stacked_array" />. The blending is done using <InlineCode text="np.maximum" />, which
          performs the lighten operation <b>element by element</b>. In other words, it works
          <b>pixel by pixel</b>.</BulletPoint
        >
        <BulletPoint>
          After blending, the result replaces <InlineCode text="stacked_array" />, and the process continues until all
          images have been processed.
        </BulletPoint>

        <p>Finally, the script saves the resulting star trail image to the <InlineCode text="output" /> directory.</p>
        <ImageWithCaption
          :image-src="basicBlendingFinalImage"
          image-alt="A star trail image showing circular paths of stars around a central point."
          image-caption="The star trail image that the Python script produced."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2 id="stylizing-your-star-trails" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#stylizing-your-star-trails">Stylizing your star trails</a>
      </h2>

      <div>
        <h3 id="creating-a-comet-effect" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#creating-a-comet-effect">Creating a comet effect</a>
        </h3>

        <p>
          Comets are fascinating objects, they shine with a bright core followed by a long, glowing tail that gradually
          fades out. We can apply a similar look to our star trails by slightly modifying the way we blend the images.
        </p>
        <p>
          With this technique, each star will leave behind a fading trail instead of a continuous, fully bright line.
        </p>

        <ImageWithCaption
          :image-src="realCometImage"
          image-alt="A real photograph of a comet with a long tail during moonrise."
          image-caption="Comet at moonrise by <a href='https://www.instagram.com/gabriel_zaparolli/' target='_blank'>Gabriel Zaparolli</a>."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          To create this effect, we introduce a <InlineCode text="decay factor" /> that gradually reduces the brightness
          of the stars over time. The decay factor controls how long the comet-like tail appears: values close to
          <InlineCode text="1.0" /> produce longer trails, while values below <InlineCode text="0.95" /> make the trails
          fade much more quickly.
        </p>
        <p>
          The total number of frames also has a strong impact on trail length. Below is a comparison of two results
          created using the same sequence of images, but with different decay factors:
        </p>

        <ImageWithCaption
          :image-src="decayFactorComparison"
          image-alt="A side-by-side comparison of star trails with a 0.99 decay (long trails) vs 0.95 decay (short trails)."
          image-caption="<b>Left:</b> decay factor = 0.99. <b>Right:</b> decay factor = 0.95."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          As you can see, the difference is significant. With a decay factor of <InlineCode text="0.99" />, the star
          trails remain visible for much longer than with <InlineCode text="0.95" />.
        </p>
        <p>
          This example uses a stack of <InlineCode text="408" /> images. If we take a pixel with initial brightness
          <InlineCode text="1" /> and apply the decay factor repeatedly, we can see just how quickly the light fades:
        </p>

        <BulletPoint>1 * 0.99<SuperscriptText text="407" /> = 0.01673108868</BulletPoint>
        <BulletPoint>1 * 0.95<SuperscriptText text="407" /> = 0.00000000086</BulletPoint>

        <p>
          With a decay factor of <InlineCode text="0.95" />, the pixel brightness becomes very small, and would be even
          dimmer if we collected more images. This is why choosing the right decay factor is important for control of
          your star trails.
        </p>
        <p>
          To apply the comet effect, we introduce the <InlineCode text="decay factor" /> into the
          <InlineCode text="max()" /> blending operation. In each iteration, we slightly dim the previously blended
          image before comparing it with the next frame.
        </p>

        <ImageWithCaption
          :image-src="cometBlendingStep1"
          image-alt="A diagram showing the blending step with a decay factor applied to the first image."
          image-caption="Applying the decay factor during the first blending step."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          On the next iteration, the updated blended image is multiplied by the <InlineCode text="decay factor" />
          again, then compared with the next input image. This process repeats for every frame in the sequence.
        </p>

        <ImageWithCaption
          :image-src="cometBlendingStepN"
          image-alt="A diagram showing the iterative blending process with the decay factor."
          image-caption="Each new frame adds a bright star position, while older ones gradually fade."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Here is the modified code that applies the comet effect. We introduce a new variable,
          <InlineCode text="decay_factor" />, and apply it to the previously blended image before combining it with the
          next frame using <InlineCode text="np.maximum" />:
        </p>

        <CodeBlock :code="pythonCodeSnippet2" language="python" @show-toast="handleShowToastEvent" />

        <p>Here is the resulting comet-style star trail image:</p>

        <ImageWithCaption
          :image-src="cometStyleResult"
          image-alt="A star trail image where the trails look like comet tails, fading out."
          image-caption="Star trails with comet effect applied (decay_factor = 0.99)."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h3 id="adding-a-fade-in-and-fade-out" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#adding-a-fade-in-and-fade-out">Adding a fade in and fade out</a>
        </h3>

        <p>
          The fade-in and fade-out effect creates star trails that gradually brighten toward the middle of the sequence,
          then fade again toward the end. This keeps the central portion of each trail bright while softening both the
          beginning and the end.
        </p>
        <p>To apply this effect, count the total number of images and determine the midpoint.</p>

        <BulletPoint
          >Frames <b>before</b> the midpoint are gradually brightened, this is the fade-in phase.</BulletPoint
        >
        <BulletPoint>Frames <b>after</b> the midpoint are gradually dimmed, the fade-out phase.</BulletPoint>

        <ImageWithCaption
          :image-src="fadeInOutPhases"
          image-alt="A diagram showing an image sequence with fade-in, midpoint, and fade-out phases."
          image-caption="Image sequence showing the fade-in, midpoint, and fade-out phases."
          @open-image-modal="handleOpenImageModal"
        />

        <p>Here is the updated code that applies the fade-in and fade-out effect. We introduce two new variables:</p>
        <BulletPoint><InlineCode text="mid_point" /> determines the center frame in the sequence.</BulletPoint>
        <BulletPoint
          ><InlineCode text="brightness" /> controls how bright each frame appears based on its position.</BulletPoint
        >

        <ImageWithCaption
          :image-src="fadeInOutPhasesBrightness"
          image-alt="A diagram showing an image sequence with fade-in, midpoint, and fade-out phases. Each frame is labeled with its brightness value."
          image-caption="Multiplying each frame by the brightness value for its position."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          Unlike the comet effect, we do not apply the <InlineCode text="brightness" /> factor to the blended image.
          Instead, we multiply it directly with each current image, because the brightness must depend on that frame's
          position in the sequence (how far it is from the midpoint).
        </p>

        <CodeBlock :code="pythonCodeSnippet3" language="python" @show-toast="handleShowToastEvent" />

        <p>Here is the resulting star trail image with the fade-in and fade-out effect:</p>

        <ImageWithCaption
          :image-src="fadeInOutResult"
          image-alt="A star trail image where the trails fade in at the start and fade out at the end."
          image-caption="Star trails with a fade-in / fade-out brightness effect."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2 id="creating-a-star-trail-time-lapse" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#creating-a-star-trail-time-lapse">Creating a star trail time-lapse</a>
      </h2>

      <p>
        Instead of generating just a single star trail image, you can use the same stacking process to create a
        time-lapse video. The idea is simple: while stacking the images, we save each intermediate blended frame. These
        saved frames can later be combined into a video.
      </p>
      <p>
        In fact, the final star trail image you produced earlier is the last frame in this progression. By capturing
        every step along the way, you can watch the star trails grow and stretch across the sky over time.
      </p>
      <p>
        Here's the Python script that does exactly that. It progressively blends each image with the previous result and
        saves every blended frame to the <InlineCode text="output" /> directory. You can also apply different blending
        styles (like the comet or fade-in/fade-out effects) by modifying the logic inside the loop.
      </p>

      <CodeBlock :code="pythonCodeSnippet4" language="python" @show-toast="handleShowToastEvent" />

      <p>Before running the script, make sure to install <InlineCode text="imageio" />:</p>
      <CodeBlock :code="bashCodeSnippet2" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Once you've generated the intermediate blended frames, the next step is to turn them into a time-lapse video.
        The script below will read each frame you created and combine them into a video using
        <InlineCode text="imageio" />. You can control the duration of the video by adjusting the
        <InlineCode text="fps" /> variable (frames per second).
      </p>
      <CodeBlock :code="pythonCodeSnippet5" language="python" @show-toast="handleShowToastEvent" />
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>

      <p>In this article, you learned how to create your own star trail images and time-lapses with Python.</p>
      <p>
        We covered the theory of how blending works using the <InlineCode text="lighten mode" />. We turned that theory
        into a practical Python script using <InlineCode text="numpy.maximum" />. You also saw how easy it is to adjust
        that script to create stylized images with comet or fade effects.
      </p>
      <p>
        By saving each blended frame, we were able to build a smooth time-lapse that shows the stars moving across the
        sky. I hope this helps you create your own amazing images.
      </p>
      <p>
        All the code we used is available in
        <a href="https://github.com/ImadSaddik/PyStarTrails" target="_blank">this GitHub repository</a>.
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
import * as codeSnippets from "./codeSnippets.js";
import markdownContent from "./content.md";
import { calculateReadingTime } from "@/utils.js";

// Images
import coverImage from "./coverImage.svg";
import timelapse60Fps from "./timelapse_60_fps.mp4";
import fiveFramesArrangedChronologically from "./five_frames_arranged_chronologically.svg";
import basicBlendingStep1 from "./basic_blending_step_1.svg";
import basicBlendingStepN from "./basic_blending_step_n.svg";
import basicBlendingFinalImage from "./basic_blending_final_image.jpg";
import realCometImage from "./real_comet_image.jpg";
import decayFactorComparison from "./decay_factor_comparison.jpg";
import cometBlendingStep1 from "./comet_blending_step_1.svg";
import cometBlendingStepN from "./comet_blending_step_n.svg";
import cometStyleResult from "./comet_style_final_image.jpg";
import fadeInOutPhases from "./fade_in_fade_out_phases.svg";
import fadeInOutPhasesBrightness from "./fade_in_fade_out_phases_brightness.svg";
import fadeInOutResult from "./fade_in_fade_out_final_image.jpg";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";
import BulletPoint from "@/components/BulletPoint.vue";
import CodeBlock from "@/components/CodeBlock.vue";
import VideoWithCaption from "@/components/VideoWithCaption.vue";
import SuperscriptText from "@/components/SuperscriptText.vue";

export default {
  name: "PythonStarTrails",
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
    BulletPoint,
    CodeBlock,
    VideoWithCaption,
    SuperscriptText,
  },
  emits: ["show-toast", "article-read"],
  data() {
    return {
      ...codeSnippets,

      tags: ["Python", "Astrophotography", "Image processing", "Timelapse", "Star trails"],
      readingTime: 0,
      markdownContent,
      enlargedImageSrc: "",
      isImageModalVisible: false,

      coverImage,
      timelapse60Fps,
      fiveFramesArrangedChronologically,
      basicBlendingStep1,
      basicBlendingStepN,
      basicBlendingFinalImage,
      realCometImage,
      decayFactorComparison,
      cometBlendingStep1,
      cometBlendingStepN,
      cometStyleResult,
      fadeInOutPhases,
      fadeInOutPhasesBrightness,
      fadeInOutResult,
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  mounted() {
    document.title = "How to make star trails and time-lapses with Python";
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
