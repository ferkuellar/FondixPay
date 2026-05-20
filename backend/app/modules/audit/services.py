from collections.abc import Mapping
from hashlib import sha256
from typing import Any

from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent
from app.modules.audit.repository import create

SENSITIVE_KEYS = {
    "otp",
    "otp_dev",
    "token",
    "access_token",
    "password",
    "secret",
    "jwt",
    "pan",
    "cvv",
    "card_number",
}


def hash_value(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()


def redact_payload(payload: Any) -> Any:
    if payload is None:
        return None
    if isinstance(payload, Mapping):
        redacted: dict[str, Any] = {}
        for key, value in payload.items():
            normalized = str(key).lower()
            if normalized in SENSITIVE_KEYS or any(sensitive in normalized for sensitive in SENSITIVE_KEYS):
                redacted[str(key)] = "[REDACTED]"
            else:
                redacted[str(key)] = redact_payload(value)
        return redacted
    if isinstance(payload, list):
        return [redact_payload(item) for item in payload]
    return payload


def create_audit_event(
    db: Session,
    *,
    event_type: str,
    actor_type: str = "SYSTEM",
    actor_id: str | int | None = None,
    entity_type: str | None = None,
    entity_id: str | int | None = None,
    result: str = "success",
    before: dict | None = None,
    after: dict | None = None,
    metadata: dict | None = None,
    request_id: str | None = None,
    correlation_id: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> AuditEvent:
    event = AuditEvent(
        event_type=event_type,
        actor_type=actor_type,
        actor_id=str(actor_id) if actor_id is not None else None,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else None,
        result=result,
        before_json=redact_payload(before),
        after_json=redact_payload(after),
        metadata_json=redact_payload(metadata),
        request_id=request_id,
        correlation_id=correlation_id,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    return create(db, event)
