from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from core.limiter import limiter


@pytest.fixture(autouse=True)
def reset_rate_limit():
    limiter.limiter.storage.reset()


def _hit_endpoint_until_limit(client: TestClient, url: str, method: str, payload: dict = None, limit: int = 30) -> None:
    for i in range(limit):
        if method == "POST":
            response = client.post(url, json=payload)
        elif method == "PATCH":
            response = client.patch(url)

        assert response.status_code != 429, f"Request {i + 1} failed with 429 too early."

    if method == "POST":
        response = client.post(url, json=payload)
    elif method == "PATCH":
        response = client.patch(url)

    assert response.status_code == 429
    assert "Rate limit exceeded" in response.text


def test_rate_limit_increment_view_count(client) -> None:
    url = "/api/articles/test-rate-limit-article/increment-view-count"
    _hit_endpoint_until_limit(client, url, "PATCH")


def test_rate_limit_increment_read_count(client) -> None:
    url = "/api/articles/test-rate-limit-article/increment-read-count"
    _hit_endpoint_until_limit(client, url, "PATCH")


def test_rate_limit_increment_claps_count(client):
    url = "/api/articles/test-rate-limit-article/increment-claps-count"
    _hit_endpoint_until_limit(client, url, "PATCH")


def test_rate_limit_recommendations(client) -> None:
    url = "/api/articles/recommendations"
    payload = {
        "documentNameToIgnore": "current-article",
        "articleType": "blog-post",
        "documentTags": ["python", "fastapi"],
    }
    _hit_endpoint_until_limit(client, url, "POST", payload)


def test_rate_limit_latest_articles(client) -> None:
    url = "/api/articles/latest"
    payload = {"articleType": "blog-post"}
    _hit_endpoint_until_limit(client, url, "POST", payload)


def test_rate_limit_search(client) -> None:
    url = "/api/search"
    payload = {"query": "test", "articleType": "blog-post", "filters": {"years": ["2023"], "tags": ["tag1"]}, "size": 5}
    _hit_endpoint_until_limit(client, url, "POST", payload)


def test_rate_limit_visitor_tracking(client) -> None:
    url = "/api/visitors/track"
    payload = {"visited_page": "/home"}

    with patch("api.visitors.get_country_and_check_bot_from_ip") as mock_geolocation:
        mock_geolocation.return_value.country = "Local"
        mock_geolocation.return_value.is_bot = False

        _hit_endpoint_until_limit(client, url, "POST", payload)
