from app.modules.providers.prontipagos.adapter import ProntipagosSandboxAdapter
from app.modules.providers.prontipagos.schemas import ServicePaymentRequest


def _request(scenario: str) -> ServicePaymentRequest:
    return ServicePaymentRequest(
        payment_intent_id=11,
        user_service_id=12,
        service_provider_id=13,
        service_reference="REF-MOCK",
        amount_minor=12550,
        currency="MXN",
        idempotency_key=f"idem-{scenario}",
        correlation_id=f"corr-{scenario}",
        scenario=scenario,
    )


def test_prontipagos_mock_success_returns_confirmed_receipt_reference() -> None:
    response = ProntipagosSandboxAdapter().execute_service_payment(_request("success"))

    assert response.status == "provider_confirmed"
    assert response.provider_reference is not None
    assert response.receipt_reference is not None


def test_prontipagos_mock_maps_pending_timeout_and_invalid_reference() -> None:
    statuses = {
        scenario: ProntipagosSandboxAdapter().execute_service_payment(_request(scenario)).status
        for scenario in ("pending", "timeout", "invalid_reference", "duplicate_blocked")
    }

    assert statuses == {
        "pending": "provider_pending",
        "timeout": "provider_timeout",
        "invalid_reference": "provider_rejected",
        "duplicate_blocked": "provider_duplicate_blocked",
    }
