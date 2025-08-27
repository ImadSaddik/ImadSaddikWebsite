from fastapi import APIRouter, HTTPException
from models.search import SearchRequest, SearchResponse
from services.embedding import get_query_embedding
from services.meilisearch import MeilisearchService

router = APIRouter()
meilisearch_service = MeilisearchService()


@router.post("/search", response_model=SearchResponse)
async def search_articles(request: SearchRequest):
    try:
        query_vector = None
        if request.query:
            query_vector = get_query_embedding(request.query)
            if not query_vector:
                raise HTTPException(
                    status_code=500, detail="Failed to generate embedding"
                )

        results = await meilisearch_service.search(request, query_vector)
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
