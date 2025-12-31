from unittest.mock import patch

from enums.visitor import VisitorPageType
from models.visitor import IpAPIResponse


@patch("api.visitors.add_visitor")
@patch("api.visitors.get_country_and_check_bot_from_ip")
def test_track_visitor_endpoint(mock_get_country, mock_add_visitor, client):
    mock_get_country.return_value = IpAPIResponse(country="MOROCCO", is_bot=False)

    payload = {"visited_page": VisitorPageType.ABOUT_ME.value}
    response = client.post("/api/visitors/track", json=payload)

    assert response.status_code == 200
    assert response.json() == {"message": "Visit tracking initiated"}

    mock_get_country.assert_called_once()
    mock_add_visitor.assert_called_once()

    call_kwargs = mock_add_visitor.call_args.kwargs
    assert call_kwargs["ip_address"] == "testclient"
    assert call_kwargs["country"] == "MOROCCO"
    assert call_kwargs["visited_page"] == VisitorPageType.ABOUT_ME.value
    assert call_kwargs["is_bot"] is False


def test_track_visitor_invalid_page_type(client):
    payload = {"visited_page": "RANDOM_JUNK"}
    response = client.post("/api/visitors/track", json=payload)

    data = response.json()
    assert response.status_code == 422
    assert "Input should be 'HOME', 'BLOGS', 'COURSES'" in data["detail"][0]["msg"]


def test_track_visitor_injection_attempt(client):
    payload = {"visited_page": "<script>alert(1)</script>"}
    response = client.post("/api/visitors/track", json=payload)

    assert response.status_code == 422
