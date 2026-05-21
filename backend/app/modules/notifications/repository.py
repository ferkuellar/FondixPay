from sqlalchemy.orm import Session

from app.modules.audit.services import create_audit_event
from app.modules.notifications.models import Notification


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

