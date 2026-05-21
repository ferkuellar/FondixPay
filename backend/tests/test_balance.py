from app.modules.audit.models import AuditEvent


def test_balance_requires_auth(client):
    response = client.get("/account/balance")

    assert response.status_code == 401


def test_balance_returns_demo_minor_unit_fields(client, auth_headers, db_session):
    response = client.get("/account/balance", headers=auth_headers())

    assert response.status_code == 200
    body = response.json()
    assert body["label"] == "Saldo demo"
    assert body["disclaimer"] == "Este saldo es simulado y no representa dinero real."
    assert body["is_demo"] is True
    assert body["is_real_money"] is False
    assert body["currency"] == "MXN"
    assert all(isinstance(body[field], int) for field in ("available_minor", "pending_minor", "held_minor", "simulated_minor"))
    assert body["available_minor"] == body["simulated_minor"] == 250000
    assert body["pending_minor"] == 0
    assert body["held_minor"] == 0
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "balance.viewed").count() == 1
