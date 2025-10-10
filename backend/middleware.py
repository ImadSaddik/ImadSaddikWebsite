import http
import time

from fastapi import Request
from logger import logger
from starlette.middleware.base import _StreamingResponse


async def log_request_middleware(request: Request, call_next) -> _StreamingResponse:
    if request.query_params:
        url = f"{request.url.path}?{request.query_params}"
    else:
        url = request.url.path

    start_time = time.time()
    response = await call_next(request)
    duration_time_milliseconds = (time.time() - start_time) * 1000

    host = getattr(getattr(request, "client", None), "host", None)
    port = getattr(getattr(request, "client", None), "port", None)

    try:
        status_phrase = http.HTTPStatus(response.status_code).phrase
    except ValueError:
        status_phrase = ""

    logger.info(
        f'{host}:{port} - "{request.method} {url}" {response.status_code} {status_phrase} - {duration_time_milliseconds:.2f}ms'
    )
    return response
