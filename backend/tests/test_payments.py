from collections.abc import Callable

from fastapi.testclient import TestClient

from app.modules.payments.models import Payment
from app.modules.users.models import User


def test_payments_require_auth(client: TestClient) -> None:
    assert client.get("/payments").status_code == 401
    assert client.post("/payments", json={"user_service_id": 1}).status_code == 401


def test_payments_are_scoped_to_current_user(
    client: TestClient,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_payment: Callable[[User], Payment],
) -> None:
    owner = create_user("5533333333")
    other = create_user("5544444444")
    own_payment = create_payment(owner)
    other_payment = create_payment(other)

    response = client.get("/payments", headers=auth_headers(owner))
    payment_ids = {item["id"] for item in response.json()}

    assert response.status_code == 200
    assert own_payment.id in payment_ids
    assert other_payment.id not in payment_ids
