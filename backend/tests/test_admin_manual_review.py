from app.modules.audit.models import AuditEvent


def test_finance_can_create_and_update_manual_review(client, db_session, create_user, auth_headers) -> None:
    finance = create_user("5515000000", "FINANCE")
    headers = auth_headers(finance)

    created = client.post(
        "/admin/manual-review",
        headers=headers,
        json={"case_type": "provider_timeout", "severity": "high", "correlation_id": "corr_demo_10b"},
    )
    case_id = created.json()["id"]
    updated = client.patch(
        f"/admin/manual-review/{case_id}",
        headers=headers,
        json={"status": "investigating", "resolution": "Esperando confirmacion sandbox."},
    )

    assert created.status_code == 201
    assert updated.json()["status"] == "investigating"
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "admin.manual_review_created").count() == 1
