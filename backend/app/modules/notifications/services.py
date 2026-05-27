from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.audit.services import create_audit_event
from app.modules.notifications.delivery import (
    build_delivery_idempotency_key,
    create_delivery,
    hash_recipient,
    is_valid_whatsapp_recipient,
    mask_recipient,
)
from app.modules.notifications.preferences import get_or_create_whatsapp_receipt_preference
from app.modules.notifications.providers.whatsapp_errors import WhatsAppProviderError
from app.modules.notifications.providers.whatsapp_interface import WhatsAppProvider
from app.modules.notifications.providers.whatsapp_mock import WhatsAppMockProvider
from app.modules.notifications.templates.whatsapp_templates import (
    PAYMENT_SUCCESS_TEMPLATE,
    build_payment_success_template,
)
from app.modules.receipts.services import build_receipt_proof
from app.modules.users.models import User

CHANNEL = "whatsapp"
NOTIFICATION_TYPE = "payment_receipt"


def provider_from_settings() -> WhatsAppProvider:
    return WhatsAppMockProvider()


def send_whatsapp_receipt(
    db: Session,
    *,
    receipt_id: int,
    user_id: int,
    triggered_by: str,
    request_id: str | None = None,
    correlation_id: str | None = None,
    provider: WhatsAppProvider | None = None,
) -> object:
    proof = build_receipt_proof(db, receipt_id, user_id)
    if proof.payment_status != "succeeded":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El pago no esta confirmado")
    if proof.receipt_status != "generated" or proof.proof_status != "confirmed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El comprobante no esta confirmado")

    preference = get_or_create_whatsapp_receipt_preference(db, user_id)
    if not preference.enabled or preference.consented_at is None:
        create_audit_event(
            db,
            event_type="whatsapp.receipt_send_skipped_no_consent",
            actor_type="SYSTEM" if triggered_by == "payment_success" else "USER",
            actor_id=user_id,
            entity_type="Receipt",
            entity_id=receipt_id,
            result="skipped",
            metadata={"channel": CHANNEL, "notification_type": NOTIFICATION_TYPE, "triggered_by": triggered_by},
            request_id=request_id,
            correlation_id=correlation_id,
        )
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Consentimiento de WhatsApp no activo")

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    if not is_valid_whatsapp_recipient(user.phone):
        create_audit_event(
            db,
            event_type="whatsapp.receipt_send_skipped_invalid_recipient",
            actor_type="SYSTEM" if triggered_by == "payment_success" else "USER",
            actor_id=user_id,
            entity_type="Receipt",
            entity_id=receipt_id,
            result="skipped",
            metadata={"channel": CHANNEL, "notification_type": NOTIFICATION_TYPE, "triggered_by": triggered_by},
            request_id=request_id,
            correlation_id=correlation_id,
        )
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Telefono no valido para WhatsApp")

    template_name = settings.whatsapp_template_payment_success or PAYMENT_SUCCESS_TEMPLATE
    template_payload = build_payment_success_template(proof)
    recipient_hash = hash_recipient(user.phone)
    recipient_masked = mask_recipient(user.phone)
    idempotency_key = build_delivery_idempotency_key(
        receipt_id,
        channel=CHANNEL,
        template_name=template_name,
        recipient_hash=recipient_hash,
    )
    delivery, created = create_delivery(
        db,
        user_id=user_id,
        channel=CHANNEL,
        notification_type=NOTIFICATION_TYPE,
        template_name=template_name,
        entity_type="Receipt",
        entity_id=receipt_id,
        recipient_hash=recipient_hash,
        recipient_masked=recipient_masked,
        idempotency_key=idempotency_key,
        metadata_json={
            "template_payload": template_payload,
            "triggered_by": triggered_by,
            "receipt_reference": proof.internal_reference,
        },
    )
    if not created:
        create_audit_event(
            db,
            event_type="whatsapp.duplicate_blocked",
            actor_type="SYSTEM" if triggered_by == "payment_success" else "USER",
            actor_id=user_id,
            entity_type="NotificationDelivery",
            entity_id=delivery.id,
            result="blocked",
            metadata={"channel": CHANNEL, "template_name": template_name, "receipt_id": receipt_id},
            request_id=request_id,
            correlation_id=correlation_id,
        )
        db.commit()
        return delivery

    create_audit_event(
        db,
        event_type="notification.delivery_created",
        actor_type="SYSTEM",
        entity_type="NotificationDelivery",
        entity_id=delivery.id,
        result="success",
        metadata={"channel": CHANNEL, "template_name": template_name, "entity_type": "Receipt"},
        request_id=request_id,
        correlation_id=correlation_id,
    )
    create_audit_event(
        db,
        event_type="whatsapp.receipt_send_requested",
        actor_type="SYSTEM" if triggered_by == "payment_success" else "USER",
        actor_id=user_id,
        entity_type="Receipt",
        entity_id=receipt_id,
        result="success",
        metadata={"channel": CHANNEL, "template_name": template_name, "recipient_masked": recipient_masked},
        request_id=request_id,
        correlation_id=correlation_id,
    )
    delivery.status = "sending"
    delivery.provider_name = (provider or provider_from_settings()).provider_name
    db.flush()

    sender = provider or provider_from_settings()
    try:
        result = sender.send_template_message(
            recipient_phone=user.phone,
            template_name=template_name,
            template_params=template_payload,
            idempotency_key=idempotency_key,
            correlation_id=correlation_id,
        )
        delivery.status = result.status
        delivery.provider_name = result.provider_name
        delivery.provider_message_id = result.provider_message_id
        event_type = "whatsapp.receipt_send_succeeded"
        result_value = "success"
    except WhatsAppProviderError as exc:
        delivery.status = "failed"
        delivery.error_code = exc.code
        delivery.error_message_safe = exc.safe_message
        event_type = "whatsapp.receipt_send_failed"
        result_value = "failed"

    create_audit_event(
        db,
        event_type=event_type,
        actor_type="SYSTEM",
        entity_type="NotificationDelivery",
        entity_id=delivery.id,
        result=result_value,
        metadata={"channel": CHANNEL, "template_name": template_name, "status": delivery.status},
        request_id=request_id,
        correlation_id=correlation_id,
    )
    create_audit_event(
        db,
        event_type="notification.delivery_status_updated",
        actor_type="SYSTEM",
        entity_type="NotificationDelivery",
        entity_id=delivery.id,
        result=result_value,
        metadata={"status": delivery.status, "error_code": delivery.error_code},
        request_id=request_id,
        correlation_id=correlation_id,
    )
    db.commit()
    db.refresh(delivery)
    return delivery
