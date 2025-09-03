from typing import Dict, List, Optional

from pydantic import BaseModel

from models.document import Hit


class SearchFilters(BaseModel):
    years: List[str] = []
    tags: List[str] = []


class SearchSortBy(BaseModel):
    field: str = "date"
    order: str = "desc"


class SearchRequest(BaseModel):
    query: str = ""
    articleType: str
    sortBy: Optional[SearchSortBy] = SearchSortBy()
    filters: SearchFilters = SearchFilters()


class SearchHit(Hit):
    ranking_score: Optional[float] = None


class FacetDistribution(BaseModel):
    tags: Dict[str, int] = {}
    year: Dict[str, int] = {}


class SearchResponse(BaseModel):
    hits: List[SearchHit]
    total_hits: int
    facet_distribution: FacetDistribution
    processing_time_ms: int
