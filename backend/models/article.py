from typing import List

from pydantic import BaseModel

from enums.article import ArticleType
from models.document import Hit


class IncrementCountResponse(BaseModel):
    success: bool
    message: str


class IncrementViewCountResponse(IncrementCountResponse):
    view_count: int


class IncrementReadCountResponse(IncrementCountResponse):
    read_count: int


class IncrementClapsCountResponse(IncrementCountResponse):
    claps_count: int


class RecommendationArticleRequest(BaseModel):
    document_name_to_ignore: str
    article_type: ArticleType
    document_tags: List[str]


class RecommendationArticleHit(Hit): ...


class RecommendationArticleResponse(BaseModel):
    hits: List[RecommendationArticleHit]
    total_hits: int


class LatestArticleRequest(BaseModel):
    article_type: ArticleType


class LatestArticleHit(Hit): ...


class LatestArticleResponse(BaseModel):
    hits: List[LatestArticleHit]
    total_hits: int
