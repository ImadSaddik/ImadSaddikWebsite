import random

from locust import FastHttpUser, between, task


class WebsiteUser(FastHttpUser):
    wait_time = between(1, 5)

    search_queries = ["inkscape", "python", "meilisearch", "astronomy", "elasticsearch"]
    article_types = ["blog-post", "course-post", "astronomy-post"]
    sort_fields = ["date", "popularity", "engagement", "claps"]
    sort_orders = ["asc", "desc"]

    @task(1)
    def get_article_claps_count(self):
        article_name = "ElasticsearchChangeHeapSize"
        endpoint = f"/api/articles/{article_name}/claps-count"
        self.client.get(endpoint, name="/articles/[name]/claps-count")

    @task(4)
    def view_homepage(self):
        self.client.get("/", name="/")

    @task(7)
    def get_latest_articles(self):
        endpoint = "/api/articles/latest"
        article_type = random.choice(self.article_types)

        payload = {"articleType": article_type}
        self.client.post(endpoint, json=payload, name=endpoint)

    @task(7)
    def get_recommendations(self):
        endpoint = "/api/articles/recommendations"
        payload = {
            "articleType": "blog-post",
            "documentNameToIgnore": "ElasticsearchChangeHeapSize",
            "documentTags": ["elasticsearch"],
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
            "articleType": article_type,
            "size": 10,
            "sortBy": {"field": sort_field, "order": sort_order},
        }
        self.client.post(endpoint, json=payload, name=endpoint)
