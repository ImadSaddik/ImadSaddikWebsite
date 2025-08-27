from typing import List, Optional

import meilisearch
from core.config import settings
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
        sort_by = data.sortBy or "date"
        field_mapping = {"date": "creation_date:desc", "popularity": "view_count:desc"}
        return [field_mapping.get(sort_by, "creation_date:desc")]

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
