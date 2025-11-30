import pytest

from models.search import SearchRequest
from tests.integration.conftest import IntegrationMeilisearchService


class TestSearch:
    @pytest.mark.asyncio
    async def test_search_returns_results(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        request = SearchRequest(articleType="blog-post", query="", size=10)
        response = await meilisearch_service.search(request)

        assert response is not None
        assert response.total_hits >= 0
        assert isinstance(response.hits, list)

    @pytest.mark.asyncio
    async def test_search_with_query(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        request = SearchRequest(articleType="blog-post", query="Elasticsearch", size=10)
        response = await meilisearch_service.search(request)

        assert response is not None
        assert isinstance(response.hits, list)

    @pytest.mark.asyncio
    async def test_search_returns_facets(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        request = SearchRequest(articleType="blog-post", query="Elasticsearch", size=10)
        response = await meilisearch_service.search(request)

        assert response.facet_distribution is not None
        assert hasattr(response.facet_distribution, "tags")
        assert hasattr(response.facet_distribution, "year")


class TestDocumentOperations:
    @pytest.mark.asyncio
    async def test_get_claps_count(
        self, meilisearch_service: IntegrationMeilisearchService, test_document_name: str
    ) -> None:
        result = await meilisearch_service.get_claps_count(test_document_name)

        assert "success" in result
        assert "claps_count" in result
        if result["success"]:
            assert isinstance(result["claps_count"], int)

    @pytest.mark.asyncio
    async def test_get_claps_count_not_found(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        result = await meilisearch_service.get_claps_count("non-existent-document-12345")

        assert result["success"] is False
        assert "not found" in result["message"].lower()

    @pytest.mark.asyncio
    async def test_increment_view_count(
        self, meilisearch_service: IntegrationMeilisearchService, test_document_name: str
    ) -> None:
        response = meilisearch_service.index.get_documents({"filter": f"name = '{test_document_name}'", "limit": 100})
        chunks = response.results
        assert chunks, "Test document must exist before incrementing view count."

        result = await meilisearch_service.increment_view_count(test_document_name)

        assert result["success"] is True
        assert "view_count" in result
        assert isinstance(result["view_count"], int)
        assert result["view_count"] > 0
        assert result["view_count"] == chunks[0].view_count + 1

    @pytest.mark.asyncio
    async def test_increment_view_count_not_found(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        result = await meilisearch_service.increment_view_count("non-existent-document-12345")

        assert result["success"] is False
        assert "not found" in result["message"].lower()

    @pytest.mark.asyncio
    async def test_increment_read_count(
        self, meilisearch_service: IntegrationMeilisearchService, test_document_name: str
    ) -> None:
        response = meilisearch_service.index.get_documents({"filter": f"name = '{test_document_name}'", "limit": 100})
        chunks = response.results
        assert chunks, "Test document must exist before incrementing read count."

        result = await meilisearch_service.increment_read_count(test_document_name)

        assert result["success"] is True
        assert "read_count" in result
        assert isinstance(result["read_count"], int)
        assert result["read_count"] > 0
        assert result["read_count"] == chunks[0].read_count + 1

    @pytest.mark.asyncio
    async def test_increment_read_count_not_found(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        result = await meilisearch_service.increment_read_count("non-existent-document-12345")

        assert result["success"] is False
        assert "not found" in result["message"].lower()

    @pytest.mark.asyncio
    async def test_increment_claps_count(
        self, meilisearch_service: IntegrationMeilisearchService, test_document_name: str
    ) -> None:
        response = meilisearch_service.index.get_documents({"filter": f"name = '{test_document_name}'", "limit": 100})
        chunks = response.results
        assert chunks, "Test document must exist before incrementing claps count."

        result = await meilisearch_service.increment_claps_count(test_document_name)

        assert result["success"] is True
        assert "claps_count" in result
        assert isinstance(result["claps_count"], int)
        assert result["claps_count"] > 0
        assert result["claps_count"] == chunks[0].claps_count + 1

    @pytest.mark.asyncio
    async def test_increment_claps_count_not_found(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        result = await meilisearch_service.increment_claps_count("non-existent-document-12345")

        assert result["success"] is False
        assert "not found" in result["message"].lower()


class TestRecommendations:
    @pytest.mark.asyncio
    async def test_get_article_recommendations(
        self, meilisearch_service: IntegrationMeilisearchService, test_document_name: str
    ) -> None:
        response = await meilisearch_service.get_article_recommendations(
            document_name_to_ignore=test_document_name, document_type="blog-post"
        )

        assert response is not None
        assert hasattr(response, "hits")
        assert hasattr(response, "total_hits")
        assert isinstance(response.hits, list)

        for hit in response.hits:
            assert hit.name != test_document_name


class TestLatestArticles:
    @pytest.mark.asyncio
    async def test_get_latest_articles(self, meilisearch_service: IntegrationMeilisearchService) -> None:
        response = await meilisearch_service.get_latest_articles(document_type="blog-post")

        assert response is not None
        assert hasattr(response, "hits")
        assert hasattr(response, "total_hits")
        assert isinstance(response.hits, list)
