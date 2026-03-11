from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from enums.article import ArticleType
from enums.search import SortableField, SortOrder
from models.article import RecommendationArticleRequest
from models.search import SearchFilters, SearchRequest, SearchSortBy
from services.meilisearch import MeilisearchService


def test_get_filter_conditions():
    service = MeilisearchService()

    article_type = ArticleType.BLOG_POST
    request = SearchRequest(article_type=article_type)
    assert service.get_filter_conditions(request) == f"type = '{article_type.value}'"

    request = SearchRequest(article_type=article_type, filters=SearchFilters(years=["2023"]))
    assert service.get_filter_conditions(request) == f"type = '{article_type.value}' AND year IN ['2023']"

    request = SearchRequest(article_type=article_type, filters=SearchFilters(tags=["tag1", "tag2"]))
    assert service.get_filter_conditions(request) == f"type = '{article_type.value}' AND tags IN ['tag1', 'tag2']"


def test_get_sorting_criteria():
    service = MeilisearchService()

    request = SearchRequest(article_type=ArticleType.BLOG_POST)
    assert service.get_sorting_criteria(request) == [f"creation_date:{SortOrder.DESC.value}"]

    request = SearchRequest(
        article_type=ArticleType.BLOG_POST, sort_by=SearchSortBy(field=SortableField.POPULARITY, order=SortOrder.ASC)
    )
    assert service.get_sorting_criteria(request) == [f"view_count:{SortOrder.ASC.value}"]


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_search(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_results = MagicMock()
    mock_results.hits = []
    mock_results.estimated_total_hits = 0
    mock_results.facet_distribution = {}
    mock_results.processing_time_ms = 1
    mock_index.search = AsyncMock(return_value=mock_results)

    article_type = ArticleType.BLOG_POST
    request = SearchRequest(article_type=article_type, query="test")
    response = await service.search(request)

    assert response.total_hits == 0
    mock_index.search.assert_called_once()
    call_args = mock_index.search.call_args
    assert call_args.kwargs["query"] == "test"
    assert f"type = '{article_type.value}'" in call_args.kwargs["filter"]


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_increment_view_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = {"id": "123", "view_count": 10}
    mock_response = MagicMock()
    mock_response.results = [mock_doc]
    mock_index.get_documents = AsyncMock(return_value=mock_response)
    mock_index.update_documents = AsyncMock(return_value={"taskUid": 1})

    result = await service.increment_view_count("test-doc")

    assert result["success"] is True
    assert result["view_count"] == 11
    mock_index.update_documents.assert_called_once_with([{"id": "123", "view_count": 11}])


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_increment_view_count_not_found(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()
    mock_response = MagicMock()
    mock_response.results = []
    mock_index.get_documents = AsyncMock(return_value=mock_response)

    result = await service.increment_view_count("test-doc")

    assert result["success"] is False
    assert result["message"] == "Document not found"


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_increment_read_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = {"id": "123", "read_count": 5}
    mock_response = MagicMock()
    mock_response.results = [mock_doc]
    mock_index.get_documents = AsyncMock(return_value=mock_response)
    mock_index.update_documents = AsyncMock(return_value={"taskUid": 1})

    result = await service.increment_read_count("test-doc")

    assert result["success"] is True
    assert result["read_count"] == 6
    mock_index.update_documents.assert_called_once_with([{"id": "123", "read_count": 6}])


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_increment_claps_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = {"id": "123", "claps_count": 20}
    mock_response = MagicMock()
    mock_response.results = [mock_doc]
    mock_index.get_documents = AsyncMock(return_value=mock_response)
    mock_index.update_documents = AsyncMock(return_value={"taskUid": 1})

    result = await service.increment_claps_count("test-doc")

    assert result["success"] is True
    assert result["claps_count"] == 21
    mock_index.update_documents.assert_called_once_with([{"id": "123", "claps_count": 21}])


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_get_article_recommendations(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    article_type = ArticleType.BLOG_POST
    service = MeilisearchService()

    mock_hit = {
        "id": "1",
        "name": "rec-1",
        "title": "Rec 1",
        "content": "Content",
        "type": article_type.value,
        "year": "2023",
        "tags": ["tag1"],
        "creation_date": 1234567890,
        "view_count": 10,
        "read_count": 5,
        "claps_count": 2,
    }
    mock_response = MagicMock()
    mock_response.results = [mock_hit]
    mock_index.get_documents = AsyncMock(return_value=mock_response)

    request = RecommendationArticleRequest(
        document_name_to_ignore="current", article_type=article_type, document_tags=["tag1", "tag2"]
    )
    response = await service.get_article_recommendations(request)

    assert response.total_hits == 1
    assert response.hits[0].name == "rec-1"
    assert response.hits[0].title == "Rec 1"
    assert response.hits[0].content == "Content"
    assert response.hits[0].type == article_type.value
    assert response.hits[0].year == "2023"
    assert response.hits[0].tags == ["tag1"]
    assert response.hits[0].creation_date == 1234567890
    assert response.hits[0].view_count == 10
    assert response.hits[0].read_count == 5
    assert response.hits[0].claps_count == 2


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_get_latest_articles(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    article_type = ArticleType.BLOG_POST
    service = MeilisearchService()

    mock_hit = {
        "id": "2",
        "name": "latest-1",
        "title": "Latest 1",
        "content": "Content",
        "type": article_type.value,
        "year": "2023",
        "tags": ["tag2"],
        "creation_date": 1234567890,
        "view_count": 100,
        "read_count": 50,
        "claps_count": 20,
    }
    mock_response = MagicMock()
    mock_response.results = [mock_hit]
    mock_index.get_documents = AsyncMock(return_value=mock_response)

    response = await service.get_latest_articles(document_type=article_type.value)

    assert response.total_hits == 1
    assert response.hits[0].name == "latest-1"
    assert response.hits[0].title == "Latest 1"
    assert response.hits[0].content == "Content"
    assert response.hits[0].type == article_type.value
    assert response.hits[0].year == "2023"
    assert response.hits[0].tags == ["tag2"]
    assert response.hits[0].creation_date == 1234567890
    assert response.hits[0].view_count == 100
    assert response.hits[0].read_count == 50
    assert response.hits[0].claps_count == 20


@patch("services.meilisearch.AsyncClient")
@pytest.mark.asyncio
async def test_get_claps_count(mock_client_class):
    mock_client = MagicMock()
    mock_index = MagicMock()
    mock_client.index.return_value = mock_index
    mock_client_class.return_value = mock_client

    service = MeilisearchService()

    mock_doc = {"claps_count": 15}
    mock_response = MagicMock()
    mock_response.results = [mock_doc]
    mock_index.get_documents = AsyncMock(return_value=mock_response)

    result = await service.get_claps_count("test-doc")

    assert result["success"] is True
    assert result["message"] == "Claps count retrieved successfully"
    assert result["claps_count"] == 15


@pytest.mark.parametrize(
    "input_text, expected_output",
    [
        ("O'Reilly", "O\\'Reilly"),
        ("Test\\", "Test\\\\"),
        ("\\'", "\\\\\\'"),
        ("", ""),
        ("no quotes", "no quotes"),
        ("'''", "\\'\\'\\'"),
        ('"""', '\\"\\"\\"'),
        ("\\\\\\", "\\\\\\\\\\\\"),
        ('I\'m a "test"', 'I\\\'m a \\"test\\"'),
        ("Complex'One\\And\"Two\\\\", "Complex\\'One\\\\And\\\"Two\\\\\\\\"),
        ("✨Unicode'Check✨", "✨Unicode\\'Check✨"),
        ("   '   ", "   \\'   "),
        ("\n'\t", "\n\\'\t"),
    ],
)
def test_sanitize_logic(input_text, expected_output):
    service = MeilisearchService()
    assert service._sanitize(input_text) == expected_output
