from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    MEILISEARCH_URL: str = "http://localhost:7700"
    MEILISEARCH_MASTER_KEY: str = "aStrongMasterKey"
    MEILISEARCH_INDEX_NAME: str = "articles"

    ENVIRONMENT: str = "development"

    @property
    def CORS_ORIGINS(self):
        if self.ENVIRONMENT == "production":
            return [
                "https://imadsaddik.com",
                "https://www.imadsaddik.com",
            ]
        return [
            "http://localhost:8080",
            "http://192.168.1.15:8080",
        ]

    model_config = SettingsConfigDict(env_file="../env")


settings = Settings()
