import pytest
from meilisearch import Client

from core.config import settings
from services.meilisearch import MeilisearchService
from tests.test_data import TEST_INDEX_NAME, get_test_client, setup_test_index


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
    return "elasticsearch-pre-filtering-with-knn-search"
