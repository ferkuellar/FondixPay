from hashlib import sha256
from re import sub

from sqlalchemy.orm import Session

from app.modules.notifications.models import NotificationDelivery
from app.modules.notifications.repository import get_delivery_by_idempotency


def normalize_phone(phone: str | None) -> str:
    return sub(r"\D", "", phone or "")


def is_valid_whatsapp_recipient(phone: str | None) -> bool:
    digits = normalize_phone(phone)
    return 10 <= len(digits) <= 15


def hash_recipient(phone: str) -> str:
    return sha256(normalize_phone(phone).encode("utf-8")).hexdigest()


def mask_recipient(phone: str) -> str:
    digits = normalize_phone(phone)
    if len(digits) <= 4:
        return "***"
    return f"+{'*' * max(len(digits) - 4, 6)}{digits[-4:]}"


def build_delivery_idempotency_key(
    receipt_id: int,
    *,
    channel: str,
    template_name: str,
    recipient_hash: str,
) -> str:
    return f"receipt:{receipt_id}:{channel}:{template_name}:{recipient_hash}"


def create_delivery(
    db: Session,
    *,
    user_id: int,
    channel: str,
    notification_type: str,
    template_name: str,
    entity_type: str,
    entity_id: str | int,
    recipient_hash: str,
    recipient_masked: str,
    idempotency_key: str,
    metadata_json: dict,
) -> tuple[NotificationDelivery, bool]:
    existing = get_delivery_by_idempotency(db, idempotency_key)
    if existing is not None:
        return existing, False

    delivery = NotificationDelivery(
        user_id=user_id,
        channel=channel,
        notification_type=notification_type,
        template_name=template_name,
        entity_type=entity_type,
        entity_id=str(entity_id),
        recipient_hash=recipient_hash,
        recipient_masked=recipient_masked,
        status="created",
        idempotency_key=idempotency_key,
        metadata_json=metadata_json,
    )
    db.add(delivery)
    db.flush()
    return delivery, True
