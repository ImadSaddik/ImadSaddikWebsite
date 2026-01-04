import random

from locust import FastHttpUser, between, task

from enums.article import ArticleType
from enums.search import SortableField, SortOrder


class WebsiteUser(FastHttpUser):
    wait_time = between(1, 5)

    search_queries = ["inkscape", "python", "meilisearch", "astronomy", "elasticsearch"]
    article_types = [ArticleType.BLOG_POST, ArticleType.COURSE_POST, ArticleType.ASTRONOMY_POST]
    sort_fields = [SortableField.DATE, SortableField.POPULARITY, SortableField.ENGAGEMENT, SortableField.CLAPS]
    sort_orders = [SortOrder.ASC, SortOrder.DESC]

    @task(1)
    def get_article_claps_count(self):
        article_name = "elasticsearch-change-heap-size"
        endpoint = f"/api/articles/{article_name}/claps-count"
        self.client.get(endpoint, name="/articles/[name]/claps-count")

    @task(4)
    def view_homepage(self):
        self.client.get("/", name="/")

    @task(7)
    def get_latest_articles(self):
        endpoint = "/api/articles/latest"
        article_type = random.choice(self.article_types)

        payload = {"article_type": article_type}
        self.client.post(endpoint, json=payload, name=endpoint)

    @task(7)
    def get_recommendations(self):
        endpoint = "/api/articles/recommendations"
        payload = {
            "article_type": ArticleType.BLOG_POST,
            "document_name_to_ignore": "elasticsearch-change-heap-size",
            "document_tags": ["elasticsearch"],
        }
        self.client.post(endpoint, json=payload, name=endpoint)

    @task(10)
    def search_articles(self):
        endpoint = "/api/search"
        query = random.choice(self.search_queries)
        article_type = random.choice(self.article_types)
        sort_field = random.choice(self.sort_fields)
        sort_order = random.choice(self.sort_orders)

        payload = {
            "query": query,
            "article_type": article_type,
            "size": 10,
            "sort_by": {"field": sort_field, "order": sort_order},
        }
        self.client.post(endpoint, json=payload, name=endpoint)
