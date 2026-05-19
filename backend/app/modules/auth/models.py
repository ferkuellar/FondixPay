from datetime import datetime, timedelta, timezone

from app.core.config import settings

_otp_store: dict[str, tuple[str, datetime]] = {}
OTP_TTL_MINUTES = 5


def save_otp(phone: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES)
    _otp_store[phone] = (settings.otp_dev_code, expires_at)
    return settings.otp_dev_code


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
