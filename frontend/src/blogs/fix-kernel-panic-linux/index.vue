<template>
  <ArticleLayout
    ref="articleContent"
    title="How to fix the kernel panic problem after installing a new version of the kernel"
    sub-title="A step-by-step guide to recovering your Linux system from a broken kernel update using GRUB."
    creation-date="December 20, 2025"
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
        While using my Ubuntu laptop one night, I started an update to the newest Linux kernel. I was exhausted, so once
        the process finished, I went to sleep immediately without looking to see if it was successful.
      </p>
      <p>
        That turned out to be a big mistake. I discovered this the next morning when I turned on my laptop and was
        greeted by a bright pink screen with the words: <InlineCode text="KERNEL PANIC!" /> The installation had failed,
        and the new kernel was not working correctly.
      </p>
      <p>
        At first, I didn't know what to do, so I just kept restarting my laptop, hoping the problem would disappear.
        When that failed, I tried booting into Windows from the GRUB menu, and it worked perfectly.
      </p>
      <p>
        This confirmed that the issue was caused by the kernel update I had run the day before. With the problem
        identified, I started researching and thankfully found a way to fix my Linux installation without losing any
        data.
      </p>
      <p>
        In this article, I will share the exact steps I took to fix this problem. My goal is to give you a clear
        solution to fix this error if you ever run into it.
      </p>
    </section>

    <section>
      <h2 id="the-grub-menu" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#the-grub-menu">The GRUB menu</a>
      </h2>
      <p>
        After turning on the laptop, the first screen you'll see is the
        <a href="https://en.wikipedia.org/wiki/GNU_GRUB" target="_blank">GNU GRUB</a> menu. GRUB is a
        <a href="https://en.wikipedia.org/wiki/Bootloader" target="_blank">bootloader</a>, a program that lets you
        choose which operating system to start.
      </p>
      <p>
        If you have more than one OS, it allows you to choose which one to boot. We will use this menu to select a
        special option that lets us start Ubuntu with an older kernel, bypassing the one that is causing the panic.
      </p>

      <ImageWithCaption
        :image-src="grubMenu"
        image-alt="The GNU GRUB menu screen showing options for Ubuntu, Advanced options, and Windows Boot Manager."
        image-caption="The GNU GRUB menu."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        The first option in the list is <InlineCode text="Ubuntu" />. This option is automatically set to boot the
        newest kernel you have installed. Since the newest kernel is the broken one, selecting this will take you right
        back to the pink kernel panic screen. We need to choose a different option instead.
      </p>

      <ImageWithCaption
        :image-src="kernelPanicScreen"
        image-alt="A computer screen displaying a kernel panic error."
        image-caption="The scary kernel panic screen!"
        @open-image-modal="handleOpenImageModal"
      />
    </section>

    <section>
      <h2 id="fixing-the-problem" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#fixing-the-problem">Fixing the problem</a>
      </h2>

      <div>
        <h3 id="boot-into-working-kernel" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#boot-into-working-kernel">Boot into a working Linux kernel</a>
        </h3>

        <p>
          From the main GRUB menu, use your arrow keys to select <InlineCode text="Advanced options for Ubuntu" /> and
          press Enter. This will take you to a new screen listing all the Linux kernels installed on your system.
        </p>
        <p>
          You will see at least two versions. For example, my list showed a new, broken kernel (<InlineCode
            text="6.14.0-24-generic"
          />) and an older, working one (<InlineCode text="6.11.0-29-generic" />).
        </p>

        <ImageWithCaption
          :image-src="kernelVersionsList"
          image-alt="A list of available Linux kernels in the GRUB advanced options menu."
          image-caption="The different versions of the Linux kernel."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          The menu doesn't label which kernel is broken. You may need to do a quick test to find a working version.
          Simply select one from the list and press Enter. If you see the kernel panic screen again, just reboot your
          computer and try a different one until your system starts successfully.
        </p>
      </div>

      <div>
        <h3 id="remove-broken-kernel" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#remove-broken-kernel">Remove the broken kernel</a>
        </h3>

        <p>
          Now that your system is running on a working kernel, it's time to remove the broken one to clean your system.
        </p>
        <p>
          First, we need to know exactly which kernel you are currently using. This is the safe kernel that you must
          <b>not</b> delete. Open a terminal and run this command:
        </p>
        <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToastEvent" />

        <p>The output will be your current kernel's version.</p>
        <CodeOutput :code-output="codeOutput1" />

        <p>Next, list all the kernel packages on your system to find the broken one.</p>
        <CodeBlock :code="bashCodeSnippet2" language="bash" @show-toast="handleShowToastEvent" />

        <p>
          You will see a list of kernels. Look for letters like <InlineCode text="ii" /> or <InlineCode text="iF" /> at
          the beginning of each line.
        </p>

        <BulletPoint>
          <InlineCode text="ii" /> means the kernel is correctly installed. Your working kernel from the previous step
          should have <InlineCode text="ii" /> next to it.
        </BulletPoint>
        <BulletPoint>
          <InlineCode text="iF" /> means the kernel installation failed, and it's in a broken state.
          <b>This is the one we need to remove.</b>
        </BulletPoint>
        <BulletPoint>
          <InlineCode text="rc" /> means the kernel was removed, but its configuration files are still there.
        </BulletPoint>

        <CodeOutput :code-output="codeOutput2" />

        <p>
          Now we will completely remove the broken kernel and its matching header files. We use
          <InlineCode text="apt purge" /> because it deletes the configuration files as well.
        </p>

        <AdmonitionBlock title="Warning" type="warning">
          <p>
            Double-check that this is <b>NOT</b> the version you are currently using (from the
            <InlineCode text="uname -r" /> command).
          </p>
        </AdmonitionBlock>

        <CodeBlock :code="bashCodeSnippet3" language="bash" @show-toast="handleShowToastEvent" />

        <p>
          After removing the kernel, run <InlineCode text="autoremove" /> to get rid of any other packages that are no
          longer needed.
        </p>
        <CodeBlock :code="bashCodeSnippet4" language="bash" @show-toast="handleShowToastEvent" />

        <p>Finally, update your GRUB menu and restart the computer to make sure everything is perfect.</p>
        <CodeBlock :code="bashCodeSnippet5" language="bash" @show-toast="handleShowToastEvent" />

        <p>
          Now, reboot your laptop to make sure that everything is set correctly. It should boot directly into your 6.11
          kernel when clicking on <InlineCode text="Ubuntu" /> in the GRUB menu.
        </p>

        <ImageWithCaption
          :image-src="ubuntuDesktopSuccess"
          image-alt="A screenshot of the Ubuntu desktop verifying the system is working."
          image-caption="Success! The system is working again."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        And that's it! By using the GRUB menu to boot into an older, working kernel, you can get your system back online
        safely. From there, it only takes a few terminal commands to remove the broken kernel and clean your system.
      </p>
      <p>I hope this guide helped you solve the issue.</p>
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
import { calculateReadingTime } from "@/utils";

// Images
import coverImage from "./coverImage.svg";
import kernelPanicScreen from "./kernel_panic_screen.svg";
import grubMenu from "./grub_menu.svg";
import kernelVersionsList from "./kernel_versions_list.svg";
import ubuntuDesktopSuccess from "./ubuntu_desktop_success.jpg";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";
import CodeBlock from "@/components/CodeBlock.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import BulletPoint from "@/components/BulletPoint.vue";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";

export default {
  name: "FixKernelPanicLinux",
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
    CodeBlock,
    CodeOutput,
    BulletPoint,
    AdmonitionBlock,
  },
  emits: ["show-toast", "article-read"],
  data() {
    return {
      ...codeSnippets,

      tags: ["Linux", "Ubuntu", "Kernel Panic", "Grub", "Troubleshooting"],
      readingTime: 0,
      markdownContent,
      enlargedImageSrc: "",
      isImageModalVisible: false,

      coverImage,
      kernelPanicScreen,
      grubMenu,
      kernelVersionsList,
      ubuntuDesktopSuccess,

      ARTICLE_TYPES,
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  mounted() {
    document.title = "How to fix the kernel panic problem after installing a new version of the kernel";
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
