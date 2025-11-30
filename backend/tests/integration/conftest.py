import meilisearch
import pytest
from meilisearch import Client

from core.config import settings
from services.meilisearch import MeilisearchService

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
]


def get_test_client() -> Client:
    return Client(url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY)


def delete_test_index_if_exists(client: Client) -> None:
    try:
        task = client.delete_index(TEST_INDEX_NAME)
        client.wait_for_task(task.task_uid)
        print(f"\nDeleted existing test index '{TEST_INDEX_NAME}'.")
    except meilisearch.errors.MeilisearchApiError:
        print(f"\nTest index '{TEST_INDEX_NAME}' does not exist. Skipping delete.")


def setup_test_index(client: Client) -> None:
    delete_test_index_if_exists(client)
    print(f"Creating test index '{TEST_INDEX_NAME}' with production-like settings...")

    task = client.create_index(TEST_INDEX_NAME, {"primaryKey": "id"})
    client.wait_for_task(task.task_uid)

    index = client.index(TEST_INDEX_NAME)
    task = index.update_settings(TEST_INDEX_SETTINGS)
    client.wait_for_task(task.task_uid)

    task = index.add_documents(TEST_DOCUMENTS)
    client.wait_for_task(task.task_uid)

    print(f"Test index '{TEST_INDEX_NAME}' setup complete with {len(TEST_DOCUMENTS)} documents.")


class IntegrationMeilisearchService(MeilisearchService):
    def __init__(self) -> None:
        self.client = Client(url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY)
        self.index = self.client.index(uid=TEST_INDEX_NAME)


@pytest.fixture(scope="session", autouse=True)
def setup_meilisearch_test_index() -> None:
    client = get_test_client()
    setup_test_index(client)


@pytest.fixture(scope="module")
def meilisearch_service() -> IntegrationMeilisearchService:
    return IntegrationMeilisearchService()


@pytest.fixture(scope="module")
def test_document_name() -> str:
    return "ElasticsearchPreFilteringWithKnnSearch"
