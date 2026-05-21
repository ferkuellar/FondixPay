from collections.abc import Callable
from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.request_context import RequestContext
from app.modules.ledger.models import PaymentAttempt, PaymentIntent, ProviderTransaction
from app.modules.payments.models import PaymentStatus
from app.modules.payments.orchestrator import process_sandbox_payment
from app.modules.providers.card_processor.adapter import CardProcessorSandboxAdapter
from app.modules.providers.card_processor.mock_client import MockCardProcessorClient
from app.modules.providers.prontipagos.adapter import ProntipagosSandboxAdapter
from app.modules.providers.prontipagos.mock_client import MockProntipagosClient
from app.modules.receipts.models import Receipt
from app.modules.user_services.models import UserService
from app.modules.users.models import User


def test_sandbox_success_calls_card_then_prontipagos_and_generates_receipt(
    client: TestClient,
    db_session: Session,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5598000001")
    service = create_user_service(user, Decimal("125.50"))

    response = client.post(
        "/payments/sandbox",
        json={"user_service_id": service.id, "idempotency_key": "sandbox-success"},
        headers=auth_headers(user),
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["status"] == "succeeded"
    assert payload["card_status"] == "succeeded"
    assert payload["service_payment_status"] == "provider_confirmed"
    assert payload["receipt_status"] == "generated"
    assert payload["amount_minor"] == 12550
    assert payload["fee_minor"] == 750
    assert payload["total_minor"] == 13300
    assert db_session.query(PaymentAttempt).count() == 2
    assert db_session.query(ProviderTransaction).count() == 2
    assert db_session.query(Receipt).count() == 1


def test_card_declined_does_not_call_prontipagos(
    db_session: Session,
    create_user: Callable[[str | None], User],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5598000002")
    service = create_user_service(user, Decimal("125.50"))
    card_client = MockCardProcessorClient()
    prontipagos_client = MockProntipagosClient()

    result = process_sandbox_payment(
        db_session,
        user_id=user.id,
        user_service_id=service.id,
        mock_card_token="pm_mock_demo",
        idempotency_key="sandbox-card-declined",
        card_scenario="declined",
        request_context=RequestContext(request_id="req-card-declined"),
        card_processor=CardProcessorSandboxAdapter(card_client),
        prontipagos=ProntipagosSandboxAdapter(prontipagos_client),
    )

    assert result.status == "failed"
    assert result.service_payment_status == "not_started"
    assert card_client.charge_calls == 1
    assert prontipagos_client.execution_calls == 0
    assert result.payment.status == PaymentStatus.FAILED


def test_card_timeout_and_pending_do_not_call_prontipagos(
    db_session: Session,
    create_user: Callable[[str | None], User],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5598000003")
    for scenario in ("timeout", "pending"):
        service = create_user_service(user, Decimal("125.50"))
        prontipagos_client = MockProntipagosClient()
        result = process_sandbox_payment(
            db_session,
            user_id=user.id,
            user_service_id=service.id,
            mock_card_token="pm_mock_demo",
            idempotency_key=f"sandbox-card-{scenario}",
            card_scenario=scenario,
            request_context=RequestContext(request_id=f"req-card-{scenario}"),
            prontipagos=ProntipagosSandboxAdapter(prontipagos_client),
        )

        assert result.status == "manual_review_required"
        assert result.service_payment_status == "not_started"
        assert prontipagos_client.execution_calls == 0


def test_sandbox_endpoint_requires_auth(client: TestClient) -> None:
    response = client.post("/payments/sandbox", json={"user_service_id": 1, "idempotency_key": "no-auth"})

    assert response.status_code == 401
