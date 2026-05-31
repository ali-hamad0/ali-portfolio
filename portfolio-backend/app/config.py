from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    ADMIN_PASSWORD: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 1440   # 24 hours

    UPLOADCARE_PUBLIC_KEY: str
    UPLOADCARE_SECRET_KEY: str

    @field_validator("DATABASE_URL", "ADMIN_PASSWORD", "JWT_SECRET",
                     "UPLOADCARE_PUBLIC_KEY", "UPLOADCARE_SECRET_KEY", mode="before")
    @classmethod
    def strip_strings(cls, v: str) -> str:
        return v.strip()

    class Config:
        env_file = ".env"

settings = Settings()
