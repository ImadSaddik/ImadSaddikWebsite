from unittest.mock import AsyncMock, patch

from enums.article import ArticleType
from models.article import (
    LatestArticleHit,
    LatestArticleResponse,
    RecommendationArticleHit,
    RecommendationArticleResponse,
)


@patch("api.article.meilisearch_service")
def test_increment_article_view_count(mock_service, client):
    mock_service.increment_view_count = AsyncMock(
        return_value={"success": True, "message": "Incremented view count to 10", "view_count": 10}
    )

    response = client.patch("/api/articles/test-article/increment-view-count")
    assert response.status_code == 200
    assert response.json() == {"success": True, "message": "Incremented view count to 10", "view_count": 10}
    mock_service.increment_view_count.assert_called_once_with("test-article")


@patch("api.article.meilisearch_service")
def test_increment_article_view_count_not_found(mock_service, client):
    mock_service.increment_view_count = AsyncMock(
        return_value={"success": False, "message": "Document not found", "view_count": 0}
    )

    response = client.patch("/api/articles/unknown-article/increment-view-count")
    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


@patch("api.article.meilisearch_service")
def test_increment_article_read_count(mock_service, client):
    mock_service.increment_read_count = AsyncMock(
        return_value={"success": True, "message": "Incremented read count to 5", "read_count": 5}
    )

    response = client.patch("/api/articles/test-article/increment-read-count")
    assert response.status_code == 200
    assert response.json() == {"success": True, "message": "Incremented read count to 5", "read_count": 5}
    mock_service.increment_read_count.assert_called_once_with("test-article")


@patch("api.article.meilisearch_service")
def test_increment_article_claps_count(mock_service, client):
    mock_service.increment_claps_count = AsyncMock(
        return_value={"success": True, "message": "Incremented claps count to 20", "claps_count": 20}
    )

    response = client.patch("/api/articles/test-article/increment-claps-count")
    assert response.status_code == 200
    assert response.json() == {"success": True, "message": "Incremented claps count to 20", "claps_count": 20}
    mock_service.increment_claps_count.assert_called_once_with("test-article")


@patch("api.article.meilisearch_service")
def test_get_article_recommendations(mock_service, client):
    mock_hit = RecommendationArticleHit(
        id="1",
        name="rec-1",
        title="Rec 1",
        content="Content",
        type=ArticleType.BLOG_POST.value,
        year="2023",
        tags=["tag1"],
        creation_date=1234567890,
        view_count=10,
        read_count=5,
        claps_count=2,
    )
    mock_response = RecommendationArticleResponse(hits=[mock_hit], total_hits=1)
    mock_service.get_article_recommendations = AsyncMock(return_value=mock_response)

    payload = {
        "document_name_to_ignore": "current-article",
        "article_type": ArticleType.BLOG_POST,
        "document_tags": ["tag1", "tag2"],
    }
    response = client.post("/api/articles/recommendations", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["total_hits"] == 1
    assert data["hits"][0]["name"] == "rec-1"
    mock_service.get_article_recommendations.assert_called_once()


@patch("api.article.meilisearch_service")
def test_get_latest_articles(mock_service, client):
    mock_hit = LatestArticleHit(
        id="2",
        name="latest-1",
        title="Latest 1",
        content="Content",
        type=ArticleType.BLOG_POST.value,
        year="2023",
        tags=["tag2"],
        creation_date=1234567890,
        view_count=100,
        read_count=50,
        claps_count=20,
    )
    mock_response = LatestArticleResponse(hits=[mock_hit], total_hits=1)
    mock_service.get_latest_articles = AsyncMock(return_value=mock_response)

    payload = {"article_type": ArticleType.BLOG_POST}
    response = client.post("/api/articles/latest", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["total_hits"] == 1
    assert data["hits"][0]["name"] == "latest-1"
    mock_service.get_latest_articles.assert_called_once_with(document_type=ArticleType.BLOG_POST)


def test_get_latest_articles_filter_injection_attempt(client):
    """
    Test that attempting a filter injection (SQL/NoSQL injection style)
    is caught by Pydantic validation and returns a 422 error.
    """
    payload = {"article_type": "' OR type != 'nothing'"}
    response = client.post("/api/articles/latest", json=payload)

    assert response.status_code == 422

    response_data = response.json()
    print(response_data)
    assert "Input should be 'blog-post', 'course-post' or 'astronomy-post'" in response_data["detail"][0]["msg"]


def test_get_latest_articles_invalid_type(client):
    payload = {"article_type": "invalid-type"}
    response = client.post("/api/articles/latest", json=payload)

    assert response.status_code == 422


@patch("api.article.meilisearch_service")
def test_get_article_claps_count(mock_service, client):
    mock_service.get_claps_count = AsyncMock(
        return_value={"success": True, "message": "Claps count retrieved successfully", "claps_count": 15}
    )

    response = client.get("/api/articles/test-article/claps-count")
    assert response.status_code == 200
    assert response.json() == {"success": True, "claps_count": 15}
    mock_service.get_claps_count.assert_called_once_with("test-article")


@patch("api.article.meilisearch_service")
def test_get_article_recommendations_injection_attempt(mock_service, client):
    """
    Verify that 'document_name_to_ignore' is sanitized and does not allow filter bypassing.
    """
    size = 3
    mocked_hits = []
    for i in range(size):
        mocked_hits.append(
            RecommendationArticleHit(
                id=str(i),
                name=f"rec-{i}",
                title=f"Rec {i}",
                content="Content",
                type=ArticleType.BLOG_POST.value,
                year="2023",
                tags=["tag1"],
                creation_date=1234567890 + i,
                view_count=10 + i,
                read_count=5 + i,
                claps_count=2 + i,
            )
        )

    mock_response = RecommendationArticleResponse(hits=mocked_hits, total_hits=size)
    mock_service.get_article_recommendations = AsyncMock(return_value=mock_response)

    # Payload attempts to close the name quote and ask for EVERYTHING (OR name != 'nothing')
    payload = {
        "document_name_to_ignore": "nothing' OR name != 'nothing",
        "article_type": "blog-post",
        "document_tags": [],
    }
    response = client.post("/api/articles/recommendations", json=payload)

    data = response.json()
    assert response.status_code == 200
    assert data["total_hits"] == size
    assert len(data["hits"]) == size


@patch("api.article.meilisearch_service")
def test_increment_view_count_injection_attempt(mock_service, client):
    """
    Verify that URL injection in document name is sanitized and does not cause a 'Mass update' or Crash.
    """
    mock_response = {"success": False, "message": "Document not found", "view_count": 0}
    mock_service.increment_view_count = AsyncMock(return_value=mock_response)

    # Attempt to inject "OR 1=1" into the URL path
    malicious_name = "test-article' OR 1=1"
    response = client.patch(f"/api/articles/{malicious_name}/increment-view-count")

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"
