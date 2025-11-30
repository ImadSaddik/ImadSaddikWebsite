from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    MEILISEARCH_URL: str = "http://localhost:7700"
    MEILISEARCH_MASTER_KEY: str = "aStrongMasterKey"
    MEILISEARCH_INDEX_NAME: str = "articles"

    model_config = SettingsConfigDict(env_file="../env")


settings = Settings()
