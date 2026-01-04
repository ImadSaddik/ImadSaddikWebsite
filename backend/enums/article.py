from enum import Enum


class ArticleType(str, Enum):
    BLOG_POST = "blog-post"
    COURSE_POST = "course-post"
    ASTRONOMY_POST = "astronomy-post"
