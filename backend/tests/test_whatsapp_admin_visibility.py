from decimal import Decimal
from uuid import uuid4

from app.modules.payments.models import Payment


def test_admin_can_list_whatsapp_deliveries_without_full_phone(
    client,
    auth_headers,
    create_user,
    create_user_service,
    db_session,
):
    user = create_user("+526141234567")
    admin = create_user("+525500000001", role="ADMIN")
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
    client.post(f"/notifications/whatsapp/receipts/{receipt_id}/send", headers=auth_headers(user))

    response = client.get("/admin/notifications/deliveries", headers=auth_headers(admin))

    assert response.status_code == 200
    body = response.json()
    assert body[0]["template_name"] == "fondix_pago_exitoso"
    assert body[0]["recipient_masked"].endswith("4567")
    assert "+526141234567" not in str(body)


def test_non_admin_cannot_list_admin_whatsapp_deliveries(client, auth_headers, create_user):
    user = create_user("+526141234567")

    response = client.get("/admin/notifications/deliveries", headers=auth_headers(user))

    assert response.status_code == 403
