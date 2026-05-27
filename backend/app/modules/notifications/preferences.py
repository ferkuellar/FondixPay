from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.modules.audit.services import create_audit_event
from app.modules.notifications.models import NotificationPreference
from app.modules.notifications.repository import create_default_preference, get_preference


def get_or_create_whatsapp_receipt_preference(db: Session, user_id: int) -> NotificationPreference:
    preference = get_preference(db, user_id, channel="whatsapp", notification_type="payment_receipt")
    if preference is not None:
        return preference
    return create_default_preference(db, user_id, channel="whatsapp", notification_type="payment_receipt")


def update_whatsapp_receipt_preference(
    db: Session,
    user_id: int,
    *,
    enabled: bool,
    source: str,
    request_id: str | None = None,
) -> NotificationPreference:
    preference = get_or_create_whatsapp_receipt_preference(db, user_id)
    now = datetime.now(timezone.utc)
    previous = preference.enabled
    preference.enabled = enabled
    preference.source = source
    if enabled:
        preference.consented_at = now
        preference.revoked_at = None
    else:
        preference.revoked_at = now
    if previous != enabled:
        create_audit_event(
            db,
            event_type="whatsapp.consent_granted" if enabled else "whatsapp.consent_revoked",
            actor_type="USER",
            actor_id=user_id,
            entity_type="NotificationPreference",
            entity_id=preference.id,
            result="success",
            metadata={"channel": "whatsapp", "notification_type": "payment_receipt", "source": source},
            request_id=request_id,
        )
    db.commit()
    db.refresh(preference)
    return preference
