<template>
  <ArticleLayout
    :title="title"
    sub-title="This quick guide will help you find the health of your laptop battery using the terminal."
    creation-date="February 14, 2026"
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
        If you've been using your laptop for quite a while, you might notice that you can't work away from the charger
        for as long as before. When the battery drains faster than before, it is important to understand why.
      </p>

      <p>Prefer video? Watch the video tutorial:</p>
      <YouTubePlayer video-url="https://www.youtube.com/embed/RjornIF4JBw" />

      <p>
        Batteries are chemical devices, and they
        <a href="https://en.wikipedia.org/wiki/Capacity_loss" target="_blank">degrade over time</a>. A battery that held
        a 4-hour charge when it was new might only hold a 2-hour charge after a few years.
      </p>
      <p>
        To understand your battery's health, you should check its real numbers: specifically, the original design
        capacity compared to what it can actually hold today.
      </p>
      <p>
        In this article, you will learn how to use a simple command-line tool to find this information on your Linux
        system.
      </p>
    </section>

    <section>
      <h2 id="finding-the-battery-path" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#finding-the-battery-path">Finding the battery path</a>
      </h2>
      <p>
        First, you need to find out how the system identifies your battery. Linux treats hardware components as file or
        device paths.
      </p>
      <p>
        To list all power-related devices, use the <InlineCode text="upower" /> command with the
        <InlineCode text="-e" /> (enumerate) flag:
      </p>
      <CodeBlock :code="upowerEnumerate" language="bash" @show-toast="handleShowToastEvent" />
      <p>The output will display several paths, similar to these:</p>
      <CodeBlock :code="upowerEnumerateOutput" language="text" @show-toast="handleShowToastEvent" />
      <p>
        Look for the line ending in <InlineCode text="battery_BAT0" />. This is the path to your laptop's physical
        battery.
      </p>
    </section>

    <section>
      <h2 id="getting-the-battery-details" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#getting-the-battery-details">Getting the battery details</a>
      </h2>
      <p>
        Once you have the path, you can ask the system for specific details about that device. Use the
        <InlineCode text="upower" /> command again, but this time with the <InlineCode text="-i" /> (show info) flag
        followed by the path you found in the previous step:
      </p>
      <CodeBlock :code="upowerInfo" language="bash" @show-toast="handleShowToastEvent" />
      <p>This will generate a complete report on the battery status.</p>
      <CodeBlock :code="upowerInfoOutput" language="text" @show-toast="handleShowToastEvent" />
    </section>

    <section>
      <h2 id="analyzing-the-capacity" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#analyzing-the-capacity">Analyzing the capacity</a>
      </h2>
      <p>The output provides a lot of data, but there are three lines that reveal your battery's health:</p>
      <BulletPoint>
        <InlineCode text="energy-full-design (90.001 Wh)" />: This is the capacity the battery had when it left the
        factory. It is the maximum energy it was designed to hold.
      </BulletPoint>
      <BulletPoint>
        <InlineCode text="energy-full (75.901 Wh)" />: This is the maximum energy the battery can hold right now.
      </BulletPoint>
      <BulletPoint> <InlineCode text="capacity (84.3335%)" />: This is the overall battery health. </BulletPoint>
      <p>
        By comparing the "design" energy to the current "full" energy, you can see how much the battery has degraded.
      </p>
      <p>
        In the example above, my battery has lost about <strong>16%</strong> of its original life, sitting at
        <strong>84.33% health</strong>.
      </p>
      <p>
        This explains why a laptop doesn't last as long as it used to. It usually isn't a software issue; it is simply
        the physical hardware aging over time.
      </p>
    </section>

    <section>
      <h2 id="tips-to-prolong-your-battery-life" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#tips-to-prolong-your-battery-life">Tips to prolong your battery life</a>
      </h2>
      <p>
        Now that you know the numbers, you might want to keep them as high as possible. While all batteries degrade
        eventually, you can slow down the process with a few habits:
      </p>
      <BulletPoint>
        <strong>Avoid extreme heat:</strong> High temperatures are the number one enemy of lithium-ion batteries. Make
        sure your laptop vents are not blocked by blankets or dust.
      </BulletPoint>
      <BulletPoint>
        <strong>Don't stay at 100% forever:</strong> Leaving your laptop plugged in at 100% charge for weeks will stress
        the battery. If possible, unplug it occasionally or use software settings to limit the charge threshold to 80%.
      </BulletPoint>
      <BulletPoint>
        <strong>Avoid deep discharges:</strong> Try not to let your battery drop to 0% regularly.
      </BulletPoint>
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        Using <InlineCode text="upower" /> is a fast and direct way to check your hardware without installing heavy
        graphical applications.
      </p>
      <p>
        If your capacity drops below 50% or 60%, it might be time to look for a replacement. If it’s around 80%, it is
        still quite functional, but you should start planning for its eventual decline.
      </p>
      <p>Use these steps to diagnose your own battery life and stay informed about your hardware health.</p>
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

// Images
import coverImage from "./coverImage.svg";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";
import CodeBlock from "@/components/CodeBlock.vue";
import BulletPoint from "@/components/BulletPoint.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";
import { useArticleContent } from "@/composables/useArticleContent.js";

export default {
  name: "HowToCheckBatteryCapacityOnLinux",
  components: {
    ArticleLayout,
    ImageEnlarger,
    InlineCode,
    CodeBlock,
    BulletPoint,
    YouTubePlayer,
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "How to check battery capacity on Linux";

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
      // Code
      ...codeSnippets,

      // Variables
      tags: ["Linux", "Ubuntu", "Battery", "Terminal", "Hardware"],
      markdownContent,

      // Images
      coverImage,

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
