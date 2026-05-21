def test_movements_requires_auth(client):
    response = client.get("/account/movements")

    assert response.status_code == 401


def test_movements_return_demo_seed_for_current_user(client, auth_headers):
    response = client.get("/account/movements", headers=auth_headers())

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    movement = body[0]
    assert movement["movement_type"] == "demo_credit"
    assert movement["direction"] == "credit"
    assert movement["amount_minor"] == 250000
    assert movement["currency"] == "MXN"
    assert movement["is_demo"] is True
    assert movement["status"] == "demo_confirmed"
