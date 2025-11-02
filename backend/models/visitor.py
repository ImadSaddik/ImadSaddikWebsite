from pydantic import BaseModel


class Visitor(BaseModel):
    ip_address: str
    country: str
    visit_date: str
    visited_page: str = "home"
    is_bot: bool = False


class TrackVisitorRequest(BaseModel):
    visited_page: str = "home"


class IpAPIResponse(BaseModel):
    country: str | None
    is_bot: bool
