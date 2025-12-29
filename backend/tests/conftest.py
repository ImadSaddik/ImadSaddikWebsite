import pytest
from fastapi.testclient import TestClient

from core.limiter import limiter
from main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def reset_rate_limit():
    limiter.limiter.storage.reset()


@pytest.fixture
def assert_rate_limit(client):
    def _hit_until_429(url: str, method: str, payload: dict = None, limit: int = 30):
        # Hit the endpoint 'limit' times (should succeed)
        for i in range(limit):
            if method == "POST":
                response = client.post(url, json=payload)
            elif method == "PATCH":
                response = client.patch(url)
            elif method == "GET":
                response = client.get(url)

            assert response.status_code != 429, f"Request {i + 1} failed with 429 too early."

        # The next hit must fail with 429
        if method == "POST":
            response = client.post(url, json=payload)
        elif method == "PATCH":
            response = client.patch(url)
        elif method == "GET":
            response = client.get(url)

        assert response.status_code == 429
        assert "Rate limit exceeded" in response.text

    return _hit_until_429
