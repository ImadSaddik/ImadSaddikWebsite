export const bashCodeSnippet1 = "pip install sentence-transformers";

export const pythonCodeSnippet1 = `from elasticsearch import Elasticsearch

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
)`;

export const pythonCodeSnippet2 = `import json

with open("../data/apod.json") as f:
documents = json.load(f))`;

export const pythonCodeSnippet3 = `import torch
from sentence_transformers import SentenceTransformer

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SentenceTransformer("all-MiniLM-L6-v2")
model = model.to(device)`;

export const pythonCodeSnippet4 = `from tqdm import tqdm

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

response = es.bulk(operations=operations)`;

export const pythonCodeSnippet5 = `query = "What is a black hole?"
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
# Found 10 documents`;

export const pythonCodeSnippet6 = `for hit in result.body["hits"]["hits"][:3]:
    print(f"Score: {hit['_score']}")
    print(f"Title: {hit['_source']['title']}")
    print(f"Explanation: {hit['_source']['explanation']}")
    print("-" * 80)`;

export const pythonCodeSnippet7 = `for hit in result.body["hits"]["hits"]:
    print(f"Year: {hit['_source']['year']}")`;

export const pythonCodeSnippet8 = `query = "What is a black hole?"
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
# Found 10 documents`;

export const codeOutput1 = `Score: 0.80657506
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
--------------------------------------------------------------------------------`;

export const codeOutput2 = `Year: 2024
Year: 2017
Year: 2019
Year: 2022
Year: 2018
Year: 2020
Year: 2024
Year: 2024
Year: 2022
Year: 2020`;

export const codeOutput3 = `Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024
Year: 2024`;

export const codeOutput4 = `Score: 0.80657506
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
--------------------------------------------------------------------------------`;
