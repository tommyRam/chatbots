from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    GROQ_API_KEY: str
    google_embedding_model: str
    google_gemini_model: str
    SQL_LITE_DB_URL: str
    secret_key: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    ALGORITHM: str

    model_config = SettingsConfigDict(env_file="../.env")

settings = Settings()