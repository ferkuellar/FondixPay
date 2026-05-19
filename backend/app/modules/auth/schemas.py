from pydantic import BaseModel, Field

from app.modules.users.schemas import UserRead


class PhoneLoginRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=20)


class OtpVerifyRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=20)
    otp: str = Field(min_length=4, max_length=8)


class OtpSentResponse(BaseModel):
    message: str
    dev_otp: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

