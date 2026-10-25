from unittest.mock import patch

from starlette.requests import Request

from core.limiter import get_remote_address
from enums.article import ArticleType
from enums.visitor import VisitorPageType


def test_get_remote_address_with_cf_connecting_ip() -> None:
    scope = {
        "type": "http",
        "headers": [(b"cf-connecting-ip", b"203.0.113.195")],
        "client": ("127.0.0.1", 12345),
    }
    request = Request(scope)
    assert get_remote_address(request) == "203.0.113.195"


def test_get_remote_address_strips_whitespace() -> None:
    scope = {
        "type": "http",
        "headers": [(b"cf-connecting-ip", b"  203.0.113.195  ")],
        "client": ("127.0.0.1", 12345),
    }
    request = Request(scope)
    assert get_remote_address(request) == "203.0.113.195"


def test_get_remote_address_ignores_x_forwarded_for_when_cf_present() -> None:
    scope = {
        "type": "http",
        "headers": [
            (b"cf-connecting-ip", b"203.0.113.195"),
            (b"x-forwarded-for", b"10.0.0.1, 10.0.0.2"),
        ],
        "client": ("10.0.0.1", 12345),
    }
    request = Request(scope)
    assert get_remote_address(request) == "203.0.113.195"


def test_get_remote_address_fallback_to_client_host() -> None:
    scope = {
        "type": "http",
        "headers": [],
        "client": ("192.168.1.100", 12345),
    }
    request = Request(scope)
    assert get_remote_address(request) == "192.168.1.100"


def test_get_remote_address_empty_cf_header_falls_back_to_client_host() -> None:
    scope = {
        "type": "http",
        "headers": [(b"cf-connecting-ip", b"   ")],
        "client": ("192.168.1.100", 12345),
    }
    request = Request(scope)
    assert get_remote_address(request) == "192.168.1.100"


def test_get_remote_address_fallback_to_default_ip() -> None:
    scope = {
        "type": "http",
        "headers": [],
        "client": None,
    }
    request = Request(scope)
    assert get_remote_address(request) == "127.0.0.1"


def test_rate_limit_increment_view_count(assert_rate_limit) -> None:
    assert_rate_limit(url="/api/articles/test-rate-limit-article/increment-view-count", method="PATCH")


def test_rate_limit_increment_read_count(assert_rate_limit) -> None:
    assert_rate_limit(url="/api/articles/test-rate-limit-article/increment-read-count", method="PATCH")


def test_rate_limit_increment_claps_count(assert_rate_limit) -> None:
    assert_rate_limit(
        url="/api/articles/test-rate-limit-article/increment-claps-count", method="PATCH", payload={"count": 1}
    )


def test_rate_limit_recommendations(assert_rate_limit) -> None:
    payload = {
        "document_name_to_ignore": "current-article",
        "article_type": ArticleType.BLOG_POST,
        "document_tags": ["python", "fastapi"],
    }
    assert_rate_limit(url="/api/articles/recommendations", method="POST", payload=payload)


def test_rate_limit_latest_articles(assert_rate_limit) -> None:
    assert_rate_limit(url="/api/articles/latest", method="POST", payload={"article_type": ArticleType.BLOG_POST})


def test_rate_limit_get_claps_count(assert_rate_limit) -> None:
    assert_rate_limit(url="/api/articles/test-rate-limit-article/claps-count", method="GET")


def test_rate_limit_search(assert_rate_limit) -> None:
    payload = {
        "query": "test",
        "article_type": ArticleType.BLOG_POST,
        "filters": {"years": ["2023"], "tags": ["tag1"]},
        "size": 5,
    }
    assert_rate_limit(url="/api/search", method="POST", payload=payload)


def test_rate_limit_visitor_tracking(assert_rate_limit) -> None:
    url = "/api/visitors/track"
    payload = {"visited_page": VisitorPageType.HOME}

    with patch("api.visitors.get_country_and_check_bot_from_ip") as mock_geolocation:
        mock_geolocation.return_value.country = "Local"
        mock_geolocation.return_value.is_bot = False

        assert_rate_limit(url=url, method="POST", payload=payload)


def test_rate_limit_bypass_attempt_with_spoofed_x_forwarded_for_prevented(client) -> None:
    url = "/api/articles/test-rate-limit-article/increment-view-count"
    cf_ip = "198.51.100.1"

    for i in range(30):
        response = client.patch(
            url,
            headers={
                "CF-Connecting-IP": cf_ip,
                "X-Forwarded-For": f"10.0.0.{i}",
            },
        )
        assert response.status_code != 429, f"Request {i + 1} failed with 429 too early."

    response = client.patch(
        url,
        headers={
            "CF-Connecting-IP": cf_ip,
            "X-Forwarded-For": "10.0.0.999",
        },
    )
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.text


def test_rate_limit_distinct_cf_connecting_ip_isolated(client) -> None:
    url = "/api/articles/test-rate-limit-article/increment-view-count"
    client_ip_1 = "198.51.100.1"
    client_ip_2 = "198.51.100.2"

    for _ in range(30):
        client.patch(url, headers={"CF-Connecting-IP": client_ip_1})

    blocked_response = client.patch(url, headers={"CF-Connecting-IP": client_ip_1})
    assert blocked_response.status_code == 429

    allowed_response = client.patch(url, headers={"CF-Connecting-IP": client_ip_2})
    assert allowed_response.status_code != 429
