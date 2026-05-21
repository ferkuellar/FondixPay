from typing import Literal

from pydantic import BaseModel

ProntipagosStatus = Literal[
    "provider_confirmed",
    "provider_pending",
    "provider_rejected",
    "provider_timeout",
    "provider_failed",
    "provider_duplicate_blocked",
    "provider_unknown",
]
ProntipagosMockScenario = Literal[
    "success",
    "pending",
    "invalid_reference",
    "amount_mismatch",
    "timeout",
    "provider_unavailable",
    "duplicate_blocked",
    "failed",
]


class ProntipagosReferenceRequest(BaseModel):
    service_provider_id: int
    service_reference: str
    correlation_id: str


class ProntipagosAmountResponse(BaseModel):
    amount_minor: int
    currency: str
    status: Literal["amount_found", "amount_mismatch"]


class ServicePaymentRequest(BaseModel):
    payment_intent_id: int
    user_service_id: int
    service_provider_id: int
    service_reference: str
    amount_minor: int
    currency: str
    idempotency_key: str
    correlation_id: str
    scenario: ProntipagosMockScenario = "success"


class ServicePaymentResponse(BaseModel):
    provider_name: Literal["prontipagos"]
    provider_reference: str | None
    status: ProntipagosStatus
    amount_minor: int
    currency: str
    receipt_reference: str | None = None
    error_code: str | None = None
    error_message_safe: str | None = None
    raw_response_hash: str | None = None
