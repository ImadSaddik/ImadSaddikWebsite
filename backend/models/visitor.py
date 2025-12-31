from enum import Enum

from pydantic import BaseModel


class VisitorPageType(str, Enum):
    HOME = "HOME"
    BLOGS = "BLOGS"
    COURSES = "COURSES"
    ASTRONOMY = "ASTRONOMY"
    ABOUT_ME = "ABOUT_ME"
    HIRE_ME = "HIRE_ME"
    OTHER = "OTHER"


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
