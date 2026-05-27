from decimal import Decimal
from uuid import uuid4

from app.modules.notifications.models import NotificationDelivery
from app.modules.payments.models import Payment


def _successful_receipt(client, auth_headers, user, user_service):
    payment_response = client.post(
        "/payments",
        headers=auth_headers(user),
        json={"user_service_id": user_service.id, "idempotency_key": f"pay-{uuid4().hex}"},
    )
    assert payment_response.status_code == 201
    return payment_response.json()["id"]


def _enable_whatsapp(client, auth_headers, user):
    response = client.patch(
        "/notification-preferences",
        headers=auth_headers(user),
        json={"channel": "whatsapp", "notification_type": "payment_receipt", "enabled": True, "source": "test"},
    )
    assert response.status_code == 200


def test_no_whatsapp_send_without_consent(client, auth_headers, create_user, create_user_service, db_session):
    user = create_user("+526141234567")
    service = create_user_service(user, Decimal("842.50"))
    payment_id = _successful_receipt(client, auth_headers, user, service)
    receipt_id = db_session.get(Payment, payment_id).receipt.id

    response = client.post(f"/notifications/whatsapp/receipts/{receipt_id}/send", headers=auth_headers(user))

    assert response.status_code == 400
    assert db_session.query(NotificationDelivery).count() == 0


def test_successful_whatsapp_send_creates_delivery(client, auth_headers, create_user, create_user_service, db_session):
    user = create_user("+526141234567")
    service = create_user_service(user, Decimal("842.50"))
    _enable_whatsapp(client, auth_headers, user)
    payment_id = _successful_receipt(client, auth_headers, user, service)
    receipt_id = db_session.get(Payment, payment_id).receipt.id

    response = client.post(f"/notifications/whatsapp/receipts/{receipt_id}/send", headers=auth_headers(user))

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "sent"
    assert data["template_name"] == "fondix_pago_exitoso"
    assert data["recipient_masked"].endswith("4567")
    assert "+526141234567" not in str(data)
    assert data["metadata_json"]["template_payload"]["title"] == "Pago realizado"
    assert data["metadata_json"]["template_payload"]["short_success_copy"] == "Ya quedó! 🙌"
    assert data["metadata_json"]["template_payload"]["cta_label"] == "Ver en la app"


def test_no_send_if_receipt_not_confirmed(client, auth_headers, create_user, create_receipt):
    user = create_user("+526141234567")
    receipt = create_receipt(user)
    _enable_whatsapp(client, auth_headers, user)

    response = client.post(f"/notifications/whatsapp/receipts/{receipt.id}/send", headers=auth_headers(user))

    assert response.status_code == 400
