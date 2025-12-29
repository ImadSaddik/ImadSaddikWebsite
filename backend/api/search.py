from fastapi import APIRouter, HTTPException

from logger import logger
from models.search import SearchRequest, SearchResponse
from services.meilisearch import MeilisearchService

router = APIRouter()
meilisearch_service = MeilisearchService()


@router.post("/search", response_model=SearchResponse)
async def search_articles(request: SearchRequest):
    try:
        results = await meilisearch_service.search(request)
        return results

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error searching articles with query '{request.query}'")
        raise HTTPException(status_code=500, detail="Internal server error")
