from fastapi.testclient import TestClient

from app.modules.users.models import User


def test_admin_service_catalog_requires_admin(client: TestClient, auth_headers) -> None:
    normal_headers = auth_headers()

    response = client.get("/admin/service-catalog", headers=normal_headers)

    assert response.status_code == 403


def test_admin_service_catalog_lists_non_payable_services(client: TestClient, create_user, auth_headers) -> None:
    admin: User = create_user(role="ADMIN")
    response = client.get("/admin/service-catalog", headers=auth_headers(admin))

    assert response.status_code == 200
    body = response.json()
    assert body["count"] > 0
    assert any(service["payable_in_mobile"] is False for service in body["services"])


def test_admin_cannot_mark_unconfirmed_service_payable(client: TestClient, create_user, auth_headers) -> None:
    admin: User = create_user(role="ADMIN")
    list_response = client.get("/admin/service-catalog", headers=auth_headers(admin))
    service_id = list_response.json()["services"][0]["id"]

    response = client.patch(
        f"/admin/service-catalog/{service_id}",
        headers=auth_headers(admin),
        json={"payable_in_mobile": True},
    )

    assert response.status_code == 409
    assert "provider capability" in response.json()["detail"]

