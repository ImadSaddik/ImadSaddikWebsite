from pydantic import BaseModel


class Visitor(BaseModel):
    ip_address: str
    country: str
    first_visit_date: str
    visit_count: int
