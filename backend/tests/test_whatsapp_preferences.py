from app.modules.audit.models import AuditEvent


def test_whatsapp_preference_defaults_disabled(client, auth_headers, create_user):
    user = create_user("+526141234567")
    response = client.get("/notification-preferences", headers=auth_headers(user))

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["channel"] == "whatsapp"
    assert data[0]["notification_type"] == "payment_receipt"
    assert data[0]["enabled"] is False
    assert data[0]["consented_at"] is None


def test_user_can_enable_and_revoke_whatsapp_consent(client, auth_headers, create_user, db_session):
    user = create_user("+526141234567")

    enabled = client.patch(
        "/notification-preferences",
        headers=auth_headers(user),
        json={"channel": "whatsapp", "notification_type": "payment_receipt", "enabled": True, "source": "profile"},
    )
    assert enabled.status_code == 200
    assert enabled.json()["enabled"] is True
    assert enabled.json()["consented_at"] is not None
    assert enabled.json()["revoked_at"] is None

    revoked = client.patch(
        "/notification-preferences",
        headers=auth_headers(user),
        json={"channel": "whatsapp", "notification_type": "payment_receipt", "enabled": False, "source": "profile"},
    )
    assert revoked.status_code == 200
    assert revoked.json()["enabled"] is False
    assert revoked.json()["revoked_at"] is not None

    events = {event.event_type for event in db_session.query(AuditEvent).all()}
    assert "whatsapp.consent_granted" in events
    assert "whatsapp.consent_revoked" in events
