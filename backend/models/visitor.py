from pydantic import BaseModel

from enums.visitor import VisitorPageType


class Visitor(BaseModel):
    ip_address: str
    country: str
    visit_date: str
    visited_page: VisitorPageType = VisitorPageType.HOME
    is_bot: bool = False


class TrackVisitorRequest(BaseModel):
    visited_page: VisitorPageType = VisitorPageType.HOME


class IpAPIResponse(BaseModel):
    country: str | None
    is_bot: bool
