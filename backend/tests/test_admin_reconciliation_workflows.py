def test_finance_can_view_separated_reconciliation_placeholders(client, create_user, auth_headers) -> None:
    finance = create_user("5516000000", "FINANCE")
    headers = auth_headers(finance)

    card = client.get("/admin/reconciliation/card", headers=headers)
    prontipagos = client.get("/admin/reconciliation/prontipagos", headers=headers)

    assert card.status_code == 200
    assert prontipagos.status_code == 200
    assert card.json()["provider_type"] == "card_processor"
    assert prontipagos.json()["provider_type"] == "prontipagos"
    assert card.json()["production_ready"] is False
    assert prontipagos.json()["production_ready"] is False
    assert card.json()["summary"]["mismatch_count"] == 0


def test_support_cannot_view_reconciliation(client, create_user, auth_headers) -> None:
    support = create_user("5516000001", "SUPPORT")

    response = client.get("/admin/reconciliation/card", headers=auth_headers(support))

    assert response.status_code == 403
