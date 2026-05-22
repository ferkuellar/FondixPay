from app.modules.audit.models import AuditEvent


def test_support_user_views_are_masked_and_audited(client, db_session, create_user, auth_headers) -> None:
    support = create_user("5511000000", "SUPPORT")
    customer = create_user("5511223344")

    response = client.get(f"/admin/users/{customer.id}", headers=auth_headers(support))
    payload = response.json()

    assert response.status_code == 200
    assert payload["phone"].endswith("3344")
    assert payload["phone"] != customer.phone
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "admin.user_viewed").count() == 1
