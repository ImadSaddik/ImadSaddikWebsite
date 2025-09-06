from typing import List

from pydantic import BaseModel

from models.document import Hit


class IncrementViewCountResponse(BaseModel):
    success: bool
    message: str
    view_count: int


class IncrementReadCountResponse(BaseModel):
    success: bool
    message: str
    read_count: int


class RecommendationArticleRequest(BaseModel):
    documentNameToIgnore: str
    articleType: str


class RecommendationArticleHit(Hit):
    pass


class RecommendationArticleResponse(BaseModel):
    hits: List[RecommendationArticleHit]
    total_hits: int


class LatestArticleRequest(BaseModel):
    articleType: str


class LatestArticleHit(Hit):
    pass


class LatestArticleResponse(BaseModel):
    hits: List[LatestArticleHit]
    total_hits: int
