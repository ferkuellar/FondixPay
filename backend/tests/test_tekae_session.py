from collections.abc import Callable
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.audit.models import AuditEvent
from app.modules.tekae.client import TekaeClientError
from app.modules.users.models import User

_ENDPOINT = "/api/payments/tekae/session"
_CIPHER_PATCH = "app.modules.tekae.service.cipher_data"
_TOKEN_PATCH = "app.modules.tekae.service.generate_token_ciphered"

_CIPHER_RESPONSE = {"data": "encoded-blob", "uid": "test-uid"}
_TOKEN_RESPONSE = {"accessToken": "tok_abc123", "refreshToken": "ref_xyz"}


@pytest.fixture(autouse=True)
def _tekae_enabled(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "tekae_enabled", True)
    monkeypatch.setattr(settings, "tekae_base_url", "https://sandbox.tekae.example.com")
    monkeypatch.setattr(settings, "tekae_responsive_base_url", "https://responsive.tekae.example.com")
    monkeypatch.setattr(settings, "tekae_bearer", "sh_test_bearer")
    monkeypatch.setattr(settings, "tekae_uid", "test-uid")
    monkeypatch.setattr(settings, "tekae_password", "CiQA_test_kms_blob")
    monkeypatch.setattr(settings, "tekae_portal_uid", "portal-uid-abc")


def test_tekae_session_disabled_returns_503(
    client: TestClient,
    auth_headers: Callable[[User | None], dict[str, str]],
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(settings, "tekae_enabled", False)
    response = client.post(_ENDPOINT, json={}, headers=auth_headers(None))
    assert response.status_code == 503
    assert "no disponible" in response.json()["detail"].lower()


def test_tekae_session_unauthenticated_returns_401(client: TestClient) -> None:
    response = client.post(_ENDPOINT, json={})
    assert response.status_code == 401


def test_tekae_session_success(
    client: TestClient,
    auth_headers: Callable[[User | None], dict[str, str]],
) -> None:
    with (
        patch(_CIPHER_PATCH, return_value=_CIPHER_RESPONSE),
        patch(_TOKEN_PATCH, return_value=_TOKEN_RESPONSE),
    ):
        response = client.post(
            _ENDPOINT,
            json={"menu": "2", "categoria": "electricity", "carrier": None, "blockview": False},
            headers=auth_headers(None),
        )

    assert response.status_code == 200
    body = response.json()
    assert "portalUrl" in body
    assert "tok_abc123" in body["portalUrl"]
    assert "portal-uid-abc" in body["portalUrl"]
    assert body["expiresIn"] == 1800
    assert "sessionRef" in body
    assert len(body["sessionRef"]) == 36  # UUID


def test_tekae_session_cipher_error_returns_503(
    client: TestClient,
    auth_headers: Callable[[User | None], dict[str, str]],
) -> None:
    with patch(_CIPHER_PATCH, side_effect=TekaeClientError("cipherData failed", status_code=400)):
        response = client.post(_ENDPOINT, json={}, headers=auth_headers(None))

    assert response.status_code == 503


def test_tekae_session_token_error_returns_503(
    client: TestClient,
    auth_headers: Callable[[User | None], dict[str, str]],
) -> None:
    with (
        patch(_CIPHER_PATCH, return_value=_CIPHER_RESPONSE),
        patch(_TOKEN_PATCH, side_effect=TekaeClientError("generateTokenCiphered failed", status_code=500)),
    ):
        response = client.post(_ENDPOINT, json={}, headers=auth_headers(None))

    assert response.status_code == 503


def test_tekae_session_success_creates_audit_events(
    client: TestClient,
    auth_headers: Callable[[User | None], dict[str, str]],
    db_session: Session,
    create_user: Callable,
) -> None:
    user = create_user()
    with (
        patch(_CIPHER_PATCH, return_value=_CIPHER_RESPONSE),
        patch(_TOKEN_PATCH, return_value=_TOKEN_RESPONSE),
    ):
        response = client.post(_ENDPOINT, json={}, headers=auth_headers(user))

    assert response.status_code == 200
    session_ref = response.json()["sessionRef"]

    events = db_session.query(AuditEvent).filter(AuditEvent.actor_id == str(user.id)).all()
    event_types = {e.event_type for e in events}

    assert "tekae.session.requested" in event_types
    assert "tekae.session.created" in event_types
    assert "tekae.session.failed" not in event_types

    for event in events:
        assert event.metadata_json is not None
        assert session_ref in str(event.metadata_json)
        assert "tok_abc123" not in str(event.metadata_json)


def test_tekae_session_failure_creates_audit_event(
    client: TestClient,
    auth_headers: Callable[[User | None], dict[str, str]],
    db_session: Session,
    create_user: Callable,
) -> None:
    user = create_user()
    with patch(_CIPHER_PATCH, side_effect=TekaeClientError("Tekae down")):
        response = client.post(_ENDPOINT, json={}, headers=auth_headers(user))

    assert response.status_code == 503

    events = db_session.query(AuditEvent).filter(AuditEvent.actor_id == str(user.id)).all()
    event_types = {e.event_type for e in events}

    assert "tekae.session.requested" in event_types
    assert "tekae.session.failed" in event_types
    assert "tekae.session.created" not in event_types
