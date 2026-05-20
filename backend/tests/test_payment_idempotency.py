from collections.abc import Callable
from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent
from app.modules.ledger.models import PaymentIntent
from app.modules.payments.models import Payment
from app.modules.user_services.models import UserService
from app.modules.users.models import User


def test_payment_idempotency_prevents_duplicate_mock_payment(
    client: TestClient,
    db_session: Session,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5592000001")
    service = create_user_service(user, Decimal("125.50"))
    headers = auth_headers(user)
    payload = {"user_service_id": service.id, "idempotency_key": "idem-test-001"}

    first_response = client.post("/payments", json=payload, headers=headers)
    second_response = client.post("/payments", json=payload, headers=headers)

    assert first_response.status_code == 201
    assert second_response.status_code == 201
    assert first_response.json()["id"] == second_response.json()["id"]
    assert db_session.query(Payment).count() == 1
    assert db_session.query(PaymentIntent).count() == 1
    assert (
        db_session.query(AuditEvent)
        .filter(AuditEvent.event_type == "payment.duplicate_blocked")
        .count()
        == 1
    )
