<template>
  <section class="article-container">
    <!-- header -->
    <ArticleHeader
      title="Pre-filtering with kNN search in Elasticsearch"
      sub-title="How to apply filters to an index to remove documents that don’t meet certain requirements before using kNN search."
      :article-tags="blogTags"
      :cover-image="coverImage"
      creation-date="August 12, 2025"
      reading-time="5"
      @show-toast="handleShowToast"
    />

    <!-- body -->
    <div class="article-body">
      <h2 class="article-body-header" id="introduction">
        <a href="#introduction">Introduction</a>
      </h2>
      <p>
        In the
        <a href="https://medium.com/@imadsaddik/26-collapse-search-results-c2c4f4290485" target="_blank"
          >previous article</a
        >, we have talked about how to collapse search results in Elasticsearch. In this one, I will show you how to use
        pre-filtering with kNN search.
      </p>
      <p>For a more detailed walkthrough, check out the video tutorial:</p>
      <YouTubePlayer :video-url="'https://www.youtube.com/embed/ESC-ome_Q1o'" />

      <p>
        You can also find all related notebooks and slides in my
        <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course" target="_blank">GitHub repository</a>.
      </p>

      <h2 class="article-body-header" id="pre-filtering">
        <a href="#pre-filtering">Pre-filtering</a>
      </h2>
      <p>
        <InlineCode text="Pre-filtering" /> means we apply filters to an index before doing anything else. For example,
        we can filter out documents that don't meet certain requirements before using kNN search.
      </p>

      <h3 class="article-body-subheader" id="preparing-the-index">
        <a href="#preparing-the-index">Preparing the index</a>
      </h3>
      <p>
        Since we're using kNN search, we need to set the data type for the embedding field to
        <InlineCode text="dense_vector" />. Elasticsearch doesn't do this by itself like it does for other fields, so we
        have to do it manually.
      </p>
      <CodeBlock :code="pythonCodeSnippet1" language="python" @show-toast="handleShowToast" />

      <h3 class="article-body-subheader" id="indexing-documents">
        <a href="#indexing-documents">Indexing documents</a>
      </h3>
      <p>
        Let's use the <InlineCode text="Apod" /> dataset, you can find it in
        <a href="https://github.com/ImadSaddik/ElasticSearch_Python_Course/blob/main/data/apod.json" target="_blank"
          >this GitHub repository</a
        >. Start by reading the file.
      </p>
      <CodeBlock :code="pythonCodeSnippet2" language="python" @show-toast="handleShowToast" />
      <p>Then, let's use an embedding model from Hugging Face. An embedding model converts text into a dense vector.</p>
      <p>
        I will use
        <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2" target="_blank">all-MiniLM-L6-v2</a> in
        this tutorial, it is a small model that should work fine if you don't have a GPU.
      </p>
      <ImageWithCaption
        :image-src="allMiniLMModelHuggingFaceHub"
        image-alt="The embedding model's page on Hugging Face"
        image-caption="The model's card on Hugging Face."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        First, make sure to install the <InlineCode text="sentence_transformers" /> library in your python environment.
      </p>
      <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToast" />

      <p>
        Then, download the model from Hugging Face and pass it to the device. The code will automatically detect if you
        have a GPU or not.
      </p>
      <CodeBlock :code="pythonCodeSnippet3" language="python" @show-toast="handleShowToast" />

      <p>
        Let's use the model to embed the <InlineCode text="explanation" /> field for all documents. We will also use the
        <InlineCode text="bulk API" /> to index the documents in the <InlineCode text="apod index" />.
      </p>
      <CodeBlock :code="pythonCodeSnippet4" language="python" @show-toast="handleShowToast" />

      <p>
        If the indexing is successful, you should see <InlineCode text='response["errors"]' /> as
        <InlineCode text="False" />.
      </p>

      <h3 class="article-body-subheader" id="pre-filtering-knn-search">
        <a href="#pre-filtering-knn-search">Pre-filtering & kNN search</a>
      </h3>
      <p>
        Before using <InlineCode text="pre-filtering" />, let's use kNN search only. The following search query, will
        use kNN search to find 10 documents that are very similar to the query.
      </p>
      <CodeBlock :code="pythonCodeSnippet5" language="python" @show-toast="handleShowToast" />

      <p>Here we got 10 documents that are very similar to the query. Let's print the first 3 documents.</p>
      <CodeBlock :code="pythonCodeSnippet6" language="python" @show-toast="handleShowToast" />
      <CodeOutput :code-output="codeOutput1" />

      <p>Let's look at the years of the documents returned by the regular kNN search.</p>
      <CodeBlock :code="pythonCodeSnippet7" language="python" @show-toast="handleShowToast" />

      <p>We can see that the years are different.</p>
      <CodeOutput :code-output="codeOutput2" />

      <p>
        Let's run the same query, but this time we will use <InlineCode text="pre-filtering" /> to filter the documents
        based on the year. Let's say we want to filter the documents to only include those from the year 2024.
      </p>
      <p>
        We do this by adding a <InlineCode text="filter" /> clause to the kNN query. The
        <InlineCode text="filter" /> clause is a regular query that filters the documents before the kNN search is
        performed.
      </p>
      <CodeBlock :code="pythonCodeSnippet8" language="python" @show-toast="handleShowToast" />

      <p>We still get 10 documents, let's look at the year field in each document.</p>
      <CodeBlock :code="pythonCodeSnippet7" language="python" @show-toast="handleShowToast" />

      <p>As you can see, the documents returned are only from the year 2024.</p>
      <CodeOutput :code-output="codeOutput3" />

      <p>
        Let's look at the first 3 documents returned by the kNN search to confirm that they are similar to the query.
      </p>
      <CodeBlock :code="pythonCodeSnippet6" language="python" @show-toast="handleShowToast" />
      <CodeOutput :code-output="codeOutput4" />

      <h2 class="article-body-header" id="conclusion">
        <a href="#conclusion">Conclusion</a>
      </h2>
      <p>
        We've reached the end of this journey! I hope you had fun and learned a lot. I also hope I did a good job
        teaching you how to use Elasticsearch. It's a great tool that I really enjoy. Best of luck on your learning
        journey, and happy coding!
      </p>
    </div>

    <!-- footer -->
    <ArticleFooter :card-data="relatedBlogsCardData" />
  </section>

  <!-- Modal -->
  <ImageEnlarger
    :is-visible="isImageModalVisible"
    :enlarged-image-src="enlargedImageSrc"
    @close-image-modal="handleCloseImageModal"
  />
</template>

<script>
// Images
import coverImage from "@/assets/blogs/preFilteringWithKnnSearch.png";
import coursePlaceholder1 from "@/assets/courses/placeholder_1.svg";
import coursePlaceholder2 from "@/assets/courses/placeholder_2.svg";
import allMiniLMModelHuggingFaceHub from "@/assets/blogs/all_minilm_l6_v2_model_hf.png";

// Components
import CodeBlock from "@/components/CodeBlock.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import InlineCode from "@/components/InlineCode.vue";
import ArticleHeader from "@/components/ArticleHeader.vue";
import ArticleFooter from "@/components/ArticleFooter.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";

export default {
  name: "PreFilteringWithKnnSearch",
  emits: ["show-toast"],
  components: {
    CodeBlock,
    CodeOutput,
    InlineCode,
    ArticleHeader,
    ArticleFooter,
    ImageEnlarger,
    YouTubePlayer,
    ImageWithCaption,
  },
  data() {
    return {
      blogTags: ["Python", "Elasticsearch", "kNN"],
      coverImage,
      allMiniLMModelHuggingFaceHub,
      relatedBlogsCardData: [
        {
          imageSrc: coursePlaceholder1,
          altText: "Course placeholder 1",
          title: "Image title 1",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder2,
          altText: "Course placeholder 2",
          title: "Image title 2",
          subTitle: "16 August 2001",
        },
        {
          imageSrc: coursePlaceholder1,
          altText: "Course placeholder 3",
          title: "Image title 3",
          subTitle: "16 August 2001",
        },
      ],
      isImageModalVisible: false,
      enlargedImageSrc: "",

      pythonCodeSnippet1: `from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")
client_info = es.info()
print("Connected to Elasticsearch!")

es.indices.delete(index="apod", ignore_unavailable=True)
es.indices.create(
    index="apod",
    mappings={
        "properties": {
            "embedding": {
                "type": "dense_vector",
            }
        }
    },
)`,
      pythonCodeSnippet2: `import json

with open("../data/apod.json") as f:
documents = json.load(f))`,
      bashCodeSnippet1: "pip install sentence-transformers",
      pythonCodeSnippet3: `import torch
from sentence_transformers import SentenceTransformer

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SentenceTransformer("all-MiniLM-L6-v2")
model = model.to(device)`,
      pythonCodeSnippet4: `from tqdm import tqdm

def get_embedding(text):
    return model.encode(text)

operations = []
for document in tqdm(documents, total=len(documents), desc="Indexing documents"):
    year = document["date"].split("-")[0]
    document["year"] = int(year)

    operations.append({"index": {"_index": "apod"}})
    operations.append(
        {
            **document,
            "embedding": get_embedding(document["explanation"]),
        }
    )

response = es.bulk(operations=operations)`,
      pythonCodeSnippet5: `query = "What is a black hole?"
embedded_query = get_embedding(query)

result = es.search(
    index="apod",
    knn={
        "field": "embedding",
        "query_vector": embedded_query,
        "num_candidates": 20,
        "k": 10,
    },
)

number_of_documents = result.body["hits"]["total"]["value"]
print(f"Found {number_of_documents} documents")
# Found 10 documents`,
      pythonCodeSnippet6: `for hit in result.body["hits"]["hits"][:3]:
    print(f"Score: {hit['_score']}")
    print(f"Title: {hit['_source']['title']}")
    print(f"Explanation: {hit['_source']['explanation']}")
    print("-" * 80)`,
      codeOutput1: `Score: 0.80657506
Title: Black Hole Accreting with Jet
Explanation: What happens when a black hole devours a star? Many details remain unknown, but observations are providing new clues. In 2014, a powerful explosion was recorded by the ground-based robotic telescopes of the All Sky Automated Survey for SuperNovae (Project ASAS-SN), with followed-up observations by instruments including NASA's Earth-orbiting Swift satellite. Computer modeling of these emissions fit a star being ripped apart by a distant supermassive black hole. The results of such a collision are portrayed in the featured artistic illustration. The black hole itself is a depicted as a tiny black dot in the center. As matter falls toward the hole, it collides with other matter and heats up. Surrounding the black hole is an accretion disk of hot matter that used to be the star, with a jet emanating from the black hole's spin axis.
--------------------------------------------------------------------------------
Score: 0.80611444
Title: Black Hole Accreting with Jet
Explanation: What happens when a black hole devours a star? Many details remain unknown, but recent observations are providing new clues. In 2014, a powerful explosion was recorded by the ground-based robotic telescopes of the All Sky Automated Survey for SuperNovae (ASAS-SN) project, and followed up by instruments including NASA's Earth-orbiting Swift satellite. Computer modeling of these emissions fit a star being ripped apart by a distant supermassive black hole. The results of such a collision are portrayed in the featured artistic illustration. The black hole itself is a depicted as a tiny black dot in the center. As matter falls toward the hole, it collides with other matter and heats up. Surrounding the black hole is an accretion disk of hot matter that used to be the star, with a jet emanating from the black hole's spin axis.
--------------------------------------------------------------------------------
Score: 0.77729917
Title: First Horizon Scale Image of a Black Hole
Explanation: What does a black hole look like? To find out, radio telescopes from around the Earth coordinated observations of black holes with the largest known event horizons on the sky. Alone, black holes are just black, but these monster attractors are known to be surrounded by glowing gas. The first image was released yesterday and resolved the area around the black hole at the center of galaxy M87 on a scale below that expected for its event horizon. Pictured, the dark central region is not the event horizon, but rather the black hole's shadow -- the central region of emitting gas darkened by the central black hole's gravity. The size and shape of the shadow is determined by bright gas near the event horizon, by strong gravitational lensing deflections, and by the black hole's spin. In resolving this black hole's shadow, the Event Horizon Telescope (EHT) bolstered evidence that Einstein's gravity works even in extreme regions, and gave clear evidence that M87 has a central spinning black hole of about 6 billion solar masses. The EHT is not done -- future observations will be geared toward even higher resolution, better tracking of variability, and exploring the immediate vicinity of the black hole in the center of our Milky Way Galaxy.
--------------------------------------------------------------------------------`,
      pythonCodeSnippet7: `for hit in result.body["hits"]["hits"]:
    print(f"Year: {hit['_source']['year']}")`,
      codeOutput2: `Year: 2024
Year: 2017
Year: 2019
Year: 2022
Year: 2018
Year: 2020
Year: 2024
Year: 2024
Year: 2022
Year: 2020`,
      pythonCodeSnippet8: `query = "What is a black hole?"
embedded_query = get_embedding(query)

result = es.search(
    index="apod",
    knn={
        "field": "embedding",
        "query_vector": embedded_query,
        "num_candidates": 20,
        "k": 10,
        "filter": {"term": {"year": 2024}},
    },
)

number_of_documents = result.body["hits"]["total"]["value"]
print(f"Found {number_of_documents} documents")
# Found 10 documents`,
      codeOutput3: `Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024`,
      codeOutput4: `Score: 0.80657506
Title: Black Hole Accreting with Jet
Explanation: What happens when a black hole devours a star? Many details remain unknown, but observations are providing new clues. In 2014, a powerful explosion was recorded by the ground-based robotic telescopes of the All Sky Automated Survey for SuperNovae (Project ASAS-SN), with followed-up observations by instruments including NASA's Earth-orbiting Swift satellite. Computer modeling of these emissions fit a star being ripped apart by a distant supermassive black hole. The results of such a collision are portrayed in the featured artistic illustration. The black hole itself is a depicted as a tiny black dot in the center. As matter falls toward the hole, it collides with other matter and heats up. Surrounding the black hole is an accretion disk of hot matter that used to be the star, with a jet emanating from the black hole's spin axis.
--------------------------------------------------------------------------------
Score: 0.75311136
Title: A Black Hole Disrupts a Passing Star
Explanation: What happens to a star that goes near a black hole? If the star directly impacts a massive black hole, then the star falls in completely -- and everything vanishes. More likely, though, the star goes close enough to have the black hole's gravity pull away its outer layers, or disrupt, the star. Then, most of the star's gas does not fall into the black hole. These stellar tidal disruption events can be as bright as a supernova, and an increasing amount of them are being discovered by automated sky surveys. In the featured artist's illustration, a star has just passed a massive black hole and sheds gas that continues to orbit. The inner edge of a disk of gas and dust surrounding the black hole is heated by the disruption event and may glow long after the star is gone.
--------------------------------------------------------------------------------
Score: 0.7479558
Title: Swirling Magnetic Field around Our Galaxy's Central Black Hole
Explanation: What's happening to the big black hole in the center of our galaxy? It is sucking in matter from a swirling disk -- a disk that is magnetized, it has now been confirmed. Specifically, the black hole's accretion disk has recently been seen to emit polarized light, radiation frequently associated with a magnetized source. Pictured here is a close-up of Sgr A*, our Galaxy's central black hole, taken by radio telescopes around the world participating in the Event Horizon Telescope (EHT) Collaboration. Superposed are illustrative curved lines indicating polarized light likely emitted from swirling magnetized gas that will soon fall into the 4+ million solar mass central black hole. The central part of this image is likely dark because little light-emitting gas is visible between us and the dark event horizon of the black hole. Continued EHT monitoring of this and M87's central black hole may yield new clues about the gravity of black holes and how infalling matter creates disks and jets.
--------------------------------------------------------------------------------`,
    };
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
    handleShowToast(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped>
.article-body {
  width: 50%;
}

.article-container {
  padding: var(--gap-xl);
  margin-top: var(--gap-xxl);
}

.article-body-header {
  font-size: var(--font-size-big-medium);
  margin: var(--gap-md) 0;
}

.article-body-subheader {
  font-size: var(--font-size-medium);
  margin: var(--gap-md) 0;
}

.article-body p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

@media screen and (max-width: 1500px) {
  .article-body {
    width: 100%;
  }
}

@media screen and (max-width: 1100px) {
  .article-body-header {
    font-size: var(--font-size-medium);
  }

  .article-body-subheader {
    font-size: var(--font-size-big-small);
  }

  .article-container {
    padding: var(--gap-lg);
    margin-top: var(--gap-md);
  }
}

@media screen and (max-width: 768px) {
  .article-container {
    padding: var(--gap-md);
  }
}
</style>
