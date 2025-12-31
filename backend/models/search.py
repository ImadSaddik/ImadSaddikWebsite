from typing import Dict, List, Optional

from pydantic import BaseModel, field_validator

from enums.article import ArticleType
from enums.search import SortableField, SortOrder
from models.document import Hit


class SearchFilters(BaseModel):
    years: List[str] = []
    tags: List[str] = []

    @field_validator("years")
    def validate_years(cls, values: List[str]) -> List[str]:
        for year in values:
            if not year.isdigit() or len(year) != 4:
                raise ValueError("Year must be a 4-digit number")
        return values


class SearchSortBy(BaseModel):
    field: SortableField = SortableField.DATE
    order: SortOrder = SortOrder.DESC


class SearchRequest(BaseModel):
    query: str = ""
    article_type: ArticleType = ArticleType.BLOG_POST
    sort_by: Optional[SearchSortBy] = SearchSortBy()
    filters: SearchFilters = SearchFilters()
    size: int = 10


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
