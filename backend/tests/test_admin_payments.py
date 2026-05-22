def test_finance_payment_detail_is_safe_and_has_breakdown(client, create_user, auth_headers, create_payment) -> None:
    finance = create_user("5512000000", "FINANCE")
    customer = create_user("5512000001")
    payment = create_payment(customer)

    response = client.get(f"/admin/payments/{payment.id}", headers=auth_headers(finance))
    payload = response.json()
    payload_text = str(payload).lower()

    assert response.status_code == 200
    assert payload["amount_minor"] > 0
    assert payload["fee_minor"] > 0
    assert payload["total_minor"] == payload["amount_minor"] + payload["fee_minor"]
    assert "pan" not in payload_text
    assert "cvv" not in payload_text
    assert "token" not in payload_text
    assert "secret" not in payload_text
