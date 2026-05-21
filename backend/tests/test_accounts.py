from app.modules.audit.models import AuditEvent


def test_account_requires_auth(client):
    response = client.get("/account")

    assert response.status_code == 401


def test_account_creates_demo_account_for_current_user(client, auth_headers, db_session):
    response = client.get("/account", headers=auth_headers())

    assert response.status_code == 200
    body = response.json()
    assert body["account_type"] == "demo_account"
    assert body["currency"] == "MXN"
    assert body["is_demo"] is True
    assert body["status"] == "demo"
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "account.created").count() == 1


def test_each_user_gets_own_demo_account(client, auth_headers, create_user):
    user_a = create_user("5511111111")
    user_b = create_user("5522222222")

    account_a = client.get("/account", headers=auth_headers(user_a)).json()
    account_b = client.get("/account", headers=auth_headers(user_b)).json()

    assert account_a["id"] != account_b["id"]
