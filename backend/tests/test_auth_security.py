import uuid

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.core.database import SessionLocal
from app.core.security import create_access_token
from app.main import app
from app.modules.auth import models as auth_models
from app.modules.auth import services as auth_services
from app.modules.users.models import User

client = TestClient(app)


def _secure_settings(**overrides: object) -> Settings:
    values = {
        "app_env": "production",
        "jwt_secret_key": "x" * 40,
        "otp_dev_response_enabled": False,
        "cors_origins": "https://app.fondixpay.mx",
    }
    values.update(overrides)
    return Settings(**values)


def test_development_can_return_otp_dev_when_enabled(monkeypatch: pytest.MonkeyPatch) -> None:
    test_settings = Settings(app_env="development", otp_dev_response_enabled=True)
    monkeypatch.setattr(auth_services, "settings", test_settings)
    monkeypatch.setattr(auth_models, "settings", test_settings)

    response = auth_services.request_otp("5512345678")

    assert response["message"] == "Codigo enviado"
    assert response["expires_in_seconds"] == 300
    assert response["otp_dev"] == "123456"


def test_production_like_does_not_return_otp_dev(monkeypatch: pytest.MonkeyPatch) -> None:
    test_settings = _secure_settings(app_env="staging")
    monkeypatch.setattr(auth_services, "settings", test_settings)
    monkeypatch.setattr(auth_models, "settings", test_settings)

    response = auth_services.request_otp("5512345679")

    assert response["message"] == "Codigo enviado"
    assert response["expires_in_seconds"] == 300
    assert "otp_dev" not in response


def test_production_rejects_weak_jwt_secret() -> None:
    with pytest.raises(ValidationError):
        Settings(
            app_env="production",
            jwt_secret_key="change-me",
            otp_dev_response_enabled=False,
            cors_origins="https://app.fondixpay.mx",
        )


def test_production_rejects_enabled_otp_dev_response() -> None:
    with pytest.raises(ValidationError):
        _secure_settings(otp_dev_response_enabled=True)


def test_auth_me_rejects_invalid_token() -> None:
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalid-token"})

    assert response.status_code == 401
    assert response.json()["detail"] == "Sesion no valida"


def test_auth_me_accepts_valid_token() -> None:
    phone = f"55{uuid.uuid4().int % 10**8:08d}"
    db = SessionLocal()
    try:
        user = User(phone=phone)
        db.add(user)
        db.commit()
        db.refresh(user)
        token = create_access_token(str(user.id))
    finally:
        db.close()

    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json()["phone"] == phone


def test_incorrect_otp_fails() -> None:
    response = client.post(
        "/auth/verify-otp",
        json={"phone": "5511111111", "otp": "000000"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Codigo incorrecto"
