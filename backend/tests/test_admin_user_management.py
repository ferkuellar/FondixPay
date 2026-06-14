"""Tests for GET/POST /admin/admin-users and PATCH /admin/admin-users/{id}/status."""
from collections.abc import Callable

from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.modules.users.models import User


def _headers(user: User) -> dict[str, str]:
    return {"Authorization": f"Bearer {create_access_token(str(user.id))}"}


# ---------------------------------------------------------------------------
# GET /admin/admin-users
# ---------------------------------------------------------------------------

def test_list_admin_users_requires_auth(client: TestClient) -> None:
    assert client.get("/admin/admin-users").status_code == 401


def test_list_admin_users_requires_super_admin(client: TestClient, create_user: Callable) -> None:
    for role in ("SUPPORT", "FINANCE", "ADMIN", "AUDITOR"):
        user = create_user(None, role)
        assert client.get("/admin/admin-users", headers=_headers(user)).status_code == 403


def test_list_admin_users_excludes_regular_users(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    create_user(None, "USER")
    create_user(None, "USER")
    res = client.get("/admin/admin-users", headers=_headers(admin))
    assert res.status_code == 200
    phones = [u["phone"] for u in res.json()]
    assert admin.phone in phones
    assert all(u["role"] != "USER" for u in res.json())


def test_list_admin_users_returns_all_admin_roles(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    support = create_user(None, "SUPPORT")
    finance = create_user(None, "FINANCE")
    res = client.get("/admin/admin-users", headers=_headers(admin))
    assert res.status_code == 200
    phones = {u["phone"] for u in res.json()}
    assert support.phone in phones
    assert finance.phone in phones


# ---------------------------------------------------------------------------
# POST /admin/admin-users
# ---------------------------------------------------------------------------

def test_create_admin_user_requires_auth(client: TestClient) -> None:
    assert client.post("/admin/admin-users", json={"phone": "5512345678", "role": "SUPPORT"}).status_code == 401


def test_create_admin_user_requires_super_admin(client: TestClient, create_user: Callable) -> None:
    user = create_user(None, "ADMIN")
    res = client.post("/admin/admin-users", json={"phone": "5512345678", "role": "SUPPORT"}, headers=_headers(user))
    assert res.status_code == 403


def test_create_admin_user_success(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.post(
        "/admin/admin-users",
        json={"phone": "5512345678", "role": "SUPPORT", "name": "María López"},
        headers=_headers(admin),
    )
    assert res.status_code == 201
    body = res.json()
    assert body["phone"] == "5512345678"
    assert body["role"] == "SUPPORT"
    assert body["name"] == "María López"
    assert body["is_active"] is True


def test_create_admin_user_duplicate_phone_returns_409(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    create_user("5512345679", "SUPPORT")
    res = client.post("/admin/admin-users", json={"phone": "5512345679", "role": "ADMIN"}, headers=_headers(admin))
    assert res.status_code == 409


def test_create_admin_user_invalid_role_returns_422(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.post("/admin/admin-users", json={"phone": "5512345670", "role": "USER"}, headers=_headers(admin))
    assert res.status_code == 422


def test_create_admin_user_unknown_role_returns_422(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.post("/admin/admin-users", json={"phone": "5512345671", "role": "HACKER"}, headers=_headers(admin))
    assert res.status_code == 422


# ---------------------------------------------------------------------------
# PATCH /admin/admin-users/{id}/status
# ---------------------------------------------------------------------------

def test_update_status_requires_auth(client: TestClient, create_user: Callable) -> None:
    target = create_user(None, "SUPPORT")
    assert client.patch(f"/admin/admin-users/{target.id}/status", json={"is_active": False}).status_code == 401


def test_update_status_requires_super_admin(client: TestClient, create_user: Callable) -> None:
    user = create_user(None, "ADMIN")
    target = create_user(None, "SUPPORT")
    res = client.patch(f"/admin/admin-users/{target.id}/status", json={"is_active": False}, headers=_headers(user))
    assert res.status_code == 403


def test_deactivate_admin_user(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    target = create_user(None, "SUPPORT")
    res = client.patch(f"/admin/admin-users/{target.id}/status", json={"is_active": False}, headers=_headers(admin))
    assert res.status_code == 200
    assert res.json()["is_active"] is False


def test_reactivate_admin_user(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    target = create_user(None, "FINANCE")
    client.patch(f"/admin/admin-users/{target.id}/status", json={"is_active": False}, headers=_headers(admin))
    res = client.patch(f"/admin/admin-users/{target.id}/status", json={"is_active": True}, headers=_headers(admin))
    assert res.status_code == 200
    assert res.json()["is_active"] is True


def test_cannot_deactivate_self(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.patch(f"/admin/admin-users/{admin.id}/status", json={"is_active": False}, headers=_headers(admin))
    assert res.status_code == 400


def test_update_status_regular_user_returns_404(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    regular = create_user(None, "USER")
    res = client.patch(f"/admin/admin-users/{regular.id}/status", json={"is_active": False}, headers=_headers(admin))
    assert res.status_code == 404


def test_admin_token_expires_in_8_hours(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    client.post("/admin/auth/request-otp", json={"phone": admin.phone})
    res = client.post("/admin/auth/verify-otp", json={"phone": admin.phone, "otp": "123456"})
    assert res.status_code == 200
    assert res.json()["expires_in"] == 8 * 3600
