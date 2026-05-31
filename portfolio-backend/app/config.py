from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    ADMIN_PASSWORD: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 1440   # 24 hours

    UPLOADCARE_PUBLIC_KEY: str
    UPLOADCARE_SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
