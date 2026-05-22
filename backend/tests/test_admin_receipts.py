def test_admin_receipt_detail_is_available_without_sensitive_fields(client, create_user, auth_headers, create_receipt) -> None:
    admin = create_user("5513000000", "ADMIN")
    customer = create_user("5513000001")
    receipt = create_receipt(customer)

    response = client.get(f"/admin/receipts/{receipt.id}", headers=auth_headers(admin))
    payload = response.json()

    assert response.status_code == 200
    assert payload["id"] == receipt.id
    assert payload["payment_id"] == receipt.payment_id
    assert payload["proof_status"] != "confirmed"
    assert "cvv" not in str(payload).lower()
