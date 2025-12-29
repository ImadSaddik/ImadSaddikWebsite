from fastapi import APIRouter, BackgroundTasks, Request

from database import add_visitor
from logger import logger
from models.visitor import TrackVisitorRequest
from services.geolocation import get_country_and_check_bot_from_ip

router = APIRouter()


@router.post("/track")
async def track_visitor_endpoint(
    request: Request, background_tasks: BackgroundTasks, body: TrackVisitorRequest
) -> dict:
    client_ip = None
    if client := request.client:
        client_ip = client.host

    background_tasks.add_task(_track_task, client_ip, body.visited_page)
    return {"message": "Visit tracking initiated"}


async def _track_task(client_ip: str | None = None, visited_page: str = "HOME") -> None:
    try:
        if not client_ip:
            return None

        ip_api_response = await get_country_and_check_bot_from_ip(client_ip)
        if ip_api_response.country:
            add_visitor(
                ip_address=client_ip,
                country=ip_api_response.country,
                visited_page=visited_page,
                is_bot=ip_api_response.is_bot,
            )
    except Exception:
        logger.exception("Error tracking visitor via endpoint")
