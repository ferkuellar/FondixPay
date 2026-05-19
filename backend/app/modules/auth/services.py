from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.modules.auth.models import consume_otp, save_otp
from app.modules.auth.schemas import TokenResponse
from app.modules.users.repository import get_or_create_by_phone


def request_otp(phone: str) -> dict[str, str]:
    otp = save_otp(phone)
    return {
        "message": "Codigo enviado",
        "otp_dev": otp,
    }


def verify_otp(db: Session, phone: str, otp: str) -> TokenResponse:
    if not consume_otp(phone, otp):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Codigo incorrecto")
    user = get_or_create_by_phone(db, phone)
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=user)
