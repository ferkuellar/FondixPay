def test_admin_search_requires_auth(client) -> None:
    response = client.get("/admin/search?q=corr_demo")

    assert response.status_code == 401


def test_support_can_search_operational_references(client, create_user, auth_headers) -> None:
    support = create_user("5517000000", "SUPPORT")
    headers = auth_headers(support)

    created = client.post(
        "/admin/support/tickets",
        headers=headers,
        json={
            "subject": "Recibo pendiente",
            "category": "receipt_missing",
            "priority": "medium",
            "correlation_id": "corr_search_demo",
        },
    )
    response = client.get("/admin/search?q=corr_search_demo&type=ticket", headers=headers)

    assert created.status_code == 201
    assert response.status_code == 200
    assert response.json()["results"][0]["entity_type"] == "ticket"
    assert response.json()["results"][0]["correlation_id"] == "corr_search_demo"
