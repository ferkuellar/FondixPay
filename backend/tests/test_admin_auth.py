"""Tests for POST /admin/auth/request-otp and POST /admin/auth/verify-otp."""
from fastapi.testclient import TestClient


def test_request_otp_unknown_phone_returns_403(client: TestClient) -> None:
    res = client.post("/admin/auth/request-otp", json={"phone": "5599999999"})
    assert res.status_code == 403


def test_request_otp_non_admin_user_returns_403(client: TestClient, create_user) -> None:
    user = create_user("5511111111", "USER")
    res = client.post("/admin/auth/request-otp", json={"phone": user.phone})
    assert res.status_code == 403


def test_request_otp_admin_user_returns_sent(client: TestClient, create_user) -> None:
    admin = create_user("5522222222", "SUPER_ADMIN")
    res = client.post("/admin/auth/request-otp", json={"phone": admin.phone})
    assert res.status_code == 200
    body = res.json()
    assert body["message"] == "Codigo enviado"
    assert body["expires_in_seconds"] > 0


def test_request_otp_support_role_allowed(client: TestClient, create_user) -> None:
    support = create_user("5533333333", "SUPPORT")
    res = client.post("/admin/auth/request-otp", json={"phone": support.phone})
    assert res.status_code == 200


def test_verify_otp_wrong_code_returns_400(client: TestClient, create_user) -> None:
    admin = create_user("5544444444", "SUPER_ADMIN")
    client.post("/admin/auth/request-otp", json={"phone": admin.phone})
    res = client.post("/admin/auth/verify-otp", json={"phone": admin.phone, "otp": "000000"})
    assert res.status_code == 400


def test_verify_otp_without_prior_request_returns_400(client: TestClient, create_user) -> None:
    admin = create_user("5555555555", "SUPER_ADMIN")
    res = client.post("/admin/auth/verify-otp", json={"phone": admin.phone, "otp": "123456"})
    assert res.status_code == 400


def test_verify_otp_returns_token_and_role(client: TestClient, create_user) -> None:
    admin = create_user("5566666666", "SUPER_ADMIN")
    client.post("/admin/auth/request-otp", json={"phone": admin.phone})
    res = client.post("/admin/auth/verify-otp", json={"phone": admin.phone, "otp": "123456"})
    assert res.status_code == 200
    body = res.json()
    assert "access_token" in body
    assert body["role"] == "SUPER_ADMIN"
    assert body["expires_in"] > 0
    assert body["token_type"] == "bearer"


def test_verify_otp_token_grants_admin_access(client: TestClient, create_user) -> None:
    admin = create_user("5577777777", "ADMIN")
    client.post("/admin/auth/request-otp", json={"phone": admin.phone})
    res = client.post("/admin/auth/verify-otp", json={"phone": admin.phone, "otp": "123456"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    dashboard = client.get("/admin/dashboard", headers=headers)
    assert dashboard.status_code == 200


def test_verify_otp_non_admin_user_returns_403_after_otp_consumed(client: TestClient, create_user) -> None:
    """
    Edge case: user is demoted between request-otp and verify-otp.
    The verify step re-checks admin role after consuming the OTP.
    """
    from app.modules.auth.models import save_otp
    regular = create_user("5588888888", "USER")
    save_otp(regular.phone)
    res = client.post("/admin/auth/verify-otp", json={"phone": regular.phone, "otp": "123456"})
    assert res.status_code == 403
