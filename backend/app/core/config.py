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
    cors_origins: str = "http://localhost:19006,http://localhost:8081,http://localhost:4173,http://127.0.0.1:4173,http://localhost:5200"
    fondix_fee_minor: int = 750
    card_processor_provider: str = "mock"
    card_processor_env: str = "sandbox"
    card_processor_api_base_url: str = ""
    card_processor_public_key: str = ""
    card_processor_secret_key: str = ""
    card_processor_webhook_secret: str = ""
    card_processor_timeout_seconds: int = 15
    whatsapp_provider: str = "mock"
    whatsapp_env: str = "sandbox"
    whatsapp_enable_receipt_mvp: bool = False
    whatsapp_template_payment_success: str = "fondix_pago_exitoso"
    whatsapp_provider_api_base_url: str = ""
    whatsapp_provider_token: str = ""
    whatsapp_webhook_secret: str = ""
    whatsapp_timeout_seconds: int = 10
    chatbot_ai_provider: str = ""
    chatbot_ai_api_key: str = ""
    chatbot_ai_model: str = ""
    chatbot_max_message_length: int = 500
    resend_api_key: str = ""
    resend_from_email: str = "contacto@fondixpay.com"
    resend_to_email: str = "fernando.cuellar@fondixpay.com"
    admin_init_phone: str = ""

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

