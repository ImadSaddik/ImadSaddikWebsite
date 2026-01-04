from enum import Enum


class VisitorPageType(str, Enum):
    HOME = "HOME"
    BLOGS = "BLOGS"
    COURSES = "COURSES"
    ASTRONOMY = "ASTRONOMY"
    ABOUT_ME = "ABOUT_ME"
    HIRE_ME = "HIRE_ME"
    OTHER = "OTHER"
