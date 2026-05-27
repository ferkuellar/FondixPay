from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.audit.services import create_audit_event
from app.modules.notifications.preferences import (
    get_or_create_whatsapp_receipt_preference,
    update_whatsapp_receipt_preference,
)
from app.modules.notifications.repository import get_for_user, list_deliveries_for_user, list_for_user
from app.modules.notifications.schemas import (
    NotificationDeliveryRead,
    NotificationPreferenceRead,
    NotificationPreferenceUpdate,
    NotificationRead,
)
from app.modules.notifications.services import send_whatsapp_receipt
from app.modules.users.models import User

router = APIRouter()
preferences_router = APIRouter()


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


@router.get("/deliveries", response_model=list[NotificationDeliveryRead])
def list_notification_deliveries(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_deliveries_for_user(db, current_user.id, limit=limit, offset=offset)


@router.post("/whatsapp/receipts/{receipt_id}/send", response_model=NotificationDeliveryRead)
def send_whatsapp_receipt_delivery(
    receipt_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    context = get_request_context(request)
    return send_whatsapp_receipt(
        db,
        receipt_id=receipt_id,
        user_id=current_user.id,
        triggered_by="manual",
        request_id=context.request_id,
        correlation_id=context.correlation_id,
    )


@preferences_router.get("", response_model=list[NotificationPreferenceRead])
def list_notification_preferences(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    preference = get_or_create_whatsapp_receipt_preference(db, current_user.id)
    db.commit()
    db.refresh(preference)
    return [preference]


@preferences_router.patch("", response_model=NotificationPreferenceRead)
def patch_notification_preference(
    payload: NotificationPreferenceUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    context = get_request_context(request)
    return update_whatsapp_receipt_preference(
        db,
        current_user.id,
        enabled=payload.enabled,
        source=payload.source,
        request_id=context.request_id,
    )

