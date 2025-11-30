from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from services.geolocation import get_country_and_check_bot_from_ip


@pytest.mark.asyncio
async def test_get_country_local():
    result = await get_country_and_check_bot_from_ip("127.0.0.1")
    assert result.country == "Local"
    assert result.is_bot is False


@pytest.mark.asyncio
@patch("services.geolocation.httpx.AsyncClient")
async def test_get_country_success(mock_client_class):
    mock_client = AsyncMock()
    mock_client_class.return_value.__aenter__.return_value = mock_client

    mock_response = MagicMock()
    mock_response.json.return_value = {"location": {"country": "MOROCCO"}, "company": {"type": "isp"}}
    mock_response.raise_for_status.return_value = None
    mock_client.get.return_value = mock_response

    result = await get_country_and_check_bot_from_ip("8.8.8.8")
    assert result.country == "MOROCCO"
    assert result.is_bot is False


@pytest.mark.asyncio
@patch("services.geolocation.httpx.AsyncClient")
async def test_get_country_bot(mock_client_class):
    mock_client = AsyncMock()
    mock_client_class.return_value.__aenter__.return_value = mock_client

    mock_response = MagicMock()
    mock_response.json.return_value = {"is_crawler": True, "location": {"country": "INDIA"}}
    mock_client.get.return_value = mock_response

    result = await get_country_and_check_bot_from_ip("1.2.3.4")
    assert result.country == "INDIA"
    assert result.is_bot is True


@pytest.mark.asyncio
@patch("services.geolocation.httpx.AsyncClient")
async def test_get_country_error(mock_client_class):
    mock_client = AsyncMock()
    mock_client_class.return_value.__aenter__.return_value = mock_client

    mock_client.get.side_effect = Exception("Network error")

    result = await get_country_and_check_bot_from_ip("8.8.8.8")
    assert result.country is None
    assert result.is_bot is False
