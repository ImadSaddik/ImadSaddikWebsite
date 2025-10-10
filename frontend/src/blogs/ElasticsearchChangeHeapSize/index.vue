<template>
  <ArticleLayout
    ref="articleContent"
    title="Change the heap size for Elasticsearch"
    sub-title="How to change the heap size for Elasticsearch to improve performance and reduce memory usage."
    creation-date="August 21, 2025"
    article-type="blog-post"
    :article-tags="blogTags"
    :cover-image="coverImage"
    :reading-time="readingTime"
    :slug="slug"
    :markdown-content="markdownContent"
    @show-toast="handleShowToastEvent"
  >
    <section>
      <h2 class="article-body-header" id="introduction">
        <a class="clickable-header-link" href="#introduction">Introduction</a>
      </h2>
      <p>
        In this article, I will show you how to change the <InlineCode text="heap size" />. For a more detailed
        walkthrough, check out the video tutorial:
      </p>
      <YouTubePlayer video-url="https://www.youtube.com/embed/guQuHmpPMXs" />

      <p>
        You can also find all related notebooks and slides in my
        <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course" target="_blank">GitHub repository</a>.
      </p>
    </section>

    <section>
      <h2 class="article-body-header" id="heap-size">
        <a class="clickable-header-link" href="#heap-size">Heap size</a>
      </h2>

      <div>
        <p>
          Elasticsearch is a powerful tool, but it can be resource-intensive by default. If you're like me and using it
          for small projects, you'll want to configure it to consume less memory by adjusting the
          <InlineCode text="heap size" />.
        </p>

        <p>
          Heap size refers to the amount of memory allocated to an application for dynamic memory allocation during
          runtime. By default, <InlineCode text="Elasticsearch" /> allocates 50% of your system's available memory. For
          instance, my system has <InlineCode text="16GB" /> of RAM, so whenever I start the container,
          <InlineCode text="Elasticsearch" /> uses <InlineCode text="8GB" />. This slows down my PC significantly and
          can even cause it to freeze due to memory exhaustion.
        </p>

        <p>For small projects and local setups, allocating just <InlineCode text="1–2GB" /> is usually sufficient.</p>
      </div>
    </section>

    <section>
      <h2 class="article-body-header" id="changing-the-heap-size">
        <a class="clickable-header-link" href="#changing-the-heap-size">Changing the heap size</a>
      </h2>

      <p>Follow these steps to adjust the heap size.</p>

      <section>
        <h3 class="article-body-subheader" id="start-the-container">
          <a class="clickable-header-link" href="#start-the-container">Start the container</a>
        </h3>

        <div>
          <p>Open your terminal and run:</p>
          <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToastEvent" />
          <AdmonitionBlock title="Note" type="note">
            <p>
              If you assigned a different name to the container, replace <InlineCode text="elasticsearch" /> with that
              name in the command.
            </p>
          </AdmonitionBlock>
        </div>
      </section>

      <section>
        <h3 class="article-body-subheader" id="access-the-container">
          <a class="clickable-header-link" href="#access-the-container">Access the container</a>
        </h3>

        <div>
          <p>Execute the following command to enter the <InlineCode text="elasticsearch" /> container:</p>
          <CodeBlock :code="bashCodeSnippet2" language="bash" @show-toast="handleShowToastEvent" />
        </div>
      </section>

      <section>
        <h3 class="article-body-subheader" id="create-the-heap-options-file">
          <a class="clickable-header-link" href="#create-the-heap-options-file">Create the "heap.options" file</a>
        </h3>

        <div>
          <p>
            Navigate to the <InlineCode text="jvm.options.d" /> folder and configure the
            <InlineCode text="heap size" />. Run these commands to create the file and set the memory limits:
          </p>
          <CodeBlock :code="bashCodeSnippet3" language="bash" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>Verify the file contents with:</p>
          <CodeBlock :code="bashCodeSnippet4" language="bash" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>You should see this in the output:</p>
          <CodeOutput :code-output="codeOutput1" />
        </div>

        <p>
          In this example, <InlineCode text="Elasticsearch" /> is configured to use <InlineCode text="2GB" /> of memory.
          You can adjust the value by replacing <InlineCode text="2" /> with your desired amount.
        </p>
      </section>
    </section>

    <section>
      <h2 class="article-body-header" id="conclusion">
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        Changing the <InlineCode text="heap size" /> for <InlineCode text="Elasticsearch" /> is key to making it work
        well for your specific needs, especially for smaller projects. By following the steps outlined, you can easily
        adjust memory usage and keep your system running smoothly.
      </p>
    </section>
  </ArticleLayout>
</template>

<script>
// Text & Utils
import * as codeSnippets from "./codeSnippets.js";
import markdownContent from "./content.md";
import { calculateReadingTime } from "@/utils.js";

// Images
import coverImage from "./coverImage.svg";

// Components
import CodeBlock from "@/components/CodeBlock.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import InlineCode from "@/components/InlineCode.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";

export default {
  name: "ElasticsearchChangeHeapSize",
  emits: ["show-toast", "article-read"],
  components: {
    CodeBlock,
    CodeOutput,
    InlineCode,
    YouTubePlayer,
    ArticleLayout,
    AdmonitionBlock,
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  data() {
    return {
      ...codeSnippets,

      blogTags: ["Elasticsearch"],
      coverImage,
      readingTime: 0,
      markdownContent,
    };
  },
  mounted() {
    document.title = "Change the heap size for Elasticsearch";
    this.readingTime = calculateReadingTime(this.$refs);
    const readTimeThresholdInMilliseconds = this.readingTime * 0.25 * 60 * 1000;
    setTimeout(() => {
      this.$emit("article-read");
    }, readTimeThresholdInMilliseconds);
  },
  methods: {
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped></style>
