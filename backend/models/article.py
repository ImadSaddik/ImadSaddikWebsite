from typing import List

from pydantic import BaseModel

from models.document import Hit


class UpdateViewCountResponse(BaseModel):
    success: bool
    message: str
    view_count: int


class RecommendationRequest(BaseModel):
    documentNameToIgnore: str
    articleType: str


class RecommendationHit(Hit):
    pass


class RecommendationResponse(BaseModel):
    hits: List[RecommendationHit]
    total_hits: int
