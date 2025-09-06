from typing import List, Optional

import meilisearch
from core.config import settings
from models.article import (
    LatestArticleHit,
    LatestArticleResponse,
    RecommendationArticleHit,
    RecommendationArticleResponse,
)
from models.search import FacetDistribution, SearchHit, SearchRequest, SearchResponse


class MeilisearchService:
    def __init__(self):
        self.client = meilisearch.Client(
            url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY
        )
        self.index = self.client.index(uid=settings.MEILISEARCH_INDEX_NAME)

    def get_filter_conditions(self, data: SearchRequest) -> str:
        conditions = []

        if data.articleType:
            conditions.append(f'type = "{data.articleType}"')

        if data.filters.years:
            conditions.append(f"year IN {data.filters.years}")

        if data.filters.tags:
            tags_list = [f"'{tag}'" for tag in data.filters.tags]
            conditions.append(f"tags IN [{', '.join(tags_list)}]")

        return " AND ".join(conditions) if conditions else ""

    def get_sorting_criteria(self, data: SearchRequest) -> List[str]:
        sort_by = data.sortBy.field if data.sortBy else "date"
        sort_order = data.sortBy.order if data.sortBy else "desc"
        field_mapping = {
            "date": f"creation_date:{sort_order}",
            "popularity": f"view_count:{sort_order}",
            "engagement": f"read_count:{sort_order}",
        }
        default_sorting = f"creation_date:{sort_order}"
        return [field_mapping.get(sort_by, default_sorting)]

    async def search(
        self, request: SearchRequest, query_vector: Optional[List[float]]
    ) -> SearchResponse:
        filter_conditions = self.get_filter_conditions(request)
        sorting_criteria = self.get_sorting_criteria(request)

        search_parameters = {
            "filter": filter_conditions,
            "showRankingScore": True,
            "sort": sorting_criteria,
            "facets": ["tags", "year"],
            "limit": request.size,
        }

        if query_vector:
            search_parameters["vector"] = query_vector
            search_parameters["hybrid"] = {
                "embedder": "my_embedder",
                "semanticRatio": 0.5,
            }

        results = self.index.search(query=request.query, opt_params=search_parameters)

        hits = [
            SearchHit(
                id=hit.get("id", ""),
                chunk_number=hit.get("chunk_number", 0),
                name=hit.get("name", ""),
                title=hit.get("title", ""),
                content=hit.get("content", ""),
                type=hit.get("type", ""),
                year=hit.get("year", ""),
                tags=hit.get("tags", []),
                creation_date=hit.get("creation_date", ""),
                view_count=hit.get("view_count", 0),
                read_count=hit.get("read_count", 0),
                ranking_score=hit.get("_rankingScore"),
            )
            for hit in results["hits"]
        ]

        facet_distribution = FacetDistribution(
            tags=results.get("facetDistribution", {}).get("tags", {}),
            year=results.get("facetDistribution", {}).get("year", {}),
        )

        return SearchResponse(
            hits=hits,
            total_hits=results.get("estimatedTotalHits", 0),
            facet_distribution=facet_distribution,
            processing_time_ms=results.get("processingTimeMs", 0),
        )

    async def increment_view_count(self, document_name: str) -> dict:
        try:
            response = self.index.get_documents(
                {"filter": f"name = '{document_name}'", "limit": 100}
            )
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": "Document not found",
                    "view_count": 0,
                }

            new_view_count = chunks[0].view_count + 1
            documents_to_update = [
                {"id": chunk.id, "view_count": new_view_count} for chunk in chunks
            ]

            task = self.index.update_documents(documents_to_update)
            self.client.wait_for_task(task.task_uid)

            return {
                "success": True,
                "message": f"Incremented view count to {new_view_count}",
                "view_count": new_view_count,
            }

        except Exception as e:
            return {"success": False, "message": str(e), "view_count": 0}

    async def increment_read_count(self, document_name: str) -> dict:
        try:
            response = self.index.get_documents(
                {"filter": f"name = '{document_name}'", "limit": 100}
            )
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": "Document not found",
                    "read_count": 0,
                }

            new_read_count = chunks[0].read_count + 1
            documents_to_update = [
                {"id": chunk.id, "read_count": new_read_count} for chunk in chunks
            ]

            task = self.index.update_documents(documents_to_update)
            self.client.wait_for_task(task.task_uid)

            return {
                "success": True,
                "message": f"Incremented read count to {new_read_count}",
                "read_count": new_read_count,
            }

        except Exception as e:
            return {"success": False, "message": str(e), "read_count": 0}

    async def get_article_recommendations(
        self, document_name_to_ignore: str, document_type: str
    ) -> RecommendationArticleResponse:
        response = self.index.get_documents(
            {
                "filter": f"type = '{document_type}' AND name != '{document_name_to_ignore}' AND chunk_number = 0",
                "limit": 3,
            }
        )
        hits = [
            RecommendationArticleHit(
                id=hit.id,
                chunk_number=hit.chunk_number,
                name=hit.name,
                title=hit.title,
                content=hit.content,
                type=hit.type,
                year=hit.year,
                tags=hit.tags,
                creation_date=hit.creation_date,
                view_count=hit.view_count,
                read_count=hit.read_count,
            )
            for hit in response.results
        ]
        return RecommendationArticleResponse(
            hits=hits,
            total_hits=len(hits),
        )

    async def get_latest_articles(self, document_type: str) -> LatestArticleResponse:
        response = self.index.get_documents(
            {
                "filter": f"type = '{document_type}' AND chunk_number = 0",
                "sort": ["creation_date:desc"],
                "limit": 3,
            }
        )
        hits = [
            LatestArticleHit(
                id=hit.id,
                chunk_number=hit.chunk_number,
                name=hit.name,
                title=hit.title,
                content=hit.content,
                type=hit.type,
                year=hit.year,
                tags=hit.tags,
                creation_date=hit.creation_date,
                view_count=hit.view_count,
                read_count=hit.read_count,
            )
            for hit in response.results
        ]
        return LatestArticleResponse(
            hits=hits,
            total_hits=len(hits),
        )

    async def get_documents_count(self, document_type: str) -> dict:
        try:
            response = self.index.get_documents(
                {
                    "filter": f"type = '{document_type}' AND chunk_number = 0",
                    "limit": 1000,
                }
            )
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": "No documents found",
                    "documents_count": 0,
                }

            return {
                "success": True,
                "message": f"Found {len(chunks)} documents",
                "documents_count": len(chunks),
            }

        except Exception as e:
            return {"success": False, "message": str(e), "documents_count": 0}
