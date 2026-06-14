from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import create_access_token
from app.modules.audit.services import create_audit_event, hash_value
from app.modules.auth.models import OTP_TTL_SECONDS, consume_otp, save_otp
from app.modules.admin.permissions import ADMIN_ROLES, normalize_role
from app.modules.users.repository import get_by_phone

import re
from datetime import timedelta

PHONE_PATTERN = re.compile(r"^\d{10,15}$")
ADMIN_TOKEN_TTL = timedelta(hours=8)

router = APIRouter()


def _normalize_phone(value: str) -> str:
    phone = re.sub(r"\D", "", value)
    if not PHONE_PATTERN.fullmatch(phone):
        raise ValueError("Ingresa un telefono valido")
    return phone


class AdminOtpRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=20)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        return _normalize_phone(value)


class AdminOtpVerifyRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=20)
    otp: str = Field(min_length=6, max_length=6)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        return _normalize_phone(value)

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, value: str) -> str:
        otp = value.strip()
        if not otp.isdigit():
            raise ValueError("Ingresa el codigo de 6 digitos")
        return otp


class AdminOtpSentResponse(BaseModel):
    message: str
    expires_in_seconds: int
    otp_dev: str | None = None


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    expires_in: int


def _require_admin_user(db: Session, phone: str):
    user = get_by_phone(db, phone)
    if user is None or normalize_role(user.role) not in ADMIN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este telefono no tiene acceso admin",
        )
    return user


@router.post("/request-otp", response_model=AdminOtpSentResponse)
def admin_request_otp(
    payload: AdminOtpRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> AdminOtpSentResponse:
    _require_admin_user(db, payload.phone)
    otp = save_otp(payload.phone)
    ctx = get_request_context(request)
    create_audit_event(
        db,
        event_type="admin.auth.otp_requested",
        actor_type="ADMIN",
        result="success",
        metadata={"phone_hash": hash_value(payload.phone)},
        request_id=ctx.request_id,
        correlation_id=ctx.correlation_id,
        ip_address=ctx.ip_address,
        user_agent=ctx.user_agent,
    )
    db.commit()
    response = AdminOtpSentResponse(message="Codigo enviado", expires_in_seconds=OTP_TTL_SECONDS)
    if settings.allow_otp_dev_response:
        response.otp_dev = otp
    return response


@router.post("/verify-otp", response_model=AdminTokenResponse)
def admin_verify_otp(
    payload: AdminOtpVerifyRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> AdminTokenResponse:
    ctx = get_request_context(request)
    if not consume_otp(payload.phone, payload.otp):
        create_audit_event(
            db,
            event_type="admin.auth.login_failed",
            actor_type="ADMIN",
            result="failure",
            metadata={"phone_hash": hash_value(payload.phone), "reason": "invalid_otp"},
            request_id=ctx.request_id,
            correlation_id=ctx.correlation_id,
            ip_address=ctx.ip_address,
            user_agent=ctx.user_agent,
        )
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Codigo incorrecto")

    user = _require_admin_user(db, payload.phone)
    token = create_access_token(str(user.id), expires_delta=ADMIN_TOKEN_TTL)
    role = normalize_role(user.role)
    create_audit_event(
        db,
        event_type="admin.auth.login_success",
        actor_type="ADMIN",
        actor_id=user.id,
        entity_type="User",
        entity_id=user.id,
        result="success",
        metadata={"phone_hash": hash_value(payload.phone), "role": role},
        request_id=ctx.request_id,
        correlation_id=ctx.correlation_id,
        ip_address=ctx.ip_address,
        user_agent=ctx.user_agent,
    )
    db.commit()
    return AdminTokenResponse(
        access_token=token,
        role=role,
        expires_in=int(ADMIN_TOKEN_TTL.total_seconds()),
    )
