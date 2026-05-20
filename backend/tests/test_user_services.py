from collections.abc import Callable
from decimal import Decimal

from fastapi.testclient import TestClient

from app.modules.user_services.models import UserService
from app.modules.users.models import User


def test_user_services_requires_auth(client: TestClient) -> None:
    assert client.get("/user-services").status_code == 401
    assert client.post("/user-services", json={"provider_id": 1, "alias": "Casa", "reference": "1234"}).status_code == 401


def test_user_services_are_scoped_to_current_user(
    client: TestClient,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    owner = create_user("5511111111")
    other = create_user("5522222222")
    own_service = create_user_service(owner, Decimal("88.00"))
    other_service = create_user_service(other, Decimal("99.00"))

    response = client.get("/user-services", headers=auth_headers(owner))
    service_ids = {item["id"] for item in response.json()}

    assert response.status_code == 200
    assert own_service.id in service_ids
    assert other_service.id not in service_ids

    cross_user_response = client.get(f"/user-services/{other_service.id}", headers=auth_headers(owner))
    assert cross_user_response.status_code == 404
