from fastapi import APIRouter, HTTPException
from models.article import UpdateViewCountResponse
from services.meilisearch import MeilisearchService

router = APIRouter()
meilisearch_service = MeilisearchService()
endpoint = "/articles/{name}/increment-view-count"


@router.patch(endpoint, response_model=UpdateViewCountResponse)
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
