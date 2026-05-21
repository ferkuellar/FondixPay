from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.audit.services import create_audit_event
from app.modules.notifications.repository import get_for_user, list_for_user
from app.modules.notifications.schemas import NotificationRead
from app.modules.users.models import User

router = APIRouter()


@router.get("", response_model=list[NotificationRead])
def list_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_for_user(db, current_user.id)


@router.patch("/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification = get_for_user(db, notification_id, current_user.id)
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificacion no encontrada")
    notification.is_read = True
    context = get_request_context(request)
    create_audit_event(
        db,
        event_type="notification.read",
        actor_type="USER",
        actor_id=current_user.id,
        entity_type="Notification",
        entity_id=notification.id,
        metadata={"type": notification.type},
        request_id=context.request_id,
    )
    db.commit()
    db.refresh(notification)
    return notification

