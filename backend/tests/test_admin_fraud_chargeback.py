from app.modules.audit.models import AuditEvent


def test_finance_can_create_and_escalate_fraud_signal(client, db_session, create_user, create_payment, auth_headers) -> None:
    finance = create_user("5517000000", "FINANCE")
    customer = create_user("5517000001", "USER")
    payment = create_payment(customer)
    headers = auth_headers(finance)

    created = client.post(
        "/admin/fraud/signals",
        headers=headers,
        json={
            "signal_type": "duplicate_payment_attempt",
            "severity": "high",
            "entity_type": "Payment",
            "entity_id": str(payment.id),
            "user_id": customer.id,
            "payment_id": payment.id,
            "reason": "Repeated payment attempt pattern requires human review.",
            "metadata_json": {"signal_id": "FRAUD_DUPLICATE_PAYMENT_ATTEMPT"},
        },
    )
    signal_id = created.json()["id"]
    blocked = client.patch(
        f"/admin/fraud/signals/{signal_id}/status",
        headers=headers,
        json={"status": "reviewed"},
    )
    escalated = client.patch(
        f"/admin/fraud/signals/{signal_id}/status",
        headers=headers,
        json={"status": "escalated", "resolution": "Escalated to finance manual review queue."},
    )

    assert created.status_code == 201
    assert blocked.status_code == 400
    assert escalated.status_code == 200
    assert escalated.json()["status"] == "escalated"
    assert escalated.json()["reviewed_by"] == finance.id
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "fraud.signal.created").count() == 1
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "fraud.signal.escalated").count() == 1


def test_support_can_view_but_not_update_fraud_signal(client, create_user, auth_headers) -> None:
    finance = create_user("5517000002", "FINANCE")
    support = create_user("5517000003", "SUPPORT")
    finance_headers = auth_headers(finance)
    support_headers = auth_headers(support)

    created = client.post(
        "/admin/fraud/signals",
        headers=finance_headers,
        json={
            "signal_type": "reference_validation_failures",
            "severity": "medium",
            "entity_type": "User",
            "entity_id": "5517000003",
            "reason": "Multiple reference validation failures require review.",
        },
    )
    signal_id = created.json()["id"]

    listed = client.get("/admin/fraud/signals", headers=support_headers)
    viewed = client.get(f"/admin/fraud/signals/{signal_id}", headers=support_headers)
    blocked = client.patch(
        f"/admin/fraud/signals/{signal_id}/status",
        headers=support_headers,
        json={"status": "dismissed", "resolution": "Support cannot dismiss fraud signals."},
    )

    assert listed.status_code == 200
    assert viewed.status_code == 200
    assert blocked.status_code == 403


def test_finance_can_create_chargeback_case_add_evidence_and_close(
    client,
    db_session,
    create_user,
    create_payment,
    auth_headers,
) -> None:
    finance = create_user("5517000004", "FINANCE")
    customer = create_user("5517000005", "USER")
    payment = create_payment(customer)
    headers = auth_headers(finance)

    created = client.post(
        "/admin/disputes",
        headers=headers,
        json={
            "case_type": "chargeback",
            "payment_id": payment.id,
            "user_id": customer.id,
            "provider_transaction_id": "pronti_sandbox_123",
            "card_processor_reference": "card_sandbox_123",
            "amount_minor": 12550,
            "currency": "MXN",
            "reason_code": "customer_dispute",
            "summary": "Customer disputes a sandbox service payment.",
        },
    )
    case_id = created.json()["id"]
    evidence = client.post(
        f"/admin/disputes/{case_id}/evidence",
        headers=headers,
        json={
            "evidence_type": "payment_summary",
            "title": "Payment evidence summary",
            "description": "Payment, fee, provider reference, and receipt linkage captured for internal review.",
            "source_entity_type": "Payment",
            "source_entity_id": str(payment.id),
        },
    )
    closed = client.patch(
        f"/admin/disputes/{case_id}/status",
        headers=headers,
        json={"status": "CLOSED", "assigned_to": finance.id},
    )

    assert created.status_code == 201
    assert created.json()["status"] == "OPEN"
    assert evidence.status_code == 201
    assert evidence.json()["evidence"][0]["evidence_type"] == "payment_summary"
    assert closed.status_code == 200
    assert closed.json()["closed_at"] is not None
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "chargeback.created").count() == 1
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "chargeback.evidence_added").count() == 1
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "chargeback.closed").count() == 1


def test_auditor_can_view_but_not_create_dispute(client, create_user, auth_headers) -> None:
    auditor = create_user("5517000006", "AUDITOR")
    headers = auth_headers(auditor)

    listed = client.get("/admin/disputes", headers=headers)
    blocked = client.post(
        "/admin/disputes",
        headers=headers,
        json={"case_type": "dispute", "summary": "Auditor cannot create cases."},
    )

    assert listed.status_code == 200
    assert blocked.status_code == 403
