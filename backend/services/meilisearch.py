from meilisearch_python_sdk import AsyncClient

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
    def __init__(self) -> None:
        self.client = AsyncClient(url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY)
        self.index = self.client.index(uid=settings.MEILISEARCH_INDEX_NAME)

    async def search(self, request: SearchRequest) -> SearchResponse:
        filter_conditions = self.get_filter_conditions(request)
        sorting_criteria = self.get_sorting_criteria(request)

        results = await self.index.search(
            query=request.query,
            filter=filter_conditions or None,
            show_ranking_score=True,
            sort=sorting_criteria,
            facets=["tags", "year"],
            limit=request.size,
            offset=request.offset,
        )

        hits = []
        for hit in results.hits:
            search_hit = SearchHit(**hit)
            search_hit.ranking_score = hit.get("_rankingScore")
            hits.append(search_hit)

        facet_distribution_data = results.facet_distribution or {}
        facet_distribution = FacetDistribution(
            tags=facet_distribution_data.get("tags", {}),
            year=facet_distribution_data.get("year", {}),
        )

        return SearchResponse(
            hits=hits,
            total_hits=results.estimated_total_hits or 0,
            facet_distribution=facet_distribution,
            processing_time_ms=results.processing_time_ms,
        )

    def get_filter_conditions(self, data: SearchRequest) -> str:
        conditions = []
        if data.article_type:
            conditions.append(f"type = '{data.article_type.value}'")

        if data.filters.years:
            years_list = [f"'{self._sanitize(year)}'" for year in data.filters.years]
            conditions.append(f"year IN [{', '.join(years_list)}]")

        if data.filters.tags:
            tags_list = [f"'{self._sanitize(tag)}'" for tag in data.filters.tags]
            conditions.append(f"tags IN [{', '.join(tags_list)}]")

        return " AND ".join(conditions) if conditions else ""

    def get_sorting_criteria(self, data: SearchRequest) -> list[str]:
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

    async def increment_view_count(self, document_name: str) -> dict:
        return await self._increment_counter(document_name, "view_count")

    async def increment_read_count(self, document_name: str) -> dict:
        return await self._increment_counter(document_name, "read_count")

    async def increment_claps_count(self, document_name: str, count: int = 1) -> dict:
        return await self._increment_counter(document_name, "claps_count", count)

    async def _increment_counter(self, document_name: str, field_name: str, count: int = 1) -> dict:
        try:
            safe_name = self._sanitize(document_name)
            response = await self.index.get_documents(filter=f"name = '{safe_name}'", limit=100)
            chunks = response.results

            if not chunks:
                return {
                    "success": False,
                    "message": "Document not found",
                    field_name: 0,
                }

            new_count = chunks[0].get(field_name, 0) + count
            documents_to_update = [{"id": chunk["id"], field_name: new_count} for chunk in chunks]

            await self.index.update_documents(documents_to_update)

            display_field = field_name.replace("_count", "").replace("_", " ")
            return {
                "success": True,
                "message": f"Incremented {display_field} count to {new_count}",
                field_name: new_count,
            }

        except Exception:
            logger.exception(f"Error incrementing {field_name} for document '{document_name}'")
            return {"success": False, "message": "Internal server error", field_name: 0}

    async def get_article_recommendations(self, data: RecommendationArticleRequest) -> RecommendationArticleResponse:
        safe_ignore_name = self._sanitize(data.document_name_to_ignore)
        filter_parts = [f"type = '{data.article_type.value}'", f"name != '{safe_ignore_name}'"]

        if data.document_tags:
            tags_list = [f"'{self._sanitize(tag)}'" for tag in data.document_tags]
            filter_parts.append(f"tags IN [{', '.join(tags_list)}]")

        filter_str = " AND ".join(filter_parts)

        response = await self.index.get_documents(
            filter=filter_str,
            limit=3,
        )

        hits = [RecommendationArticleHit(**hit) for hit in response.results]
        return RecommendationArticleResponse(
            hits=hits,
            total_hits=len(hits),
        )

    async def get_latest_articles(self, document_type: str) -> LatestArticleResponse:
        sort_order = SortOrder.DESC.value
        safe_document_type = self._sanitize(document_type)

        response = await self.index.get_documents(
            filter=f"type = '{safe_document_type}'",
            sort=f"creation_date:{sort_order}",
            limit=3,
        )
        hits = [LatestArticleHit(**hit) for hit in response.results]
        return LatestArticleResponse(
            hits=hits,
            total_hits=len(hits),
        )

    async def get_claps_count(self, document_name: str) -> dict:
        try:
            safe_name = self._sanitize(document_name)
            response = await self.index.get_documents(filter=f"name = '{safe_name}'", limit=1)
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
                "claps_count": chunks[0].get("claps_count", 0),
            }

        except Exception:
            logger.exception(f"Error retrieving claps count for document '{document_name}'")
            return {
                "success": False,
                "message": "Internal server error",
                "claps_count": 0,
            }

    def _sanitize(self, text: str) -> str:
        """
        Sanitizes input to prevent Meilisearch filter injection.
        Escapes backslashes first, then single and double quotes.
        """
        return text.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')
