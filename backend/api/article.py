from fastapi import APIRouter, HTTPException
from models.article import (
    CountDocumentsResponse,
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


@router.patch(
    "/articles/{name}/increment-view-count", response_model=IncrementViewCountResponse
)
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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch(
    "/articles/{name}/increment-read-count", response_model=IncrementReadCountResponse
)
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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch(
    "/articles/{name}/increment-claps-count", response_model=IncrementClapsCountResponse
)
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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/articles/recommendations", response_model=RecommendationArticleResponse)
async def get_article_recommendations(request: RecommendationArticleRequest):
    try:
        recommendations = await meilisearch_service.get_article_recommendations(
            document_name_to_ignore=request.documentNameToIgnore,
            document_type=request.articleType,
        )
        return recommendations

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/articles/latest", response_model=LatestArticleResponse)
async def get_latest_articles(request: LatestArticleRequest):
    try:
        latest_articles = await meilisearch_service.get_latest_articles(
            document_type=request.articleType,
        )
        return latest_articles

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/articles/{article_type}/count-documents", response_model=CountDocumentsResponse
)
async def get_documents_count(article_type: str):
    try:
        result = await meilisearch_service.get_documents_count(article_type)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return CountDocumentsResponse(
            success=result["success"],
            message=result["message"],
            documents_count=result["documents_count"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/articles/{article_type}/get-all-tags")
async def get_all_tags(article_type: str):
    try:
        result = await meilisearch_service.get_all_tags(article_type)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return {
            "success": result["success"],
            "tags": result["tags"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/articles/{article_type}/get-all-years")
async def get_all_years(article_type: str):
    try:
        result = await meilisearch_service.get_all_years(article_type)

        if not result["success"]:
            raise HTTPException(
                status_code=404 if "not found" in result["message"] else 500,
                detail=result["message"],
            )

        return {
            "success": result["success"],
            "years": result["years"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
