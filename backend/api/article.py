from fastapi import APIRouter, HTTPException
from models.article import (
    RecommendationRequest,
    RecommendationResponse,
    UpdateViewCountResponse,
)
from services.meilisearch import MeilisearchService

router = APIRouter()
meilisearch_service = MeilisearchService()


@router.patch(
    "/articles/{name}/increment-view-count", response_model=UpdateViewCountResponse
)
async def increment_article_view_count(name: str):
    try:
        result = await meilisearch_service.increment_view_count(name)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return UpdateViewCountResponse(
            success=result["success"],
            message=result["message"],
            view_count=result["view_count"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/articles/recommendations", response_model=RecommendationResponse)
async def get_article_recommendations(request: RecommendationRequest):
    try:
        recommendations = await meilisearch_service.get_article_recommendations(
            document_name_to_ignore=request.documentNameToIgnore,
            document_type=request.articleType,
        )
        return recommendations

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
