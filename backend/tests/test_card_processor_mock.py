from app.modules.providers.card_processor.adapter import CardProcessorSandboxAdapter
from app.modules.providers.card_processor.schemas import CardChargeRequest, CardChargeResponse


def test_card_processor_mock_charge_success_uses_token_reference_only() -> None:
    response = CardProcessorSandboxAdapter().charge_card(
        CardChargeRequest(
            payment_intent_id=7,
            amount_minor=10750,
            currency="MXN",
            card_payment_method_token="pm_mock_demo",
            idempotency_key="idem-card-success",
            correlation_id="corr-card-success",
        )
    )

    assert response.status == "succeeded"
    assert response.provider_transaction_id is not None
    assert set(CardChargeRequest.model_fields) == {
        "payment_intent_id",
        "amount_minor",
        "currency",
        "card_payment_method_token",
        "idempotency_key",
        "correlation_id",
        "scenario",
    }
    assert "pan" not in CardChargeResponse.model_fields
    assert "cvv" not in CardChargeResponse.model_fields


def test_card_processor_mock_maps_decline_timeout_and_duplicate() -> None:
    statuses = {}
    for scenario in ("declined", "timeout", "duplicate_blocked"):
        statuses[scenario] = CardProcessorSandboxAdapter().charge_card(
            CardChargeRequest(
                payment_intent_id=9,
                amount_minor=10000,
                currency="MXN",
                card_payment_method_token="pm_mock_demo",
                idempotency_key=f"idem-{scenario}",
                correlation_id=f"corr-{scenario}",
                scenario=scenario,
            )
        ).status

    assert statuses == {
        "declined": "declined",
        "timeout": "timeout",
        "duplicate_blocked": "duplicate_blocked",
    }
