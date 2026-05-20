from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent
from app.modules.audit.services import create_audit_event


def test_audit_event_creation_redacts_sensitive_metadata(db_session: Session) -> None:
    event = create_audit_event(
        db_session,
        event_type="auth.otp_verified",
        actor_type="USER",
        actor_id=1,
        entity_type="User",
        entity_id=1,
        result="success",
        metadata={"otp": "123456", "token": "secret-token", "safe": "ok"},
        request_id="req-test",
        correlation_id="corr-test",
    )
    db_session.commit()
    db_session.refresh(event)

    assert event.id is not None
    assert event.metadata_json["otp"] == "[REDACTED]"
    assert event.metadata_json["token"] == "[REDACTED]"
    assert event.metadata_json["safe"] == "ok"
    assert event.request_id == "req-test"
    assert event.correlation_id == "corr-test"


def test_auth_flow_creates_audit_events(client: TestClient, db_session: Session) -> None:
    phone = "5591000001"

    request_response = client.post("/auth/request-otp", json={"phone": phone})
    assert request_response.status_code == 200

    failed_response = client.post("/auth/verify-otp", json={"phone": phone, "otp": "000000"})
    assert failed_response.status_code == 400

    success_response = client.post("/auth/verify-otp", json={"phone": phone, "otp": "123456"})
    assert success_response.status_code == 200

    event_types = {event.event_type for event in db_session.query(AuditEvent).all()}
    assert "auth.otp_requested" in event_types
    assert "auth.login_failed" in event_types
    assert "auth.otp_verified" in event_types
    assert "auth.login_success" in event_types
