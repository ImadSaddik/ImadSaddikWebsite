from unittest.mock import MagicMock, patch

import pytest

from models.search import SearchFilters, SearchRequest, SearchSortBy, SortableFields
from services.meilisearch import MeilisearchService


def test_get_filter_conditions():
    service = MeilisearchService()

    request = SearchRequest(articleType="blog-post")
    assert service.get_filter_conditions(request) == 'type = "blog-post"'

    request = SearchRequest(articleType="blog-post", filters=SearchFilters(years=["2023"]))
    assert service.get_filter_conditions(request) == "type = \"blog\" AND year IN ['2023']"

    request = SearchRequest(articleType="blog-post", filters=SearchFilters(tags=["tag1", "tag2"]))
    assert service.get_filter_conditions(request) == "type = \"blog\" AND tags IN ['tag1', 'tag2']"


def test_get_sorting_criteria():
    service = MeilisearchService()

    request = SearchRequest(articleType="blog-post")
    assert service.get_sorting_criteria(request) == ["creation_date:desc"]

    request = SearchRequest(articleType="blog-post", sortBy=SearchSortBy(field=SortableFields.POPULARITY, order="asc"))
    assert service.get_sorting_criteria(request) == ["view_count:asc"]


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_search(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_index.search.return_value = {
        "hits": [],
        "estimatedTotalHits": 0,
        "facetDistribution": {},
        "processingTimeMs": 1,
    }

    request = SearchRequest(articleType="blog-post", query="test")
    response = await service.search(request)

    assert response.total_hits == 0
    mock_index.search.assert_called_once()
    call_args = mock_index.search.call_args
    assert call_args.kwargs["query"] == "test"
    assert 'type = "blog-post"' in call_args.kwargs["opt_params"]["filter"]


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_increment_view_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = MagicMock()
    mock_doc.id = "123"
    mock_doc.view_count = 10
    mock_index.get_documents.return_value.results = [mock_doc]
    mock_index.update_documents.return_value = {"taskUid": 1}

    result = await service.increment_view_count("test-doc")

    assert result["success"] is True
    assert result["view_count"] == 11
    mock_index.update_documents.assert_called_once_with([{"id": "123", "view_count": 11}])


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_increment_view_count_not_found(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()
    mock_index.get_documents.return_value.results = []

    result = await service.increment_view_count("test-doc")

    assert result["success"] is False
    assert result["message"] == "Document not found"


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_increment_read_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = MagicMock()
    mock_doc.id = "123"
    mock_doc.read_count = 5
    mock_index.get_documents.return_value.results = [mock_doc]

    result = await service.increment_read_count("test-doc")

    assert result["success"] is True
    assert result["read_count"] == 6
    mock_index.update_documents.assert_called_once_with([{"id": "123", "read_count": 6}])


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_increment_claps_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = MagicMock()
    mock_doc.id = "123"
    mock_doc.claps_count = 20
    mock_index.get_documents.return_value.results = [mock_doc]

    result = await service.increment_claps_count("test-doc")

    assert result["success"] is True
    assert result["claps_count"] == 21
    mock_index.update_documents.assert_called_once_with([{"id": "123", "claps_count": 21}])


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_get_article_recommendations(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_hit = MagicMock()
    mock_hit.id = "1"
    mock_hit.name = "rec-1"
    mock_hit.title = "Rec 1"
    mock_hit.content = "Content"
    mock_hit.type = "blog-post"
    mock_hit.year = "2023"
    mock_hit.tags = ["tag1"]
    mock_hit.creation_date = 1234567890
    mock_hit.view_count = 10
    mock_hit.read_count = 5
    mock_hit.claps_count = 2

    mock_index.get_documents.return_value.results = [mock_hit]

    response = await service.get_article_recommendations("current", "blog-post")

    assert response.total_hits == 1
    assert response.hits[0].name == "rec-1"
    assert response.hits[0].title == "Rec 1"
    assert response.hits[0].content == "Content"
    assert response.hits[0].type == "blog-post"
    assert response.hits[0].year == "2023"
    assert response.hits[0].tags == ["tag1"]
    assert response.hits[0].creation_date == 1234567890
    assert response.hits[0].view_count == 10
    assert response.hits[0].read_count == 5
    assert response.hits[0].claps_count == 2


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_get_latest_articles(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_hit = MagicMock()
    mock_hit.id = "2"
    mock_hit.name = "latest-1"
    mock_hit.title = "Latest 1"
    mock_hit.content = "Content"
    mock_hit.type = "blog-post"
    mock_hit.year = "2023"
    mock_hit.tags = ["tag2"]
    mock_hit.creation_date = 1234567890
    mock_hit.view_count = 100
    mock_hit.read_count = 50
    mock_hit.claps_count = 20

    mock_index.get_documents.return_value.results = [mock_hit]

    response = await service.get_latest_articles("blog-post")

    assert response.total_hits == 1
    assert response.hits[0].name == "latest-1"
    assert response.hits[0].title == "Latest 1"
    assert response.hits[0].content == "Content"
    assert response.hits[0].type == "blog-post"
    assert response.hits[0].year == "2023"
    assert response.hits[0].tags == ["tag2"]
    assert response.hits[0].creation_date == 1234567890
    assert response.hits[0].view_count == 100
    assert response.hits[0].read_count == 50
    assert response.hits[0].claps_count == 20


@patch("services.meilisearch.meilisearch.Client")
@pytest.mark.asyncio
async def test_get_claps_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = MagicMock()
    mock_doc.claps_count = 15
    mock_index.get_documents.return_value.results = [mock_doc]

    result = await service.get_claps_count("test-doc")

    assert result["success"] is True
    assert result["message"] == "Claps count retrieved successfully"
    assert result["claps_count"] == 15
