from hashlib import sha256
from uuid import uuid4

from app.modules.providers.card_processor.errors import CARD_ERROR_MESSAGES
from app.modules.providers.card_processor.schemas import (
    CardChargeRequest,
    CardChargeResponse,
    CardTokenizationMockRequest,
    CardTokenizationMockResponse,
)


def _hash_payload(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()


class MockCardProcessorClient:
    provider_name = "card_processor_mock"

    def __init__(self) -> None:
        self.charge_calls = 0

    def tokenize_card_mock(self, request: CardTokenizationMockRequest) -> CardTokenizationMockResponse:
        return CardTokenizationMockResponse(
            provider_name=self.provider_name,
            payment_method_token=f"pm_mock_{_hash_payload(request.mock_token_seed)[:16]}",
            status="tokenized",
            raw_response_hash=_hash_payload(f"tokenized:{request.correlation_id}"),
        )

    def charge_card(self, request: CardChargeRequest) -> CardChargeResponse:
        self.charge_calls += 1
        status_map = {
            "success": ("succeeded", None, None),
            "declined": ("declined", "card_declined", CARD_ERROR_MESSAGES["card_declined"]),
            "pending": ("pending", None, "Cargo pendiente de confirmacion."),
            "timeout": ("timeout", "processor_timeout", CARD_ERROR_MESSAGES["processor_timeout"]),
            "failed": ("failed", "processor_failed", CARD_ERROR_MESSAGES["processor_failed"]),
            "duplicate_blocked": (
                "duplicate_blocked",
                "duplicate_charge",
                CARD_ERROR_MESSAGES["duplicate_charge"],
            ),
            "auth_required_future": (
                "auth_required_future",
                "auth_required",
                CARD_ERROR_MESSAGES["auth_required"],
            ),
        }
        status, error_code, error_message = status_map[request.scenario]
        transaction_id = f"card_mock_{uuid4().hex[:16]}" if status == "succeeded" else None
        return CardChargeResponse(
            provider_name=self.provider_name,
            provider_transaction_id=transaction_id,
            status=status,
            amount_minor=request.amount_minor,
            currency=request.currency,
            error_code=error_code,
            error_message_safe=error_message,
            raw_response_hash=_hash_payload(f"{request.payment_intent_id}:{request.idempotency_key}:{status}"),
        )

    def get_charge_status(self, provider_transaction_id: str) -> CardChargeResponse:
        return CardChargeResponse(
            provider_name=self.provider_name,
            provider_transaction_id=provider_transaction_id,
            status="pending",
            amount_minor=0,
            currency="MXN",
            error_message_safe="Estado mock pendiente.",
            raw_response_hash=_hash_payload(provider_transaction_id),
        )

    def refund_or_void_future(self, provider_transaction_id: str) -> None:
        raise NotImplementedError(f"Refund/void future only for {provider_transaction_id}")
