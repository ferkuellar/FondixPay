from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.request_context import RequestContext
from app.core.security import create_access_token
from app.modules.audit.services import create_audit_event, hash_value
from app.modules.auth.models import OTP_TTL_SECONDS, consume_otp, save_otp
from app.modules.auth.schemas import TokenResponse
from app.modules.notifications.providers.sms_errors import SmsProviderError
from app.modules.users.repository import get_or_create_by_phone

_OTP_BODY = "Tu código de acceso FondixPay es: {otp}. Válido por 5 minutos. No lo compartas."


def _get_sms_provider():
    if settings.sms_provider != "twilio":
        return None
    if not settings.twilio_account_sid or not settings.twilio_auth_token or not settings.twilio_from_number:
        return None
    from app.modules.notifications.providers.sms_twilio import TwilioSmsProvider
    return TwilioSmsProvider(
        account_sid=settings.twilio_account_sid,
        auth_token=settings.twilio_auth_token,
        from_number=settings.twilio_from_number,
        timeout=settings.twilio_timeout_seconds,
    )


def _send_otp_sms(phone: str, otp: str) -> None:
    provider = _get_sms_provider()
    if provider is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="sms_unavailable")
    try:
        provider.send_sms(to=phone, body=_OTP_BODY.format(otp=otp))
    except SmsProviderError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="sms_send_failed")


def request_otp(
    db_or_phone: Session | str,
    phone: str | None = None,
    request_context: RequestContext | None = None,
) -> dict[str, str | int]:
    legacy_call_without_db = phone is None
    if legacy_call_without_db:
        phone = str(db_or_phone)

    otp = save_otp(phone)

    if not settings.allow_otp_dev_response:
        _send_otp_sms(phone, otp)

    if not legacy_call_without_db:
        db = db_or_phone
        context = request_context or RequestContext()
        create_audit_event(
            db,
            event_type="auth.otp_requested",
            actor_type="USER",
            result="success",
            metadata={"phone_hash": hash_value(phone), "expires_in_seconds": OTP_TTL_SECONDS},
            request_id=context.request_id,
            correlation_id=context.correlation_id,
            ip_address=context.ip_address,
            user_agent=context.user_agent,
        )
        db.commit()
    response: dict[str, str | int] = {
        "message": "Codigo enviado",
        "expires_in_seconds": OTP_TTL_SECONDS,
    }
    if settings.allow_otp_dev_response:
        response["otp_dev"] = otp
    return response


def verify_otp(db: Session, phone: str, otp: str, request_context: RequestContext | None = None) -> TokenResponse:
    context = request_context or RequestContext()
    if not consume_otp(phone, otp):
        create_audit_event(
            db,
            event_type="auth.login_failed",
            actor_type="USER",
            result="failure",
            metadata={"phone_hash": hash_value(phone), "reason": "invalid_otp"},
            request_id=context.request_id,
            correlation_id=context.correlation_id,
            ip_address=context.ip_address,
            user_agent=context.user_agent,
        )
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Codigo incorrecto")
    user = get_or_create_by_phone(db, phone)
    token = create_access_token(str(user.id))
    create_audit_event(
        db,
        event_type="auth.otp_verified",
        actor_type="USER",
        actor_id=user.id,
        entity_type="User",
        entity_id=user.id,
        result="success",
        metadata={"phone_hash": hash_value(phone)},
        request_id=context.request_id,
        correlation_id=context.correlation_id,
        ip_address=context.ip_address,
        user_agent=context.user_agent,
    )
    create_audit_event(
        db,
        event_type="auth.login_success",
        actor_type="USER",
        actor_id=user.id,
        entity_type="User",
        entity_id=user.id,
        result="success",
        request_id=context.request_id,
        correlation_id=context.correlation_id,
        ip_address=context.ip_address,
        user_agent=context.user_agent,
    )
    db.commit()
    return TokenResponse(access_token=token, user=user)
