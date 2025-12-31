from unittest.mock import AsyncMock, patch

from models.search import FacetDistribution, SearchHit, SearchResponse


@patch("api.search.meilisearch_service")
def test_search_articles(mock_service, client):
    mock_hit = SearchHit(
        id="1",
        name="search-1",
        title="Search 1",
        content="Content",
        type="blog-post",
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
        "article_type": "blog-post",
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
