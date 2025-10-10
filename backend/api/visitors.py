from database import add_visitor
from fastapi import APIRouter, BackgroundTasks, Request
from logger import logger
from services.geolocation import get_country_from_ip

router = APIRouter()


@router.post("/track")
async def track_visitor_endpoint(
    request: Request, background_tasks: BackgroundTasks
) -> dict:
    client_ip = request.client.host
    background_tasks.add_task(_track_task, client_ip)
    return {"message": "Visit tracking initiated"}


async def _track_task(client_ip: str | None = None) -> None:
    try:
        if not client_ip:
            return None

        country = await get_country_from_ip(client_ip)
        if country:
            add_visitor(client_ip, country)
    except Exception as e:
        logger.error(f"Error tracking visitor via endpoint: {e}")
