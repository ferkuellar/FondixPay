from app.modules.admin.models import ManualReviewEvent
from app.modules.audit.models import AuditEvent


def test_finance_can_create_and_update_manual_review(client, db_session, create_user, auth_headers) -> None:
    finance = create_user("5515000000", "FINANCE")
    headers = auth_headers(finance)

    created = client.post(
        "/admin/manual-review",
        headers=headers,
        json={
            "case_type": "provider_timeout",
            "severity": "high",
            "correlation_id": "corr_demo_10b",
            "summary": "Timeout de proveedor sandbox requiere investigacion.",
        },
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


def test_manual_review_cannot_close_without_resolution(client, db_session, create_user, auth_headers) -> None:
    finance = create_user("5515000001", "FINANCE")
    headers = auth_headers(finance)

    created = client.post(
        "/admin/manual-review",
        headers=headers,
        json={
            "case_type": "card_success_service_payment_failed",
            "severity": "urgent",
            "correlation_id": "corr_manual_close",
            "summary": "Tarjeta exitosa y pago de servicio fallido en sandbox.",
        },
    )
    case_id = created.json()["id"]

    blocked = client.patch(f"/admin/manual-review/{case_id}", headers=headers, json={"status": "closed"})
    closed = client.patch(
        f"/admin/manual-review/{case_id}",
        headers=headers,
        json={
            "status": "closed",
            "resolution": "Caso documentado para conciliacion futura; no se modifica ledger.",
            "note": "Cierre operativo sin movimiento financiero.",
        },
    )
    event = db_session.query(ManualReviewEvent).filter(ManualReviewEvent.case_id == case_id).order_by(ManualReviewEvent.id.desc()).first()

    assert blocked.status_code == 400
    assert closed.status_code == 200
    assert closed.json()["closed_at"] is not None
    assert event is not None
    assert event.before_status == "open"
    assert event.after_status == "closed"
    assert event.note == "Cierre operativo sin movimiento financiero."
