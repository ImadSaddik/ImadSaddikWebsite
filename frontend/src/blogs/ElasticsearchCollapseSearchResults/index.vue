<template>
  <ArticleLayout
    ref="articleContent"
    title="Collapse search results in Elasticsearch"
    sub-title="How to show only the best documents for each group with collapsing."
    creation-date="August 20, 2025"
    article-type="blog-post"
    :article-tags="blogTags"
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
        In this article, I will show you how to collapse search results. For a more detailed walkthrough, check out the
        video tutorial:
      </p>
      <YouTubePlayer video-url="https://www.youtube.com/embed/znhN54KVqbY" />

      <p>
        You can also find all related notebooks and slides in my
        <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course" target="_blank">GitHub repository</a>.
      </p>
    </section>

    <section>
      <h2 id="collapse-search-results" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#collapse-search-results">Collapse search results</a>
      </h2>
      <p>
        <InlineCode text="Collapsing" /> is a cool feature that helps you show only the best document for each
        <InlineCode text="group" />. A group is a unique value in a field. Let's index some documents in order to
        demonstrate how collapse works in Elasticsearch.
      </p>

      <section>
        <h3 id="indexing-documents" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#indexing-documents">Indexing documents</a>
        </h3>

        <div>
          <p>
            Let's use the <InlineCode text="Apod" /> dataset, you can find it in
            <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course/blob/main/data/apod.json" target="_blank"
              >this GitHub repository</a
            >. Start by reading the file.
          </p>
          <CodeBlock :code="pythonCodeSnippet1" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>Then, create an index.</p>
          <CodeBlock :code="pythonCodeSnippet2" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>Use the <InlineCode text="bulk API" /> to index the documents in the <InlineCode text="apod index" />.</p>
          <CodeBlock :code="pythonCodeSnippet3" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <p>
          If the indexing is successful, you should see <InlineCode text='response["errors"]' /> as
          <InlineCode text="False" /> .
        </p>
      </section>

      <section>
        <h3 id="collapsing" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#collapsing">Collapsing</a>
        </h3>

        <div>
          <p>Now, let's search for documents where <InlineCode text="Andromeda galaxy" /> appears in the title.</p>
          <CodeBlock :code="pythonCodeSnippet4" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            Without collapsing, the search results will return all documents that match the query. In this case, the
            number is 270 documents.
          </p>
          <CodeOutput :code-output="codeOutput1" />
        </div>

        <div>
          <p>
            Let's look at the count of documents that matched the query per year in the
            <InlineCode text="apod index" />.
          </p>
          <CodeBlock :code="pythonCodeSnippet5" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            We observe that we have a lot of documents per year. What would happen if we collapse the search results by
            year?
          </p>
          <CodeOutput :code-output="codeOutput2" />
        </div>

        <div>
          <p>
            Collapsing search results by year will return only one document per year that matches the query. That
            returned document will be the one with the highest <InlineCode text="_score" /> for that year.
          </p>
          <CodeBlock :code="pythonCodeSnippet6" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>Now, we got 10 documents after collapsing the search results.</p>
          <CodeOutput :code-output="codeOutput3" />
        </div>

        <div>
          <p>Let's print the number of documents per year.</p>
          <CodeBlock :code="pythonCodeSnippet7" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>Now we have only one document per year that matches the query.</p>
          <CodeOutput :code-output="codeOutput4" />
        </div>

        <div>
          <p>Let's verify if the document in year 2024 is the one with the highest <InlineCode text="_score" />.</p>
          <CodeBlock :code="pythonCodeSnippet8" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            From the response with collapsing, we can see that the document in year 2024 has a
            <InlineCode text="_score" /> of <InlineCode text="7.789091" />.
          </p>
          <CodeOutput :code-output="codeOutput5" />
        </div>

        <div>
          <p>Let's look at the scores in the response without collapsing</p>
          <CodeBlock :code="pythonCodeSnippet9" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            We confirm that the first hit from 2024 has a <InlineCode text="_score" /> of
            <InlineCode text="7.789091" />, which is the same as the one in the response with collapsing.
          </p>
          <CodeOutput :code-output="codeOutput6" />
        </div>
      </section>

      <section>
        <h3 id="expanding-collapsed-results" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#expanding-collapsed-results">Expanding collapsed results</a>
        </h3>

        <div>
          <p>
            Expanding collapsed results allows you to retrieve more than one document per year that matches the query.
            Control how documents are sorted within each collapsed group, and more.
          </p>
          <p>
            To expand the results, we add <InlineCode text="inner_hits" /> to <InlineCode text="collapse" />. The name
            <InlineCode text="most_recent" /> will be used to extract those documents from the response object.
            <InlineCode text="size" /> controls the number of documents that we
          </p>
          <CodeBlock :code="pythonCodeSnippet10" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>
            Total documents without collapsing is 270. After collapsing, that number is reduced to 10 because we get one
            document per year.
          </p>
          <p>For each year, we get 3 documents inside the <InlineCode text="inner_hits" /> field.</p>
          <CodeOutput :code-output="codeOutput7" />
        </div>

        <div>
          <p>Let's see how many documents we have in a single year.</p>
          <CodeBlock :code="pythonCodeSnippet11" language="python" @show-toast="handleShowToastEvent" />
        </div>

        <div>
          <p>We get 3 documents.</p>
          <CodeOutput :code-output="codeOutput8" />
        </div>

        <div>
          <p>
            The documents are sorted by <InlineCode text="_score" /> within each collapsed group. They also match the
            scores in the response without collapsing.
          </p>
          <CodeBlock :code="pythonCodeSnippet12" language="python" @show-toast="handleShowToastEvent" />
          <CodeOutput :code-output="codeOutput9" />
        </div>
      </section>

      <section>
        <h3 id="collapsing-with-search_after" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#collapsing-with-search_after">Collapsing with search_after</a>
        </h3>

        <div>
          <p>
            When collapsing on a field with a lot of unique values, you can use the
            <InlineCode text="search_after" /> parameter to paginate through the results. This is useful when you want
            to retrieve all collapsed results without missing any.
          </p>
          <AdmonitionBlock title="Note" type="note">
            <p>
              You can't use the <InlineCode text="scroll API" /> with collapsing. Use
              <InlineCode text="search_after" /> instead.
            </p>
          </AdmonitionBlock>
        </div>

        <div>
          <p>
            Let's create a new index where we are going to create 40 000 documents. Each user, will have 2 documents.
          </p>
          <CodeBlock :code="pythonCodeSnippet13" language="python" @show-toast="handleShowToastEvent" />
          <CodeOutput :code-output="codeOutput10" />
        </div>

        <div>
          <p>Let's confirm that we have 40 000 documents in the index.</p>
          <CodeBlock :code="pythonCodeSnippet14" language="python" @show-toast="handleShowToastEvent" />
          <CodeOutput :code-output="codeOutput11" />
        </div>

        <div>
          <p>
            Now we are ready to use <InlineCode text="search_after" /> to paginate through the collapsed results. Since
            we have 2 documents per user, we can expect to have 20 000 collapsed results.
          </p>
          <CodeBlock :code="pythonCodeSnippet15" language="python" @show-toast="handleShowToastEvent" />
          <CodeOutput :code-output="codeOutput12" />
        </div>

        <p>
          We see that the last user ID in the collapsed results is <InlineCode text="19999" /> and the number of
          collapsed hits is <InlineCode text="20000" />, which is what we expected.
        </p>
      </section>
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        In this article, we explored how <InlineCode text="collapsing" /> search results works in
        <InlineCode text="Elasticsearch" />. This feature helps you refine your search output by showing only the most
        relevant document from each <InlineCode text="group" />, like getting just one top result per year.
      </p>
      <p>
        We learned how <InlineCode text="collapsing" /> reduces the number of returned hits for a cleaner view, and how
        <InlineCode text="inner_hits" /> can expand those results to show more details within each group.
      </p>
      <p>
        For large datasets, we also saw that <InlineCode text="search_after" /> is the way to paginate through collapsed
        results, especially when the <InlineCode text="scroll API" /> isn't suitable. Understanding
        <InlineCode text="collapsing" /> can really help you make your <InlineCode text="Elasticsearch" /> searches more
        efficient and your data easier to work with.
      </p>
    </section>
  </ArticleLayout>
</template>

<script>
// Text & Utils
import * as codeSnippets from "./codeSnippets.js";
import { calculateReadingTime } from "@/utils";
import markdownContent from "./content.md";

// Images
import coverImage from "./coverImage.svg";

// Components
import CodeBlock from "@/components/CodeBlock.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import InlineCode from "@/components/InlineCode.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";

export default {
  name: "ElasticsearchCollapseSearchResults",
  components: {
    CodeBlock,
    CodeOutput,
    InlineCode,
    YouTubePlayer,
    AdmonitionBlock,
    ArticleLayout,
  },
  emits: ["show-toast", "article-read"],
  data() {
    return {
      ...codeSnippets,

      blogTags: ["Elasticsearch"],
      coverImage,
      readingTime: 0,
      markdownContent,
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  mounted() {
    document.title = "Collapse search results in Elasticsearch";
    const articleContent = this.$refs.articleContent.$el.innerText;
    this.readingTime = calculateReadingTime(articleContent);
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
