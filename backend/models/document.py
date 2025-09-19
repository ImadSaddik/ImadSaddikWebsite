from typing import List

from pydantic import BaseModel


class Hit(BaseModel):
    id: str
    chunk_number: int
    name: str
    title: str
    content: str
    type: str
    year: str
    tags: List[str]
    creation_date: int
    view_count: int
    read_count: int
    claps_count: int
