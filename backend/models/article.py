from pydantic import BaseModel


class UpdateViewCountResponse(BaseModel):
    success: bool
    message: str
    view_count: int
