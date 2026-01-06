# Pre-filtering with kNN search in Elasticsearch

How to apply filters to an index to remove documents that don’t meet certain requirements before using kNN search.

**Date:** August 12, 2025
**Tags:** Elasticsearch, kNN, Semantic search

---

## Introduction

In this article, I will show you how to use pre-filtering with kNN search. For a more detailed walkthrough, check out the video tutorial:

[https://www.youtube.com/watch?v=ESC-ome_Q1o](https://www.youtube.com/watch?v=ESC-ome_Q1o)

You can also find all related notebooks and slides in my [GitHub repository](https://github.com/ImadSaddik/ElasticSearch_Python_Course).

---

## Pre-filtering

**Pre-filtering** means we apply filters to an index before doing anything else. For example, we can filter out documents that don't meet certain requirements before using kNN search.

### Preparing the index

Since we're using kNN search, we need to set the data type for the embedding field to `dense_vector`. Elasticsearch doesn't do this by itself like it does for other fields, so we have to do it manually.

```python
from elasticsearch import Elasticsearch

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
)
```

### Indexing documents

Let's use the `Apod` dataset, you can find it in [this GitHub repository](https://github.com/ImadSaddik/ElasticSearch_Python_Course/blob/main/data/apod.json). Start by reading the file.

```python
import json

with open("../data/apod.json") as f:
    documents = json.load(f)
```

Then, let's use an embedding model from Hugging Face. An embedding model converts text into a dense vector. I will use [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) in this tutorial; it is a small model that should work fine if you don't have a GPU.

First, make sure to install the `sentence_transformers` library in your python environment.

```bash
pip install sentence-transformers
```

Then, download the model from Hugging Face and pass it to the device. The code will automatically detect if you have a GPU or not.

```python
import torch
from sentence_transformers import SentenceTransformer

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SentenceTransformer("all-MiniLM-L6-v2")
model = model.to(device)
```

Let's use the model to embed the `explanation` field for all documents. We will also use the `bulk API` to index the documents in the `apod index`.

```python
from tqdm import tqdm

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

response = es.bulk(operations=operations)
```

If the indexing is successful, you should see `response["errors"]` as `False`.

### Pre-filtering & kNN search

Before using pre-filtering, let's use kNN search only. The following search query will use kNN search to find 10 documents that are very similar to the query.

```python
query = "What is a black hole?"
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
# Found 10 documents
```

Here we got 10 documents that are very similar to the query. Let's print the first 3 documents.

```python
for hit in result.body["hits"]["hits"][:3]:
    print(f"Score: {hit['_score']}")
    print(f"Title: {hit['_source']['title']}")
    print(f"Explanation: {hit['_source']['explanation']}")
    print("-" * 80)
```

```text
Score: 0.80657506
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
--------------------------------------------------------------------------------
```

Let's look at the years of the documents returned by the regular kNN search.

```python
for hit in result.body["hits"]["hits"]:
    print(f"Year: {hit['_source']['year']}")
```

We can see that the years are different.

```text
Year: 2024
Year: 2017
Year: 2019
Year: 2022
Year: 2018
Year: 2020
Year: 2024
Year: 2024
Year: 2022
Year: 2020
```

Let's run the same query, but this time we will use **pre-filtering** to filter the documents based on the year. Let's say we want to filter the documents to only include those from the year 2024.

We do this by adding a `filter` clause to the kNN query. The `filter` clause is a regular query that filters the documents before the kNN search is performed.

```python
query = "What is a black hole?"
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
# Found 10 documents
```

We still get 10 documents. Let's look at the year field in each document.

```python
for hit in result.body["hits"]["hits"]:
    print(f"Year: {hit['_source']['year']}")
```

As you can see, the documents returned are only from the year 2024.

```text
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
```

Let's look at the first 3 documents returned by the kNN search to confirm that they are similar to the query.

```python
for hit in result.body["hits"]["hits"][:3]:
    print(f"Score: {hit['_score']}")
    print(f"Title: {hit['_source']['title']}")
    print(f"Explanation: {hit['_source']['explanation']}")
    print("-" * 80)
```

```text
Score: 0.80657506
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
--------------------------------------------------------------------------------
```

---

## Conclusion

We've reached the end of this journey! I hope you had fun and learned a lot. I also hope I did a good job teaching you how to use Elasticsearch. It's a great tool that I really enjoy. Best of luck on your learning journey, and happy coding!
