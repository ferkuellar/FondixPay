import secrets
from datetime import datetime, timedelta, timezone

from app.core.config import settings

_otp_store: dict[str, tuple[str, datetime]] = {}
OTP_TTL_MINUTES = 5
OTP_TTL_SECONDS = OTP_TTL_MINUTES * 60


def save_otp(phone: str) -> str:
    otp = settings.otp_dev_code if settings.allow_otp_dev_response else str(secrets.randbelow(1_000_000)).zfill(6)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES)
    _otp_store[phone] = (otp, expires_at)
    return otp


def consume_otp(phone: str, otp: str) -> bool:
    stored = _otp_store.get(phone)
    if stored is None:
        return False

    expected_otp, expires_at = stored
    if datetime.now(timezone.utc) > expires_at:
        _otp_store.pop(phone, None)
        return False

    is_valid = otp == expected_otp
    if is_valid:
        _otp_store.pop(phone, None)
    return is_valid
