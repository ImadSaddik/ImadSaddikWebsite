import sys
from typing import Union

from fastapi import Request
from fastapi.exception_handlers import http_exception_handler as _http_exception_handler
from fastapi.exception_handlers import (
    request_validation_exception_handler as _request_validation_exception_handler,
)
from fastapi.exceptions import HTTPException, RequestValidationError
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from logger import logger


# This function will be called when the client input is not valid.
async def request_validation_exception_handler(
    request: Request, exception: RequestValidationError
) -> JSONResponse:
    body = await request.body()
    query_params = request.query_params._dict
    detail = {
        "errors": exception.errors(),
        "body": body.decode(),
        "query_params": query_params,
    }
    logger.info(detail)
    return await _request_validation_exception_handler(request, exception)


# This function will be called when a HTTPException is explicitly raised.
async def http_exception_handler(
    request: Request, exception: HTTPException
) -> Union[JSONResponse, Response]:
    return await _http_exception_handler(request, exception)


# This function will be called when an unhandled exception occurs.
async def unhandled_exception_handler(
    request: Request, exception: Exception
) -> PlainTextResponse:
    host = getattr(getattr(request, "client", None), "host", None)
    port = getattr(getattr(request, "client", None), "port", None)

    if request.query_params:
        url = f"{request.url.path}?{request.query_params}"
    else:
        url = request.url.path

    exception_type, exception_value, _ = sys.exc_info()
    exception_name = getattr(exception_type, "__name__", None)
    logger.error(
        f'{host}:{port} - "{request.method} {url}" 500 Internal Server Error <{exception_name}: {exception_value}>'
    )
    return PlainTextResponse(str(exception), status_code=500)
