from unittest.mock import AsyncMock, patch

from enums.article import ArticleType
from models.search import FacetDistribution, SearchHit, SearchResponse


@patch("api.search.meilisearch_service")
def test_search_articles(mock_service, client):
    mock_hit = SearchHit(
        id="1",
        name="search-1",
        title="Search 1",
        content="Content",
        type=ArticleType.BLOG_POST.value,
        year="2023",
        tags=["tag1"],
        creation_date=1234567890,
        view_count=10,
        read_count=5,
        claps_count=2,
        ranking_score=0.9,
    )
    mock_response = SearchResponse(
        hits=[mock_hit],
        total_hits=1,
        facet_distribution=FacetDistribution(tags={"tag1": 1}, year={"2023": 1}),
        processing_time_ms=10,
    )
    mock_service.search = AsyncMock(return_value=mock_response)

    payload = {
        "query": "test",
        "article_type": ArticleType.BLOG_POST,
        "filters": {"years": ["2023"], "tags": ["tag1"]},
        "size": 5,
    }
    response = client.post("/api/search", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["total_hits"] == 1
    assert data["hits"][0]["name"] == "search-1"
    assert mock_service.search.called
    assert data["hits"][0]["name"] == "search-1"
    assert mock_service.search.called


def test_search_filter_injection_attempt(client):
    """
    Verify that injection attempts in 'tags' are sanitized
    and do NOT leak data or crash the server.
    """

    # The payload attempts to break out of the tags list and dump all data
    payload = {"query": "", "filters": {"tags": ["'] OR type != 'nothing' OR tags IN ['"]}}
    response = client.post("/api/search", json=payload)

    assert response.status_code == 200

    data = response.json()
    assert data["total_hits"] == 0
    assert len(data["hits"]) == 0


def test_search_year_validation(client):
    """
    Verify that invalid years are rejected by Pydantic validation.
    """
    payload = {"filters": {"years": ["2025' OR 1=1"]}}
    response = client.post("/api/search", json=payload)

    assert response.status_code == 422
    assert "Year must be a 4-digit number" in response.json()["detail"][0]["msg"]


def test_search_backslash_sanitization(client):
    """
    Verify that backslashes are escaped and do not cause a Syntax Error (500).
    """
    payload = {"query": "", "filters": {"tags": ["test\\"]}}
    response = client.post("/api/search", json=payload)

    data = response.json()
    assert response.status_code == 200
    assert data["total_hits"] == 0
