from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.schemas import OtpSentResponse, OtpVerifyRequest, PhoneLoginRequest, TokenResponse
from app.modules.auth.services import request_otp, verify_otp

router = APIRouter()


@router.post("/request-otp", response_model=OtpSentResponse)
def request_login_code(payload: PhoneLoginRequest) -> dict[str, str]:
    return request_otp(payload.phone)


@router.post("/verify-otp", response_model=TokenResponse)
def verify_login_code(payload: OtpVerifyRequest, db: Session = Depends(get_db)) -> TokenResponse:
    return verify_otp(db, payload.phone, payload.otp)

