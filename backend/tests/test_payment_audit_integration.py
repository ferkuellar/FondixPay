from collections.abc import Callable
from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent
from app.modules.ledger.models import LedgerEntry, PaymentAttempt, PaymentIntent, ProviderTransaction
from app.modules.ledger.state_machine import PaymentIntentStatus
from app.modules.user_services.models import UserService
from app.modules.users.models import User


def test_mock_payment_creates_audit_and_ledger_trace(
    client: TestClient,
    db_session: Session,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5593000001")
    service = create_user_service(user, Decimal("125.50"))

    response = client.post(
        "/payments",
        json={"user_service_id": service.id, "idempotency_key": "idem-audit-001"},
        headers={**auth_headers(user), "X-Request-ID": "req-payment-audit"},
    )

    assert response.status_code == 201

    event_types = {event.event_type for event in db_session.query(AuditEvent).all()}
    assert "payment.intent_created" in event_types
    assert "payment.confirmed_by_user" in event_types
    assert "payment.mock_submitted" in event_types
    assert "payment.succeeded" in event_types
    assert "receipt.generated" in event_types

    intent = db_session.query(PaymentIntent).one()
    assert intent.status == PaymentIntentStatus.SUCCEEDED
    assert intent.amount_minor == 12550
    assert intent.fee_minor == 750
    assert intent.total_minor == 13300
    assert intent.currency == "MXN"

    assert db_session.query(PaymentAttempt).count() == 1
    assert db_session.query(ProviderTransaction).count() == 1
    assert db_session.query(LedgerEntry).count() == 1


def test_mock_payment_response_includes_fee_breakdown(
    client: TestClient,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5593000002")
    service = create_user_service(user, Decimal("125.50"))

    response = client.post(
        "/payments",
        json={"user_service_id": service.id, "idempotency_key": "idem-fee-001"},
        headers=auth_headers(user),
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["amount_minor"] == 12550
    assert payload["fee_minor"] == 750
    assert payload["total_minor"] == 13300
    assert payload["currency"] == "MXN"
    assert payload["fee_label"] == "Comision FondixPay"
    assert payload["is_mock"] is True
