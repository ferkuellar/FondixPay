from decimal import Decimal
from uuid import uuid4

from app.modules.audit.models import AuditEvent
from app.modules.payments.models import Payment


def _create_delivery(client, auth_headers, create_user_service, db_session, user):
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
    return client.post(f"/notifications/whatsapp/receipts/{receipt_id}/send", headers=auth_headers(user)).json()


def test_whatsapp_delivery_response_does_not_expose_sensitive_values(
    client,
    auth_headers,
    create_user,
    create_user_service,
    db_session,
):
    user = create_user("+526141234567")
    delivery = _create_delivery(client, auth_headers, create_user_service, db_session, user)
    body = str(delivery).lower()

    assert "+526141234567" not in body
    assert "pan" not in body
    assert "cvv" not in body
    assert "card_token" not in body
    assert "provider_token" not in body
    assert "secret" not in body


def test_user_cannot_access_other_user_deliveries(client, auth_headers, create_user, create_user_service, db_session):
    owner = create_user("+526141234567")
    other = create_user("+525512349999")
    _create_delivery(client, auth_headers, create_user_service, db_session, owner)

    response = client.get("/notifications/deliveries", headers=auth_headers(other))

    assert response.status_code == 200
    assert response.json() == []


def test_audit_metadata_uses_masked_recipient(client, auth_headers, create_user, create_user_service, db_session):
    user = create_user("+526141234567")
    _create_delivery(client, auth_headers, create_user_service, db_session, user)

    audit_body = str([event.metadata_json for event in db_session.query(AuditEvent).all()])

    assert "+526141234567" not in audit_body
    assert "4567" in audit_body
