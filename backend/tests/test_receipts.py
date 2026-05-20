from collections.abc import Callable

from fastapi.testclient import TestClient

from app.modules.receipts.models import Receipt
from app.modules.users.models import User


def test_receipts_require_auth(client: TestClient) -> None:
    assert client.get("/receipts").status_code == 401


def test_receipts_are_scoped_to_current_user(
    client: TestClient,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_receipt: Callable[[User], Receipt],
) -> None:
    owner = create_user("5555555555")
    other = create_user("5566666666")
    own_receipt = create_receipt(owner)
    other_receipt = create_receipt(other)

    response = client.get("/receipts", headers=auth_headers(owner))
    receipt_ids = {item["id"] for item in response.json()}

    assert response.status_code == 200
    assert own_receipt.id in receipt_ids
    assert other_receipt.id not in receipt_ids
