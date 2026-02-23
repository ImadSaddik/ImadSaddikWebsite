---
title: "Collapse search results in Elasticsearch"
subtitle: "How to show only the best documents for each group with collapsing."
date: "August 20, 2025"
tags: ["Elasticsearch"]
---

## Introduction

In this article, I will show you how to collapse search results. For a more detailed walkthrough, check out the video tutorial:

::: youtube [https://www.youtube.com/embed/znhN54KVqbY](https://www.youtube.com/embed/znhN54KVqbY)
:::

You can also find all related notebooks and slides in my [GitHub repository](https://github.com/ImadSaddik/ElasticSearch_Python_Course).

## Collapse search results

`Collapsing` is a cool feature that helps you show only the best document for each `group`. A group is a unique value in a field. Let's index some documents in order to demonstrate how collapse works in Elasticsearch.

### Indexing documents

Let's use the `Apod` dataset, you can find it in [this GitHub repository](https://github.com/ImadSaddik/ElasticSearch_Python_Course/blob/main/data/apod.json). Start by reading the file.

```python
import json

with open("../data/apod.json") as f:
    documents = json.load(f)
```

Then, create an index.

```python
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

es.indices.delete(index="apod", ignore_unavailable=True)
es.indices.create(index="apod")
```

Use the `bulk API` to index the documents in the `apod index`.

```python
from tqdm import tqdm

operations = []
index_name = "apod"
for document in tqdm(documents, total=len(documents), desc="Indexing documents"):
    year = document["date"].split("-")[0]
    document["year"] = int(year)

    operations.append({"index": {"_index": index_name}})
    operations.append(document)

response = es.bulk(operations=operations)
response["errors"]
```

If the indexing is successful, you should see `response["errors"]` as `False` .

### Collapsing

Now, let's search for documents where `Andromeda galaxy` appears in the title.

```python
response_no_collapsing = es.search(
    index="apod",
    body={
        "query": {"match": {"title": "Andromeda galaxy"}},
        "size": 10_000,
    },
)
total_hits = response_no_collapsing["hits"]["total"]["value"]
print(f"Total hits before collapsing: {total_hits}")
total_returned_hits = len(response_no_collapsing["hits"]["hits"])
print(f"Total returned hits before collapsing: {total_returned_hits}")
```

Without collapsing, the search results will return all documents that match the query. In this case, the number is 270 documents.

```output
Total hits before collapsing: 270
Total returned hits before collapsing: 270
```

Let's look at the count of documents that matched the query per year in the `apod index`.

```python
from elastic_transport import ObjectApiResponse

def get_hits_per_year(response: ObjectApiResponse) -> dict:
    hits_per_year_count = {}
    for hit in response["hits"]["hits"]:
        year = hit["_source"]["year"]
        if year not in hits_per_year_count:
            hits_per_year_count[year] = 0
        hits_per_year_count[year] += 1
    return hits_per_year_count

print("Hits per year count:")
print(get_hits_per_year(response_no_collapsing))
```

We observe that we have a lot of documents per year. What would happen if we collapse the search results by year?

```output
Hits per year count:
{
        2015: 28,
        2016: 29,
        2017: 31,
        2018: 19,
        2019: 32,
        2020: 25,
        2021: 24,
        2022: 30,
        2023: 32,
        2024: 20,
}
```

Collapsing search results by year will return only one document per year that matches the query. That returned document will be the one with the highest `_score` for that year.

```python
response_collapsing = es.search(
    index="apod",
    body={
        "query": {"match": {"title": "Andromeda galaxy"}},
        "collapse": {"field": "year"},
        "size": 10_000,
    },
)
total_hits = response_collapsing["hits"]["total"]["value"]
print(f"Total hits before collapsing: {total_hits}")
total_returned_hits = len(response_collapsing["hits"]["hits"])
print(f"Total returned hits after collapsing: {total_returned_hits}")
```

Now, we got 10 documents after collapsing the search results.

```output
Total hits before collapsing: 270
Total returned hits after collapsing: 10
```

Let's print the number of documents per year.

```python
print("Hits per year count:")
print(get_hits_per_year(response_collapsing))
```

Now we have only one document per year that matches the query.

```output
Hits per year count:
{
        2015: 1,
        2016: 1,
        2017: 1,
        2018: 1,
        2019: 1,
        2020: 1,
        2021: 1,
        2022: 1,
        2023: 1,
        2024: 1,
}
```

Let's verify if the document in year 2024 is the one with the highest `_score`.

```python
for hit in response_collapsing["hits"]["hits"]:
    year = hit["_source"]["year"]
    if year == 2024:
        score = hit["_score"]
        print(f"Document with a score of {score} for year {year}:")
        print(hit["_source"])
        break
```

From the response with collapsing, we can see that the document in year 2024 has a `_score` of `7.789091`.

```output
Document with a score of 7.789091 for year 2024:

{
    "authors": "Subaru, Hubble, Mayall, R. Gendler, R. Croman",
    "date": "2024-09-08",
    "explanation": "Explanation: The most distant object easily visible to the unaided eye is M31, the great Andromeda Galaxy. Even at some two and a half million light-years distant, this immense spiral galaxy -- spanning over 200,000 light years -- is visible, although as a faint, nebulous cloud in the constellation Andromeda. A bright yellow nucleus, dark winding dust lanes, and expansive spiral arms dotted with blue star clusters and red nebulae, are recorded in this stunning telescopic image which combines data from orbiting Hubble with ground-based images from Subaru and Mayall. In only about 5 billion years, the Andromeda galaxy may be even easier to see -- as it will likely span the entire night sky -- just before it merges with, or passes right by, our Milky Way Galaxy.",
    "image_url": "https://apod.nasa.gov/apod/image/2409/M31_HstSubaruGendler_960.jpg",
    "title": "M31: The Andromeda Galaxy",
    "year": 2024,
}
```

Let's look at the scores in the response without collapsing.

```python
for hit in response_no_collapsing["hits"]["hits"]:
    year = hit["_source"]["year"]
    if year == 2024:
        score = hit["_score"]
        print(f"Score {score}:")
        print(hit["_source"])
        print("-" * 50)
```

We confirm that the first hit from 2024 has a `_score` of `7.789091`, which is the same as the one in the response with collapsing.

```output
Score 7.789091:
{
    "authors": "Subaru, Hubble, Mayall, R. Gendler, R. Croman",
    "date": "2024-09-08",
    "explanation": "Explanation: The most distant object easily visible to the unaided eye is M31, the great Andromeda Galaxy. Even at some two and a half million light-years distant, this immense spiral galaxy -- spanning over 200,000 light years -- is visible, although as a faint, nebulous cloud in the constellation Andromeda. A bright yellow nucleus, dark winding dust lanes, and expansive spiral arms dotted with blue star clusters and red nebulae, are recorded in this stunning telescopic image which combines data from orbiting Hubble with ground-based images from Subaru and Mayall. In only about 5 billion years, the Andromeda galaxy may be even easier to see -- as it will likely span the entire night sky -- just before it merges with, or passes right by, our Milky Way Galaxy.",
    "image_url": "https://apod.nasa.gov/apod/image/2409/M31_HstSubaruGendler_960.jpg",
    "title": "M31: The Andromeda Galaxy",
    "year": 2024,
}
--------------------------------------------------
Score 3.0710938:
{
    "authors": "Aman Chokshi",
    "date": "2024-07-14",
    "explanation": "Explanation: The galaxy was never in danger. For one thing, the Triangulum galaxy (M33), pictured, is much bigger than the tiny grain of rock at the head of the meteor. For another, the galaxy is much farther away -- in this instance 3 million light years as opposed to only about 0.0003 light seconds. Even so, the meteor's path took it angularly below the galaxy. Also the wind high in Earth's atmosphere blew the meteor's glowing evaporative molecule train away from the galaxy, in angular projection. Still, the astrophotographer was quite lucky to capture both a meteor and a galaxy in a single exposure -- which was subsequently added to two other images of M33 to bring up the spiral galaxy's colors. At the end, the meteor was gone in a second, but the galaxy will last billions of years.",
    "image_url": "https://apod.nasa.gov/apod/image/2407/M33Meteor_Chokshi_960.jpg",
    "title": "Meteor Misses Galaxy",
    "year": 2024,
}
--------------------------------------------------
Score 2.792822:
{
    "authors": "John Hayes",
    "date": "2024-11-01",
    "explanation": "Explanation: Big, beautiful spiral galaxy NGC 6744 is nearly 175,000 light-years across, larger than our own Milky Way. It lies some 30 million light-years distant in the southern constellation Pavo but appears as only a faint smudge in the eyepiece of a small telescope. We see the disk of the nearby island universe tilted towards our line of sight in this remarkably deep and detailed galaxy portrait, a telescopic image that spans an area about the angular size of a full moon. In it, the giant galaxy's elongated yellowish core is dominated by the light from old, cool stars. Beyond the core, grand spiral arms are filled with young blue star clusters and speckled with pinkish star forming regions. An extended arm sweeps past smaller satellite galaxy NGC 6744A at the upper left. NGC 6744's galactic companion is reminiscent of the Milky Way's satellite galaxy the Large Magellanic Cloud.",
    "title": "Spiral Galaxy NGC 6744",
    "year": 2024,
}
...
```

### Expanding collapsed results

Expanding collapsed results allows you to retrieve more than one document per year that matches the query. Control how documents are sorted within each collapsed group, and more.

To expand the results, we add `inner_hits` to `collapse`. The name `most_recent` will be used to extract those documents from the response object. `size` controls the number of documents that we want to retrieve.

```python
response_collapsing = es.search(
    index="apod",
    body={
        "query": {"match": {"title": "Andromeda galaxy"}},
        "collapse": {
            "field": "year",
            "inner_hits": {
                "name": "most_recent",
                "size": 3,  # Number of documents to return per collapsed group
            },
        },
        "size": 10_000,
    },
)
total_hits = response_collapsing["hits"]["total"]["value"]
print(f"Total hits before collapsing: {total_hits}")
total_returned_hits = len(response_collapsing["hits"]["hits"])
print(f"Total returned hits after collapsing: {total_returned_hits}")
inner_hits = response_collapsing["hits"]["hits"][0]["inner_hits"]["most_recent"]
total_returned_hits_after_expanding = len(inner_hits["hits"]["hits"])
print(f"Total returned hits after expanding: {total_returned_hits_after_expanding}")
```

Total documents without collapsing is 270. After collapsing, that number is reduced to 10 because we get one document per year.

For each year, we get 3 documents inside the `inner_hits` field.

```output
Total hits before collapsing: 270
Total returned hits after collapsing: 10
Total returned hits after expanding: 3
```

Let's see how many documents we have in a single year.

```python
print("Hits per year count:")
print(get_hits_per_year(inner_hits))
```

We get 3 documents.

```output
Hits per year count:
{2024: 3}
```

The documents are sorted by `_score` within each collapsed group. They also match the scores in the response without collapsing.

```python
for hit in inner_hits["hits"]["hits"]:
    score = hit["_score"]
    print(f"Score: {score}")
```

```output
Score: 7.789091
Score: 3.0710938
Score: 2.792822
```

### Collapsing with search_after

When collapsing on a field with a lot of unique values, you can use the `search_after` parameter to paginate through the results. This is useful when you want to retrieve all collapsed results without missing any.

::: info
You can't use the `scroll API` with collapsing. Use `search_after` instead.
:::

Let's create a new index where we are going to create 40 000 documents. Each user, will have 2 documents.

```python
documents = []
number_of_unique_user_ids = 20_000
for user_id in range(number_of_unique_user_ids):
    for i in range(2):
        documents.append(
            {
                "user_id": user_id,
                "title": f"Document {i} for user {user_id}",
                "content": f"This is the content of document {i} for user {user_id}.",
            }
        )

es.indices.delete(index="my_index", ignore_unavailable=True)
es.indices.create(index="my_index")

operations = []
for document in tqdm(documents, total=len(documents), desc="Indexing documents"):
    operations.append({"index": {"_index": "my_index"}})
    operations.append(document)

response = es.bulk(operations=operations)
response["errors"]
```

```output
Indexing documents: 100%|██████████| 40000/40000 [00:00<00:00, 1809508.07it/s]

False
```

Let's confirm that we have 40 000 documents in the index.

```python
document_count = es.count(index="my_index")
print(f"Total documents indexed: {document_count['count']}")
```

```output
Total documents indexed: 40000
```

Now we are ready to use `search_after` to paginate through the collapsed results. Since we have 2 documents per user, we can expect to have 20 000 collapsed results.

```python
collapsed_hits = []
search_after = None

while True:
    body = {
        "query": {"match": {"content": "document"}},
        "collapse": {"field": "user_id"},
        "sort": ["user_id"],
        "size": 10_000,
    }

    if search_after is not None:
        body["search_after"] = [search_after]

    response_collapsing = es.search(index="my_index", body=body)
    hits = response_collapsing["hits"]["hits"]

    if not hits:
        break

    search_after = hits[-1]["_source"]["user_id"]
    print(f"Last user ID: {search_after}")

    collapsed_hits.extend(hits)

print(f"Total collapsed hits: {len(collapsed_hits)}")
```

```output
Last user ID: 9999
Last user ID: 19999
Total collapsed hits: 20000
```

We see that the last user ID in the collapsed results is `19999` and the number of collapsed hits is `20000`, which is what we expected.

## Conclusion

In this article, we explored how `collapsing` search results works in `Elasticsearch`. This feature helps you refine your search output by showing only the most relevant document from each `group`, like getting just one top result per year.

We learned how `collapsing` reduces the number of returned hits for a cleaner view, and how `inner_hits` can expand those results to show more details within each group.

For large datasets, we also saw that `search_after` is the way to paginate through collapsed results, especially when the `scroll API` isn't suitable. Understanding `collapsing` can really help you make your `Elasticsearch` searches more efficient and your data easier to work with.
