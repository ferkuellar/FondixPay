from app.modules.audit.models import AuditEvent


def test_support_can_create_update_and_note_ticket(client, db_session, create_user, auth_headers) -> None:
    support = create_user("5514000000", "SUPPORT")
    headers = auth_headers(support)

    created = client.post(
        "/admin/support/tickets",
        headers=headers,
        json={"subject": "Recibo no disponible", "category": "receipt_missing", "priority": "high"},
    )
    ticket_id = created.json()["id"]
    updated = client.patch(f"/admin/support/tickets/{ticket_id}", headers=headers, json={"status": "pending"})
    noted = client.post(
        f"/admin/support/tickets/{ticket_id}/notes",
        headers=headers,
        json={"note": "Se pidio correlation_id al usuario.", "is_internal": True},
    )

    assert created.status_code == 201
    assert updated.json()["status"] == "pending"
    assert noted.json()["notes"][0]["is_internal"] is True
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "admin.ticket_created").count() == 1
