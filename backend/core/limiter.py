from fastapi import Request
from slowapi import Limiter

from core.config import settings


def get_remote_address(request: Request) -> str:
    """
    Returns the client IP address from the Cloudflare 'CF-Connecting-IP' header,
    falling back to request.client.host or 127.0.0.1 if unavailable.
    """
    cf_connecting_ip = request.headers.get("cf-connecting-ip")
    if cf_connecting_ip and cf_connecting_ip.strip():
        return cf_connecting_ip.strip()

    if not request.client or not request.client.host:
        return "127.0.0.1"

    return request.client.host


limiter = Limiter(
    key_func=get_remote_address,
    enabled=settings.ENVIRONMENT == "production",
)
