from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException

from api import article, search, visitors
from core.config import settings
from core.limiter import limiter
from database import initialize_database
from exception_handlers import http_exception_handler, request_validation_exception_handler, unhandled_exception_handler
from middleware import log_request_middleware


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Before yield, we put code that will be executed before the application starts.
    initialize_database()
    yield
    # After yield, we put code that will be executed after the application has finished.


app = FastAPI(title="API for ImadSaddik.com", version="1.0.0", lifespan=lifespan)

app.add_exception_handler(RequestValidationError, request_validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)


app.middleware("http")(log_request_middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router, prefix="/api", tags=["search"])
app.include_router(article.router, prefix="/api", tags=["article"])
app.include_router(visitors.router, prefix="/api/visitors", tags=["visitors"])

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
