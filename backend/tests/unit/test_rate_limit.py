from unittest.mock import patch

from enums.article import ArticleType
from enums.visitor import VisitorPageType


def test_rate_limit_increment_view_count(assert_rate_limit) -> None:
    assert_rate_limit(url="/api/articles/test-rate-limit-article/increment-view-count", method="PATCH")


def test_rate_limit_increment_read_count(assert_rate_limit) -> None:
    assert_rate_limit(url="/api/articles/test-rate-limit-article/increment-read-count", method="PATCH")


def test_rate_limit_increment_claps_count(assert_rate_limit) -> None:
    assert_rate_limit(url="/api/articles/test-rate-limit-article/increment-claps-count", method="PATCH")


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
