from sqlalchemy.orm import Session

from app.modules.notifications.models import Notification


def create_notification(db: Session, user_id: int, message: str) -> Notification:
    notification = Notification(user_id=user_id, message=message)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def list_for_user(db: Session, user_id: int) -> list[Notification]:
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.id.desc()).all()

