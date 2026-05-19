import re

from pydantic import BaseModel, Field, field_validator

from app.modules.users.schemas import UserRead

PHONE_PATTERN = re.compile(r"^\d{10,15}$")


def normalize_phone(value: str) -> str:
    phone = re.sub(r"\D", "", value)
    if not PHONE_PATTERN.fullmatch(phone):
        raise ValueError("Ingresa un telefono valido")
    return phone


class PhoneLoginRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=20)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        return normalize_phone(value)


class OtpVerifyRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=20)
    otp: str = Field(min_length=6, max_length=6)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        return normalize_phone(value)

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, value: str) -> str:
        otp = value.strip()
        if not otp.isdigit():
            raise ValueError("Ingresa el codigo de 6 digitos")
        return otp


class OtpSentResponse(BaseModel):
    message: str
    otp_dev: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class LogoutResponse(BaseModel):
    message: str
