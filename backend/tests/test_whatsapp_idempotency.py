from decimal import Decimal
from uuid import uuid4

from app.modules.audit.models import AuditEvent
from app.modules.notifications.models import NotificationDelivery
from app.modules.payments.models import Payment


def test_whatsapp_delivery_idempotency_blocks_duplicate(
    client,
    auth_headers,
    create_user,
    create_user_service,
    db_session,
):
    user = create_user("+526141234567")
    service = create_user_service(user, Decimal("842.50"))
    client.patch(
        "/notification-preferences",
        headers=auth_headers(user),
        json={"channel": "whatsapp", "notification_type": "payment_receipt", "enabled": True, "source": "test"},
    )
    payment_response = client.post(
        "/payments",
        headers=auth_headers(user),
        json={"user_service_id": service.id, "idempotency_key": f"pay-{uuid4().hex}"},
    )
    receipt_id = db_session.get(Payment, payment_response.json()["id"]).receipt.id

    first = client.post(f"/notifications/whatsapp/receipts/{receipt_id}/send", headers=auth_headers(user))
    second = client.post(f"/notifications/whatsapp/receipts/{receipt_id}/send", headers=auth_headers(user))

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["id"] == second.json()["id"]
    assert db_session.query(NotificationDelivery).count() == 1
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "whatsapp.duplicate_blocked").count() == 1
