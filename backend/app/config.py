from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    GROQ_API_KEY: str
    google_embedding_model: str
    google_gemini_model: str

    model_config = SettingsConfigDict(env_file="../.env")

settings = Settings()