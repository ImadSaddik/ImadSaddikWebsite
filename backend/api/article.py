from fastapi import APIRouter, HTTPException

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
async def increment_article_view_count(name: str):
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
async def increment_article_read_count(name: str):
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
async def increment_article_claps_count(name: str):
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
async def get_article_recommendations(request: RecommendationArticleRequest):
    try:
        recommendations = await meilisearch_service.get_article_recommendations(request)
        return recommendations

    except Exception:
        logger.exception("Error getting article recommendations")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/articles/latest", response_model=LatestArticleResponse)
async def get_latest_articles(request: LatestArticleRequest):
    try:
        latest_articles = await meilisearch_service.get_latest_articles(
            document_type=request.articleType,
        )
        return latest_articles

    except Exception:
        logger.exception("Error getting latest articles")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/articles/{name}/claps-count")
async def get_article_claps_count(name: str):
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
