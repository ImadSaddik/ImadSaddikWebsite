<template>
  <ArticleLayout
    ref="articleContent"
    title="Pre-filtering with kNN search in Elasticsearch"
    sub-title="How to apply filters to an index to remove documents that don’t meet certain requirements before using kNN search."
    creation-date="August 12, 2025"
    article-type="blog-post"
    :article-tags="blogTags"
    :cover-image="coverImage"
    :reading-time="readingTime"
    :slug="slug"
    :markdown-content="markdownContent"
    @show-toast="handleShowToastEvent"
  >
    <section>
      <h2 class="article-body-header" id="introduction" data-table-of-contents>
        <a class="clickable-header-link" href="#introduction">Introduction</a>
      </h2>
      <p>
        In this article, I will show you how to use pre-filtering with kNN search. For a more detailed walkthrough,
        check out the video tutorial:
      </p>
      <YouTubePlayer video-url="https://www.youtube.com/embed/ESC-ome_Q1o" />

      <p>
        You can also find all related notebooks and slides in my
        <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course" target="_blank">GitHub repository</a>.
      </p>
    </section>

    <section>
      <h2 class="article-body-header" id="pre-filtering" data-table-of-contents>
        <a class="clickable-header-link" href="#pre-filtering">Pre-filtering</a>
      </h2>
      <p>
        <InlineCode text="Pre-filtering" /> means we apply filters to an index before doing anything else. For example,
        we can filter out documents that don't meet certain requirements before using kNN search.
      </p>

      <section>
        <h3 class="article-body-subheader" id="preparing-the-index" data-table-of-contents>
          <a class="clickable-header-link" href="#preparing-the-index">Preparing the index</a>
        </h3>

        <div>
          <p>
            Since we're using kNN search, we need to set the data type for the embedding field to
            <InlineCode text="dense_vector" />. Elasticsearch doesn't do this by itself like it does for other fields,
            so we have to do it manually.
          </p>
          <CodeBlock :code="pythonCodeSnippet1" language="python" @show-toast="handleShowToastEvent" />
        </div>
      </section>

      <section>
        <h3 class="article-body-subheader" id="indexing-documents" data-table-of-contents>
          <a class="clickable-header-link" href="#indexing-documents">Indexing documents</a>
        </h3>

        <div>
          <p>
            Let's use the <InlineCode text="Apod" /> dataset, you can find it in
            <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course/blob/main/data/apod.json" target="_blank"
              >this GitHub repository</a
            >. Start by reading the file.
          </p>
          <CodeBlock :code="pythonCodeSnippet2" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            Then, let's use an embedding model from Hugging Face. An embedding model converts text into a dense vector.
          </p>
          <p>
            I will use
            <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2" target="_blank">all-MiniLM-L6-v2</a>
            in this tutorial, it is a small model that should work fine if you don't have a GPU.
          </p>
          <ImageWithCaption
            :image-src="allMiniLMModelHuggingFaceHub"
            image-alt="The embedding model's page on Hugging Face"
            image-caption="The model's card on Hugging Face."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <p>
            First, make sure to install the <InlineCode text="sentence_transformers" /> library in your python
            environment.
          </p>
          <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            Then, download the model from Hugging Face and pass it to the device. The code will automatically detect if
            you have a GPU or not.
          </p>
          <CodeBlock :code="pythonCodeSnippet3" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            Let's use the model to embed the <InlineCode text="explanation" /> field for all documents. We will also use
            the <InlineCode text="bulk API" /> to index the documents in the <InlineCode text="apod index" />.
          </p>
          <CodeBlock :code="pythonCodeSnippet4" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <p>
          If the indexing is successful, you should see <InlineCode text='response["errors"]' /> as
          <InlineCode text="False" />.
        </p>
      </section>

      <section>
        <h3 class="article-body-subheader" id="pre-filtering-knn-search" data-table-of-contents>
          <a class="clickable-header-link" href="#pre-filtering-knn-search">Pre-filtering & kNN search</a>
        </h3>

        <div>
          <p>
            Before using <InlineCode text="pre-filtering" />, let's use kNN search only. The following search query,
            will use kNN search to find 10 documents that are very similar to the query.
          </p>
          <CodeBlock :code="pythonCodeSnippet5" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>Here we got 10 documents that are very similar to the query. Let's print the first 3 documents.</p>
          <CodeBlock :code="pythonCodeSnippet6" language="python" @show-toast="handleShowToastEvent" />
          <CodeOutput :code-output="codeOutput1" />
        </div>

        <div>
          <p>Let's look at the years of the documents returned by the regular kNN search.</p>
          <CodeBlock :code="pythonCodeSnippet7" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>We can see that the years are different.</p>
          <CodeOutput :code-output="codeOutput2" />
        </div>

        <div>
          <p>
            Let's run the same query, but this time we will use <InlineCode text="pre-filtering" /> to filter the
            documents based on the year. Let's say we want to filter the documents to only include those from the year
            2024.
          </p>
          <p>
            We do this by adding a <InlineCode text="filter" /> clause to the kNN query. The
            <InlineCode text="filter" /> clause is a regular query that filters the documents before the kNN search is
            performed.
          </p>
          <CodeBlock :code="pythonCodeSnippet8" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>We still get 10 documents, let's look at the year field in each document.</p>
          <CodeBlock :code="pythonCodeSnippet7" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>As you can see, the documents returned are only from the year 2024.</p>
          <CodeOutput :code-output="codeOutput3" />
        </div>

        <div>
          <p>
            Let's look at the first 3 documents returned by the kNN search to confirm that they are similar to the
            query.
          </p>
          <CodeBlock :code="pythonCodeSnippet6" language="python" @show-toast="handleShowToastEvent" />
          <CodeOutput :code-output="codeOutput4" />
        </div>
      </section>
    </section>

    <section>
      <h2 class="article-body-header" id="conclusion" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        We've reached the end of this journey! I hope you had fun and learned a lot. I also hope I did a good job
        teaching you how to use Elasticsearch. It's a great tool that I really enjoy. Best of luck on your learning
        journey, and happy coding!
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
import { calculateReadingTime } from "@/utils.js";
import markdownContent from "./content.md";

// Images
import coverImage from "./coverImage.svg";
import allMiniLMModelHuggingFaceHub from "./allMiniLmL6V2ModelHF.png";

// Components
import CodeBlock from "@/components/CodeBlock.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import InlineCode from "@/components/InlineCode.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";

export default {
  name: "ElasticsearchPreFilteringWithKnnSearch",
  emits: ["show-toast", "article-read"],
  components: {
    CodeBlock,
    CodeOutput,
    InlineCode,
    ImageEnlarger,
    YouTubePlayer,
    ImageWithCaption,
    ArticleLayout,
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  data() {
    return {
      ...codeSnippets,

      allMiniLMModelHuggingFaceHub,
      blogTags: ["Elasticsearch", "kNN", "Semantic search"],
      coverImage,
      enlargedImageSrc: "",
      isImageModalVisible: false,
      readingTime: 0,
      markdownContent,
    };
  },
  mounted() {
    document.title = "Pre-filtering with kNN search in Elasticsearch";
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
