from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    MEILISEARCH_URL: str = "http://localhost:7700"
    MEILISEARCH_MASTER_KEY: str = "aStrongMasterKey"
    MEILISEARCH_INDEX_NAME: str = "articles"

    class Config:
        env_file = "../env"


settings = Settings()
