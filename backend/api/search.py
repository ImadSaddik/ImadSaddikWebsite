from fastapi import APIRouter, HTTPException, Request

from core.limiter import limiter
from logger import logger
from models.search import SearchRequest, SearchResponse
from services.meilisearch import MeilisearchService

router = APIRouter()
meilisearch_service = MeilisearchService()


@router.post("/search", response_model=SearchResponse)
@limiter.limit("30/minute")
async def search_articles(request: Request, body: SearchRequest):
    try:
        results = await meilisearch_service.search(body)
        return results

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error searching articles with query '{body.query}'")
        raise HTTPException(status_code=500, detail="Internal server error")
