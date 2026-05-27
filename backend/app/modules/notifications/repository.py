from sqlalchemy.orm import Session

from app.modules.audit.services import create_audit_event
from app.modules.notifications.models import Notification, NotificationDelivery, NotificationPreference


def create_notification(
    db: Session,
    user_id: int,
    message: str,
    *,
    notification_type: str = "general",
    title: str = "Actualizacion",
    entity_type: str | None = None,
    entity_id: str | int | None = None,
    correlation_id: str | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else None,
    )
    db.add(notification)
    db.flush()
    create_audit_event(
        db,
        event_type="notification.created",
        actor_type="SYSTEM",
        entity_type="Notification",
        entity_id=notification.id,
        metadata={"type": notification_type, "entity_type": entity_type, "entity_id": entity_id},
        correlation_id=correlation_id,
    )
    db.commit()
    db.refresh(notification)
    return notification


def list_for_user(db: Session, user_id: int) -> list[Notification]:
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.id.desc()).all()


def get_for_user(db: Session, notification_id: int, user_id: int) -> Notification | None:
    return (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == user_id)
        .one_or_none()
    )


def get_preference(
    db: Session,
    user_id: int,
    *,
    channel: str = "whatsapp",
    notification_type: str = "payment_receipt",
) -> NotificationPreference | None:
    return (
        db.query(NotificationPreference)
        .filter(
            NotificationPreference.user_id == user_id,
            NotificationPreference.channel == channel,
            NotificationPreference.notification_type == notification_type,
        )
        .one_or_none()
    )


def list_preferences(db: Session, user_id: int) -> list[NotificationPreference]:
    return (
        db.query(NotificationPreference)
        .filter(NotificationPreference.user_id == user_id)
        .order_by(NotificationPreference.id.asc())
        .all()
    )


def create_default_preference(
    db: Session,
    user_id: int,
    *,
    channel: str = "whatsapp",
    notification_type: str = "payment_receipt",
) -> NotificationPreference:
    preference = NotificationPreference(
        user_id=user_id,
        channel=channel,
        notification_type=notification_type,
        enabled=False,
        source="default",
    )
    db.add(preference)
    db.flush()
    return preference


def get_delivery_by_idempotency(db: Session, idempotency_key: str) -> NotificationDelivery | None:
    return (
        db.query(NotificationDelivery)
        .filter(NotificationDelivery.idempotency_key == idempotency_key)
        .one_or_none()
    )


def get_delivery_for_user(db: Session, delivery_id: int, user_id: int) -> NotificationDelivery | None:
    return (
        db.query(NotificationDelivery)
        .filter(NotificationDelivery.id == delivery_id, NotificationDelivery.user_id == user_id)
        .one_or_none()
    )


def get_delivery(db: Session, delivery_id: int) -> NotificationDelivery | None:
    return db.query(NotificationDelivery).filter(NotificationDelivery.id == delivery_id).one_or_none()


def list_deliveries_for_user(db: Session, user_id: int, limit: int = 50, offset: int = 0) -> list[NotificationDelivery]:
    return (
        db.query(NotificationDelivery)
        .filter(NotificationDelivery.user_id == user_id)
        .order_by(NotificationDelivery.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def list_deliveries(
    db: Session,
    *,
    status: str | None = None,
    template_name: str | None = None,
    user_id: int | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[NotificationDelivery]:
    query = db.query(NotificationDelivery)
    if status:
        query = query.filter(NotificationDelivery.status == status)
    if template_name:
        query = query.filter(NotificationDelivery.template_name == template_name)
    if user_id:
        query = query.filter(NotificationDelivery.user_id == user_id)
    return query.order_by(NotificationDelivery.id.desc()).offset(offset).limit(limit).all()

