from collections.abc import Callable
from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.receipts.models import Receipt
from app.modules.user_services.models import UserService
from app.modules.users.models import User


def test_service_payment_pending_and_timeout_are_not_success_and_do_not_generate_receipt(
    client: TestClient,
    db_session: Session,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5598200001")

    for scenario in ("pending", "timeout"):
        service = create_user_service(user, Decimal("125.50"))
        response = client.post(
            "/payments/sandbox",
            json={
                "user_service_id": service.id,
                "idempotency_key": f"sandbox-provider-{scenario}",
                "service_scenario": scenario,
            },
            headers=auth_headers(user),
        )

        assert response.status_code == 201
        payload = response.json()
        assert payload["status"] == "manual_review_required"
        assert payload["service_payment_status"] in {"provider_pending", "provider_timeout"}
        assert payload["receipt_status"] == "pending"

    assert db_session.query(Receipt).count() == 0


def test_service_payment_failure_enters_recovery_state(
    client: TestClient,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_user_service: Callable[[User, Decimal], UserService],
) -> None:
    user = create_user("5598200002")
    service = create_user_service(user, Decimal("125.50"))

    response = client.post(
        "/payments/sandbox",
        json={
            "user_service_id": service.id,
            "idempotency_key": "sandbox-provider-failure",
            "service_scenario": "provider_unavailable",
        },
        headers=auth_headers(user),
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["status"] == "manual_review_required"
    assert payload["service_payment_status"] == "provider_failed"
    assert payload["receipt_status"] == "pending"
