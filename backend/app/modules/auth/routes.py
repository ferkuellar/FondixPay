from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.auth.schemas import LogoutResponse, OtpSentResponse, OtpVerifyRequest, PhoneLoginRequest, TokenResponse
from app.modules.auth.services import request_otp, verify_otp
from app.modules.users.models import User
from app.modules.users.schemas import UserRead

router = APIRouter()


@router.post("/request-otp", response_model=OtpSentResponse)
def request_login_code(payload: PhoneLoginRequest, request: Request, db: Session = Depends(get_db)) -> dict[str, str]:
    return request_otp(db, payload.phone, get_request_context(request))


@router.post("/verify-otp", response_model=TokenResponse)
def verify_login_code(payload: OtpVerifyRequest, request: Request, db: Session = Depends(get_db)) -> TokenResponse:
    return verify_otp(db, payload.phone, payload.otp, get_request_context(request))


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/logout", response_model=LogoutResponse)
def logout(_current_user: User = Depends(get_current_user)) -> dict[str, str]:
    return {"message": "Sesion cerrada"}
