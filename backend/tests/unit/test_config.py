from core.config import Settings


def test_cors_origins_production():
    settings = Settings(ENVIRONMENT="production")

    expected_origins = [
        "https://imadsaddik.com",
        "https://www.imadsaddik.com",
    ]

    assert settings.CORS_ORIGINS == expected_origins
    assert "http://localhost:8080" not in settings.CORS_ORIGINS


def test_cors_origins_development():
    settings = Settings(ENVIRONMENT="development")

    expected_origins = [
        "http://localhost:8080",
        "http://192.168.1.15:8080",
    ]

    assert settings.CORS_ORIGINS == expected_origins


def test_cors_origins_case_insensitive():
    settings = Settings(ENVIRONMENT="PRODUCTION")

    assert "https://imadsaddik.com" in settings.CORS_ORIGINS
    assert "http://localhost:8080" not in settings.CORS_ORIGINS


def test_cors_origins_default_fallback():
    settings = Settings(ENVIRONMENT="staging")

    expected_origins = [
        "http://localhost:8080",
        "http://192.168.1.15:8080",
    ]
    assert settings.CORS_ORIGINS == expected_origins
