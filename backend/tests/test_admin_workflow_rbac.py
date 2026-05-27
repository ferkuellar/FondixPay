def test_auditor_is_read_only_for_support_and_manual_review(client, create_user, auth_headers) -> None:
    auditor = create_user("5518000000", "AUDITOR")
    headers = auth_headers(auditor)

    ticket = client.post(
        "/admin/support/tickets",
        headers=headers,
        json={"subject": "No debe crear", "category": "other"},
    )
    manual_review = client.post(
        "/admin/manual-review",
        headers=headers,
        json={"case_type": "other", "summary": "No debe crear"},
    )
    audit_events = client.get("/admin/audit-events", headers=headers)

    assert ticket.status_code == 403
    assert manual_review.status_code == 403
    assert audit_events.status_code == 200


def test_support_cannot_update_manual_review_financial_flow(client, create_user, auth_headers) -> None:
    finance = create_user("5518000001", "FINANCE")
    support = create_user("5518000002", "SUPPORT")
    finance_headers = auth_headers(finance)
    support_headers = auth_headers(support)

    created = client.post(
        "/admin/manual-review",
        headers=finance_headers,
        json={
            "case_type": "amount_mismatch",
            "severity": "high",
            "summary": "Monto de tarjeta y proveedor no coincide.",
        },
    )
    case_id = created.json()["id"]
    response = client.patch(
        f"/admin/manual-review/{case_id}",
        headers=support_headers,
        json={"status": "resolved", "resolution": "Soporte no debe resolver esto."},
    )

    assert response.status_code == 403
