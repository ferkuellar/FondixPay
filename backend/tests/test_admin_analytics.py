"""Tests for GET /admin/dashboard/trend, /category-volume, /hourly."""
from collections.abc import Callable
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.modules.users.models import User


def _admin_headers(user: User) -> dict[str, str]:
    token = create_access_token(str(user.id))
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# /admin/dashboard/trend
# ---------------------------------------------------------------------------

def test_trend_requires_auth(client: TestClient) -> None:
    res = client.get("/admin/dashboard/trend")
    assert res.status_code == 401


def test_trend_requires_admin_role(client: TestClient, create_user: Callable) -> None:
    user = create_user(None, "USER")
    res = client.get("/admin/dashboard/trend", headers=_admin_headers(user))
    assert res.status_code == 403


def test_trend_empty_db_returns_30_days(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.get("/admin/dashboard/trend", headers=_admin_headers(admin))
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 30
    for point in data:
        assert "date" in point
        assert point["count"] == 0
        assert point["succeeded"] == 0
        assert point["failed"] == 0


def test_trend_custom_days(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.get("/admin/dashboard/trend?days=7", headers=_admin_headers(admin))
    assert res.status_code == 200
    assert len(res.json()) == 7


def test_trend_with_payment_counts(
    client: TestClient,
    create_user: Callable,
    create_payment: Callable,
) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    user = create_user(None, "USER")
    create_payment(user)
    create_payment(user)
    res = client.get("/admin/dashboard/trend", headers=_admin_headers(admin))
    assert res.status_code == 200
    data = res.json()
    total = sum(p["count"] for p in data)
    assert total == 2


# ---------------------------------------------------------------------------
# /admin/dashboard/category-volume
# ---------------------------------------------------------------------------

def test_category_volume_requires_auth(client: TestClient) -> None:
    res = client.get("/admin/dashboard/category-volume")
    assert res.status_code == 401


def test_category_volume_requires_admin_role(client: TestClient, create_user: Callable) -> None:
    user = create_user(None, "USER")
    res = client.get("/admin/dashboard/category-volume", headers=_admin_headers(user))
    assert res.status_code == 403


def test_category_volume_empty_returns_list(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.get("/admin/dashboard/category-volume", headers=_admin_headers(admin))
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_category_volume_with_payment(
    client: TestClient,
    create_user: Callable,
    create_payment: Callable,
) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    user = create_user(None, "USER")
    create_payment(user)
    res = client.get("/admin/dashboard/category-volume", headers=_admin_headers(admin))
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    point = data[0]
    assert "category" in point
    assert point["count"] >= 1
    assert "total_minor" in point


# ---------------------------------------------------------------------------
# /admin/dashboard/hourly
# ---------------------------------------------------------------------------

def test_hourly_requires_auth(client: TestClient) -> None:
    res = client.get("/admin/dashboard/hourly")
    assert res.status_code == 401


def test_hourly_requires_admin_role(client: TestClient, create_user: Callable) -> None:
    user = create_user(None, "USER")
    res = client.get("/admin/dashboard/hourly", headers=_admin_headers(user))
    assert res.status_code == 403


def test_hourly_returns_24_hours(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.get("/admin/dashboard/hourly", headers=_admin_headers(admin))
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 24
    hours = [p["hour"] for p in data]
    assert hours == list(range(24))


def test_hourly_all_zeros_when_empty(client: TestClient, create_user: Callable) -> None:
    admin = create_user(None, "SUPER_ADMIN")
    res = client.get("/admin/dashboard/hourly", headers=_admin_headers(admin))
    data = res.json()
    assert all(p["count"] == 0 for p in data)
