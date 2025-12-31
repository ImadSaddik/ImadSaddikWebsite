from typing import List

import meilisearch

from core.config import settings
from enums.search import SortableField, SortOrder
from logger import logger
from models.article import (
    LatestArticleHit,
    LatestArticleResponse,
    RecommendationArticleHit,
    RecommendationArticleRequest,
    RecommendationArticleResponse,
)
from models.search import FacetDistribution, SearchHit, SearchRequest, SearchResponse


class MeilisearchService:
    def __init__(self):
        self.client = meilisearch.Client(url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY)
        self.index = self.client.index(uid=settings.MEILISEARCH_INDEX_NAME)

    def _sanitize(self, text: str) -> str:
        """
        Sanitizes input to prevent Meilisearch filter injection.
        Escapes backslashes first, then single and double quotes.
        """
        return text.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')

    def get_filter_conditions(self, data: SearchRequest) -> str:
        conditions = []
        if data.article_type:
            conditions.append(f"type = '{data.article_type.value}'")

        if data.filters.years:
            years_list = [f"'{year}'" for year in data.filters.years]
            conditions.append(f"year IN [{', '.join(years_list)}]")

        if data.filters.tags:
            tags_list = [f"'{self._sanitize(tag)}'" for tag in data.filters.tags]
            conditions.append(f"tags IN [{', '.join(tags_list)}]")

        return " AND ".join(conditions) if conditions else ""

    def get_sorting_criteria(self, data: SearchRequest) -> List[str]:
        sort_by = SortableField.DATE
        sort_order = SortOrder.DESC.value

        if data.sort_by:
            sort_by = data.sort_by.field
            sort_order = data.sort_by.order.value

        field_mapping = {
            SortableField.DATE: f"creation_date:{sort_order}",
            SortableField.POPULARITY: f"view_count:{sort_order}",
            SortableField.ENGAGEMENT: f"read_count:{sort_order}",
            SortableField.CLAPS: f"claps_count:{sort_order}",
        }
        default_sorting = f"creation_date:{sort_order}"
        return [field_mapping.get(sort_by, default_sorting)]

    async def search(self, request: SearchRequest) -> SearchResponse:
        filter_conditions = self.get_filter_conditions(request)
        sorting_criteria = self.get_sorting_criteria(request)

        search_parameters = {
            "filter": filter_conditions,
            "showRankingScore": True,
            "sort": sorting_criteria,
            "facets": ["tags", "year"],
            "limit": request.size,
        }

        results = self.index.search(query=request.query, opt_params=search_parameters)

        hits = [
            SearchHit(
                id=hit.get("id", ""),
                name=hit.get("name", ""),
                title=hit.get("title", ""),
                content=hit.get("content", ""),
                type=hit.get("type", ""),
                year=hit.get("year", ""),
                tags=hit.get("tags", []),
                creation_date=hit.get("creation_date", ""),
                view_count=hit.get("view_count", 0),
                read_count=hit.get("read_count", 0),
                claps_count=hit.get("claps_count", 0),
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
            safe_name = self._sanitize(document_name)
            response = self.index.get_documents({"filter": f"name = '{safe_name}'", "limit": 100})
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": "Document not found",
                    "view_count": 0,
                }

            new_view_count = chunks[0].view_count + 1
            documents_to_update = [{"id": chunk.id, "view_count": new_view_count} for chunk in chunks]

            self.index.update_documents(documents_to_update)

            return {
                "success": True,
                "message": f"Incremented view count to {new_view_count}",
                "view_count": new_view_count,
            }

        except Exception:
            logger.exception(f"Error incrementing view count for document '{document_name}'")
            return {"success": False, "message": "Internal server error", "view_count": 0}

    async def increment_read_count(self, document_name: str) -> dict:
        try:
            safe_name = self._sanitize(document_name)
            response = self.index.get_documents({"filter": f"name = '{safe_name}'", "limit": 100})
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": "Document not found",
                    "read_count": 0,
                }

            new_read_count = chunks[0].read_count + 1
            documents_to_update = [{"id": chunk.id, "read_count": new_read_count} for chunk in chunks]

            self.index.update_documents(documents_to_update)

            return {
                "success": True,
                "message": f"Incremented read count to {new_read_count}",
                "read_count": new_read_count,
            }

        except Exception:
            logger.exception(f"Error incrementing read count for document '{document_name}'")
            return {"success": False, "message": "Internal server error", "read_count": 0}

    async def increment_claps_count(self, document_name: str) -> dict:
        try:
            safe_name = self._sanitize(document_name)
            response = self.index.get_documents({"filter": f"name = '{safe_name}'", "limit": 100})
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": "Document not found",
                    "claps_count": 0,
                }

            new_claps_count = chunks[0].claps_count + 1
            documents_to_update = [{"id": chunk.id, "claps_count": new_claps_count} for chunk in chunks]

            self.index.update_documents(documents_to_update)

            return {
                "success": True,
                "message": f"Incremented claps count to {new_claps_count}",
                "claps_count": new_claps_count,
            }

        except Exception:
            logger.exception(f"Error incrementing claps count for document '{document_name}'")
            return {"success": False, "message": "Internal server error", "claps_count": 0}

    async def get_article_recommendations(self, data: RecommendationArticleRequest) -> RecommendationArticleResponse:
        safe_ignore_name = self._sanitize(data.document_name_to_ignore)
        filter_parts = [f"type = '{data.article_type.value}'", f"name != '{safe_ignore_name}'"]

        if data.document_tags:
            tags_list = [f"'{self._sanitize(tag)}'" for tag in data.document_tags]
            filter_parts.append(f"tags IN [{', '.join(tags_list)}]")

        filter_str = " AND ".join(filter_parts)

        response = self.index.get_documents(
            {
                "filter": filter_str,
                "limit": 3,
            }
        )

        hits = [
            RecommendationArticleHit(
                id=hit.id,
                name=hit.name,
                title=hit.title,
                content=hit.content,
                type=hit.type,
                year=hit.year,
                tags=hit.tags,
                creation_date=hit.creation_date,
                view_count=hit.view_count,
                read_count=hit.read_count,
                claps_count=hit.claps_count,
            )
            for hit in response.results
        ]
        return RecommendationArticleResponse(
            hits=hits,
            total_hits=len(hits),
        )

    async def get_latest_articles(self, document_type: str) -> LatestArticleResponse:
        sort_order = SortOrder.DESC.value
        safe_document_type = self._sanitize(document_type)
        response = self.index.get_documents(
            {
                "filter": f"type = '{safe_document_type}'",
                "sort": [f"creation_date:{sort_order}"],
                "limit": 3,
            }
        )
        hits = [
            LatestArticleHit(
                id=hit.id,
                name=hit.name,
                title=hit.title,
                content=hit.content,
                type=hit.type,
                year=hit.year,
                tags=hit.tags,
                creation_date=hit.creation_date,
                view_count=hit.view_count,
                read_count=hit.read_count,
                claps_count=hit.claps_count,
            )
            for hit in response.results
        ]
        return LatestArticleResponse(
            hits=hits,
            total_hits=len(hits),
        )

    async def get_claps_count(self, document_name: str) -> dict:
        try:
            safe_name = self._sanitize(document_name)
            response = self.index.get_documents({"filter": f"name = '{safe_name}'", "limit": 1})
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": f"Document '{document_name}' not found",
                    "claps_count": 0,
                }

            return {
                "success": True,
                "message": "Claps count retrieved successfully",
                "claps_count": chunks[0].claps_count,
            }

        except Exception:
            logger.exception(f"Error retrieving claps count for document '{document_name}'")
            return {
                "success": False,
                "message": "Internal server error",
                "claps_count": 0,
            }
