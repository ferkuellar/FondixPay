from typing import Literal

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

AppEnv = Literal["development", "test", "staging", "production"]

WEAK_JWT_SECRET_VALUES = {
    "",
    "change-me",
    "change-me-in-local-env",
    "changeme",
    "dev-secret",
    "secret",
    "password",
    "123456",
}


class Settings(BaseSettings):
    database_url: str = "sqlite:///./fondix_pay_dev.db"
    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    otp_dev_code: str = "123456"
    otp_dev_response_enabled: bool = True
    app_env: AppEnv = "development"
    cors_origins: str = "http://localhost:19006,http://localhost:8081"
    fondix_fee_minor: int = 750

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"

    @property
    def is_test(self) -> bool:
        return self.app_env == "test"

    @property
    def is_production_like(self) -> bool:
        return self.app_env in {"staging", "production"}

    @property
    def allow_otp_dev_response(self) -> bool:
        return self.otp_dev_response_enabled and (self.is_development or self.is_test)

    @model_validator(mode="after")
    def validate_security_settings(self) -> "Settings":
        if not self.is_production_like:
            return self

        normalized_secret = self.jwt_secret_key.strip().lower()
        if normalized_secret in WEAK_JWT_SECRET_VALUES or len(self.jwt_secret_key.strip()) < 32:
            raise ValueError("JWT_SECRET_KEY must be strong in staging and production")

        if self.otp_dev_response_enabled:
            raise ValueError("OTP_DEV_RESPONSE_ENABLED must be false in staging and production")

        origins = self.cors_origins_list
        if not origins or "*" in origins:
            raise ValueError("CORS_ORIGINS must be explicit in staging and production")

        return self


settings = Settings()

