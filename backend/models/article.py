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


class IncrementClapsCountResponse(BaseModel):
    success: bool
    message: str
    claps_count: int


class RecommendationArticleRequest(BaseModel):
    documentNameToIgnore: str
    articleType: str
    documentTags: List[str]


class RecommendationArticleHit(Hit): ...


class RecommendationArticleResponse(BaseModel):
    hits: List[RecommendationArticleHit]
    total_hits: int


class LatestArticleRequest(BaseModel):
    articleType: str


class LatestArticleHit(Hit): ...


class LatestArticleResponse(BaseModel):
    hits: List[LatestArticleHit]
    total_hits: int
