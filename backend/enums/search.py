from enum import Enum


class SortableFields(str, Enum):
    DATE = "date"
    POPULARITY = "popularity"
    ENGAGEMENT = "engagement"
    CLAPS = "claps"
    NONE = ""


class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"
