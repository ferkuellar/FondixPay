from collections.abc import Mapping
from typing import Any

from app.modules.admin.permissions import normalize_role

SENSITIVE_KEY_PARTS = {
    "pan",
    "cvv",
    "token",
    "secret",
    "password",
    "raw_payload",
    "provider_payload",
}


def mask_phone(phone: str | None) -> str | None:
    if not phone:
        return phone
    return f"{'*' * max(len(phone) - 4, 0)}{phone[-4:]}"


def mask_email(email: str | None) -> str | None:
    if not email:
        return email
    local, separator, domain = email.partition("@")
    if not separator:
        return "[REDACTED]"
    visible = local[:1] if local else ""
    return f"{visible}{'*' * max(len(local) - 1, 1)}@{domain}"


def mask_card_last4(label: str | None = None, last4: str | None = None) -> str | None:
    if not label and not last4:
        return None
    safe_last4 = f" **** {last4[-4:]}" if last4 else ""
    return f"{label or 'Tarjeta'}{safe_last4}"


def redact_provider_reference(role: str | None, value: str | None) -> str | None:
    if value is None:
        return None
    normalized_role = normalize_role(role)
    if normalized_role in {"FINANCE", "ADMIN", "AUDITOR", "SUPER_ADMIN"}:
        return value
    if len(value) <= 4:
        return "[REDACTED]"
    return f"{'*' * min(len(value) - 4, 8)}{value[-4:]}"


def redact_sensitive_dict(data: Any) -> Any:
    if isinstance(data, Mapping):
        redacted: dict[str, Any] = {}
        for key, value in data.items():
            normalized_key = str(key).lower()
            if any(part in normalized_key for part in SENSITIVE_KEY_PARTS):
                continue
            redacted[str(key)] = redact_sensitive_dict(value)
        return redacted
    if isinstance(data, list):
        return [redact_sensitive_dict(item) for item in data]
    return data


def redact_user_for_role(user, role: str | None) -> dict[str, Any]:
    normalized_role = normalize_role(role)
    return {
        "id": user.id,
        "phone": user.phone if normalized_role in {"ADMIN", "SUPER_ADMIN"} else mask_phone(user.phone),
        "name": user.name,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }


def redact_payment_for_role(payment, role: str | None) -> dict[str, Any]:
    user_service = payment.user_service
    provider = user_service.provider
    return {
        "id": payment.id,
        "user_id": payment.user_id,
        "user_service_id": payment.user_service_id,
        "service_name": user_service.alias,
        "service_provider_name": provider.display_name,
        "service_reference_masked": _mask_reference(user_service.reference),
        "status": payment.status.value,
        "amount_minor": payment.amount_minor,
        "fee_minor": payment.fee_minor,
        "total_minor": payment.total_minor,
        "currency": payment.currency,
        "provider_reference": redact_provider_reference(role, payment.external_reference),
        "receipt_id": payment.receipt.id if payment.receipt is not None else None,
        "created_at": payment.created_at,
        "paid_at": payment.paid_at,
        "is_mock": payment.is_mock,
    }


def redact_receipt_for_role(receipt, role: str | None) -> dict[str, Any]:
    payment = receipt.payment
    return {
        "id": receipt.id,
        "payment_id": receipt.payment_id,
        "user_id": payment.user_id,
        "folio": receipt.folio,
        "message": receipt.message,
        "amount_minor": receipt.amount_minor,
        "fee_minor": receipt.fee_minor,
        "total_minor": receipt.total_minor,
        "currency": receipt.currency,
        "payment_status": payment.status.value,
        "provider_reference": redact_provider_reference(role, receipt.payment_reference),
        "created_at": receipt.created_at,
        "is_mock": receipt.is_mock,
    }


def _mask_reference(reference: str) -> str:
    if len(reference) <= 4:
        return "*" * len(reference)
    return f"{'*' * min(len(reference) - 4, 8)}{reference[-4:]}"
