from fastapi import APIRouter, HTTPException, Request

from core.limiter import limiter
from logger import logger
from models.article import (
    IncrementClapsCountResponse,
    IncrementReadCountResponse,
    IncrementViewCountResponse,
    LatestArticleRequest,
    LatestArticleResponse,
    RecommendationArticleRequest,
    RecommendationArticleResponse,
)
from services.meilisearch import MeilisearchService

router = APIRouter()
meilisearch_service = MeilisearchService()


@router.patch("/articles/{name}/increment-view-count", response_model=IncrementViewCountResponse)
@limiter.limit("30/minute")
async def increment_article_view_count(request: Request, name: str):
    try:
        result = await meilisearch_service.increment_view_count(name)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return IncrementViewCountResponse(
            success=result["success"],
            message=result["message"],
            view_count=result["view_count"],
        )

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error incrementing view count for article '{name}'")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/articles/{name}/increment-read-count", response_model=IncrementReadCountResponse)
@limiter.limit("30/minute")
async def increment_article_read_count(request: Request, name: str):
    try:
        result = await meilisearch_service.increment_read_count(name)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return IncrementReadCountResponse(
            success=result["success"],
            message=result["message"],
            read_count=result["read_count"],
        )

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error incrementing read count for article '{name}'")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/articles/{name}/increment-claps-count", response_model=IncrementClapsCountResponse)
@limiter.limit("30/minute")
async def increment_article_claps_count(request: Request, name: str):
    try:
        result = await meilisearch_service.increment_claps_count(name)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return IncrementClapsCountResponse(
            success=result["success"],
            message=result["message"],
            claps_count=result["claps_count"],
        )

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error incrementing claps count for article '{name}'")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/articles/recommendations", response_model=RecommendationArticleResponse)
@limiter.limit("30/minute")
async def get_article_recommendations(request: Request, body: RecommendationArticleRequest):
    try:
        recommendations = await meilisearch_service.get_article_recommendations(body)
        return recommendations

    except Exception:
        logger.exception("Error getting article recommendations")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/articles/latest", response_model=LatestArticleResponse)
@limiter.limit("30/minute")
async def get_latest_articles(request: Request, body: LatestArticleRequest):
    try:
        latest_articles = await meilisearch_service.get_latest_articles(
            document_type=body.article_type.value,
        )
        return latest_articles

    except Exception:
        logger.exception("Error getting latest articles")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/articles/{name}/claps-count")
@limiter.limit("30/minute")
async def get_article_claps_count(request: Request, name: str):
    try:
        result = await meilisearch_service.get_claps_count(name)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return {
            "success": result["success"],
            "claps_count": result["claps_count"],
        }

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error getting claps count for article '{name}'")
        raise HTTPException(status_code=500, detail="Internal server error")
