from hashlib import sha256
from uuid import uuid4

from app.modules.providers.prontipagos.errors import PRONTIPAGOS_ERROR_MESSAGES
from app.modules.providers.prontipagos.schemas import (
    ProntipagosAmountResponse,
    ProntipagosReferenceRequest,
    ServicePaymentRequest,
    ServicePaymentResponse,
)


def _hash_payload(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()


class MockProntipagosClient:
    provider_name = "prontipagos"

    def __init__(self) -> None:
        self.execution_calls = 0

    def validate_reference(self, request: ProntipagosReferenceRequest) -> bool:
        return not request.service_reference.startswith("INVALID")

    def lookup_amount(self, request: ProntipagosReferenceRequest) -> ProntipagosAmountResponse:
        return ProntipagosAmountResponse(amount_minor=0, currency="MXN", status="amount_found")

    def execute_service_payment(self, request: ServicePaymentRequest) -> ServicePaymentResponse:
        self.execution_calls += 1
        status_map = {
            "success": ("provider_confirmed", None, None),
            "pending": ("provider_pending", None, "Pago pendiente de confirmacion."),
            "invalid_reference": (
                "provider_rejected",
                "invalid_reference",
                PRONTIPAGOS_ERROR_MESSAGES["invalid_reference"],
            ),
            "amount_mismatch": (
                "provider_failed",
                "amount_mismatch",
                PRONTIPAGOS_ERROR_MESSAGES["amount_mismatch"],
            ),
            "timeout": (
                "provider_timeout",
                "provider_timeout",
                PRONTIPAGOS_ERROR_MESSAGES["provider_timeout"],
            ),
            "provider_unavailable": (
                "provider_failed",
                "provider_unavailable",
                PRONTIPAGOS_ERROR_MESSAGES["provider_unavailable"],
            ),
            "duplicate_blocked": (
                "provider_duplicate_blocked",
                "duplicate_transaction",
                PRONTIPAGOS_ERROR_MESSAGES["duplicate_transaction"],
            ),
            "failed": ("provider_failed", "provider_failed", PRONTIPAGOS_ERROR_MESSAGES["provider_failed"]),
        }
        status, error_code, error_message = status_map[request.scenario]
        provider_reference = f"pp_mock_{uuid4().hex[:16]}" if status == "provider_confirmed" else None
        receipt_reference = f"folio_{uuid4().hex[:12]}" if status == "provider_confirmed" else None
        return ServicePaymentResponse(
            provider_name="prontipagos",
            provider_reference=provider_reference,
            status=status,
            amount_minor=request.amount_minor,
            currency=request.currency,
            receipt_reference=receipt_reference,
            error_code=error_code,
            error_message_safe=error_message,
            raw_response_hash=_hash_payload(f"{request.payment_intent_id}:{request.idempotency_key}:{status}"),
        )

    def get_service_payment_status(self, provider_reference: str) -> ServicePaymentResponse:
        return ServicePaymentResponse(
            provider_name="prontipagos",
            provider_reference=provider_reference,
            status="provider_pending",
            amount_minor=0,
            currency="MXN",
            error_message_safe="Estado mock pendiente.",
            raw_response_hash=_hash_payload(provider_reference),
        )
