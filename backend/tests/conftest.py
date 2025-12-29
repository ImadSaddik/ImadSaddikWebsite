from typing import Generator

import pytest
from fastapi.testclient import TestClient

from core.limiter import limiter
from main import app


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def reset_rate_limit() -> None:
    """
    Resets the rate limiter storage before every test.
    """
    limiter.limiter.storage.reset()


@pytest.fixture
def assert_rate_limit(client):
    """
    A helper to test rate limits.
    It hits an endpoint repeatedly until it expects a 429 error.
    """

    def _hit_until_429(url: str, method: str, payload: dict = None, limit: int = 30):
        request_function = getattr(client, method.lower())

        request_kwargs = {}
        if method.upper() in ("POST", "PATCH", "PUT") and payload:
            request_kwargs["json"] = payload

        for i in range(limit):
            response = request_function(url, **request_kwargs)
            assert response.status_code != 429, f"Request {i + 1} failed with 429 too early."

        response = request_function(url, **request_kwargs)

        assert response.status_code == 429
        assert "Rate limit exceeded" in response.text

    return _hit_until_429
