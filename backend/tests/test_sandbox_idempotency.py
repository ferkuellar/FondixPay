from collections.abc import Callable
from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.ledger.models import PaymentAttempt, PaymentIntent
from app.modules.user_services.models import UserService
from app.modules.users.models import User


def test_sandbox_idempotency_reuses_existing_provider_execution(
    client: TestClient,
    db_session: Session,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5598100001")
    service = create_user_service(user, Decimal("125.50"))
    payload = {"user_service_id": service.id, "idempotency_key": "sandbox-idem-success"}

    first = client.post("/payments/sandbox", json=payload, headers=auth_headers(user))
    second = client.post("/payments/sandbox", json=payload, headers=auth_headers(user))

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["payment_id"] == second.json()["payment_id"]
    assert db_session.query(PaymentIntent).count() == 1
    assert db_session.query(PaymentAttempt).count() == 2
