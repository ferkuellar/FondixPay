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
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "admin.support_ticket_created").count() == 1


def test_support_ticket_cannot_close_without_resolution(client, create_user, auth_headers) -> None:
    support = create_user("5514000001", "SUPPORT")
    headers = auth_headers(support)

    created = client.post(
        "/admin/support/tickets",
        headers=headers,
        json={"subject": "Usuario reclama cargo", "category": "duplicate_charge_claim", "priority": "urgent"},
    )
    ticket_id = created.json()["id"]

    blocked = client.patch(f"/admin/support/tickets/{ticket_id}", headers=headers, json={"status": "closed"})
    closed = client.patch(
        f"/admin/support/tickets/{ticket_id}",
        headers=headers,
        json={"status": "closed", "resolution_note": "Se documento el caso sandbox y queda cerrado."},
    )

    assert blocked.status_code == 400
    assert closed.status_code == 200
    assert closed.json()["closed_at"] is not None
    assert closed.json()["notes"][0]["note"].startswith("Resolucion:")
