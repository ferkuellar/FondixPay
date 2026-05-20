from fastapi.testclient import TestClient


def test_dev_auth_flow_returns_token(client: TestClient) -> None:
    phone = "5512345678"

    otp_response = client.post("/auth/request-otp", json={"phone": phone})
    assert otp_response.status_code == 200
    otp_body = otp_response.json()
    assert otp_body["expires_in_seconds"] == 300
    assert otp_body["otp_dev"] == "123456"

    verify_response = client.post("/auth/verify-otp", json={"phone": phone, "otp": "123456"})
    assert verify_response.status_code == 200
    verify_body = verify_response.json()
    assert verify_body["token_type"] == "bearer"
    assert verify_body["access_token"]
    assert verify_body["user"]["phone"] == phone
