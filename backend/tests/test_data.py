import meilisearch
from meilisearch import Client

from core.config import settings
from logger import logger

TEST_INDEX_NAME = "articles_test"

# This must mirror the production index settings.
TEST_INDEX_SETTINGS = {
    "displayedAttributes": ["*"],
    "searchableAttributes": ["title", "content"],
    "filterableAttributes": ["type", "year", "tags", "name"],
    "sortableAttributes": ["claps_count", "creation_date", "read_count", "view_count"],
    "rankingRules": ["words", "typo", "proximity", "attribute", "sort", "exactness"],
    "stopWords": [],
    "nonSeparatorTokens": [],
    "separatorTokens": [],
    "dictionary": [],
    "synonyms": {},
    "distinctAttribute": None,
    "proximityPrecision": "byWord",
    "typoTolerance": {
        "enabled": True,
        "minWordSizeForTypos": {"oneTypo": 5, "twoTypos": 9},
        "disableOnWords": [],
        "disableOnAttributes": [],
        "disableOnNumbers": False,
    },
    "faceting": {"maxValuesPerFacet": 100, "sortFacetValuesBy": {"*": "alpha"}},
    "pagination": {"maxTotalHits": 1000},
    "searchCutoffMs": None,
    "facetSearch": True,
    "prefixSearch": "indexingTime",
}

TEST_DOCUMENTS = [
    {
        "id": "1",
        "name": "ElasticsearchPreFilteringWithKnnSearch",
        "title": "Pre-filtering with KNN Search in Elasticsearch",
        "content": "Learn how to use pre-filtering with KNN search in Elasticsearch for better results.",
        "type": "blog-post",
        "year": "2024",
        "tags": ["elasticsearch", "knn", "search"],
        "creation_date": 1700000000,
        "view_count": 100,
        "read_count": 50,
        "claps_count": 10,
    },
    {
        "id": "2",
        "name": "ElasticsearchCollapseSearchResults",
        "title": "Collapse Search Results in Elasticsearch",
        "content": "How to collapse search results in Elasticsearch to group similar documents.",
        "type": "blog-post",
        "year": "2024",
        "tags": ["elasticsearch", "collapse", "search"],
        "creation_date": 1699000000,
        "view_count": 80,
        "read_count": 40,
        "claps_count": 5,
    },
    {
        "id": "3",
        "name": "ElasticsearchChangeHeapSize",
        "title": "Change Heap Size in Elasticsearch",
        "content": "Guide to changing heap size in Elasticsearch for optimal performance.",
        "type": "blog-post",
        "year": "2023",
        "tags": ["elasticsearch", "performance", "configuration"],
        "creation_date": 1680000000,
        "view_count": 200,
        "read_count": 100,
        "claps_count": 20,
    },
    {
        "id": "4",
        "name": "VueJsForBeginners",
        "title": "Vue.js for Beginners",
        "content": "Getting started with Vue.js framework for building modern web applications.",
        "type": "course-post",
        "year": "2024",
        "tags": ["vue", "javascript", "frontend"],
        "creation_date": 1698000000,
        "view_count": 320,
        "read_count": 150,
        "claps_count": 45,
    },
    {
        "id": "5",
        "name": "FastAPITutorial",
        "title": "Building APIs with FastAPI",
        "content": "Learn how to build fast and modern APIs using Python and FastAPI.",
        "type": "course-post",
        "year": "2024",
        "tags": ["python", "fastapi", "api"],
        "creation_date": 1695000000,
        "view_count": 400,
        "read_count": 200,
        "claps_count": 60,
    },
    {
        "id": "6",
        "name": "OrionConstellation",
        "title": "Exploring the Orion Constellation",
        "content": "A journey through the stars of Orion, one of the most recognizable constellations.",
        "type": "astronomy-post",
        "year": "2024",
        "tags": ["astronomy", "constellations", "stars"],
        "creation_date": 1697000000,
        "view_count": 150,
        "read_count": 75,
        "claps_count": 20,
    },
    {
        "id": "7",
        "name": "MoonPhases",
        "title": "Understanding Moon Phases",
        "content": "Learn about the different phases of the Moon and why they occur.",
        "type": "astronomy-post",
        "year": "2023",
        "tags": ["astronomy", "moon", "lunar"],
        "creation_date": 1675000000,
        "view_count": 280,
        "read_count": 140,
        "claps_count": 30,
    },
]


def get_test_client() -> Client:
    return Client(url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY)


def delete_test_index_if_exists(client: Client) -> None:
    try:
        task = client.delete_index(TEST_INDEX_NAME)
        client.wait_for_task(task.task_uid)
        logger.info(f"Deleted existing test index '{TEST_INDEX_NAME}'.")
    except meilisearch.errors.MeilisearchApiError:
        logger.info(f"Test index '{TEST_INDEX_NAME}' does not exist. Skipping delete.")


def setup_test_index(client: Client) -> None:
    delete_test_index_if_exists(client)
    logger.info(f"Creating test index '{TEST_INDEX_NAME}' with production-like settings...")

    task = client.create_index(TEST_INDEX_NAME, {"primaryKey": "id"})
    client.wait_for_task(task.task_uid)

    index = client.index(TEST_INDEX_NAME)
    task = index.update_settings(TEST_INDEX_SETTINGS)
    client.wait_for_task(task.task_uid)

    task = index.add_documents(TEST_DOCUMENTS)
    client.wait_for_task(task.task_uid)

    logger.info(f"Test index '{TEST_INDEX_NAME}' setup complete with {len(TEST_DOCUMENTS)} documents.")


def seed_test_data() -> None:
    logger.info(f"Connecting to Meilisearch at {settings.MEILISEARCH_URL}...")
    client = get_test_client()
    setup_test_index(client)

    index = client.index(TEST_INDEX_NAME)
    stats = index.get_stats()
    logger.info(f"Index now contains {stats.number_of_documents} documents.")
    logger.info("Test data seeding complete!")


if __name__ == "__main__":
    seed_test_data()
