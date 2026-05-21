from typing import Literal

from pydantic import BaseModel

CardChargeStatus = Literal[
    "succeeded",
    "declined",
    "pending",
    "timeout",
    "failed",
    "duplicate_blocked",
    "auth_required_future",
]
CardMockScenario = Literal[
    "success",
    "declined",
    "pending",
    "timeout",
    "failed",
    "duplicate_blocked",
    "auth_required_future",
]


class CardTokenizationMockRequest(BaseModel):
    mock_token_seed: str
    correlation_id: str


class CardTokenizationMockResponse(BaseModel):
    provider_name: str
    payment_method_token: str
    status: Literal["tokenized"]
    raw_response_hash: str | None = None


class CardChargeRequest(BaseModel):
    payment_intent_id: int
    amount_minor: int
    currency: str
    card_payment_method_token: str
    idempotency_key: str
    correlation_id: str
    scenario: CardMockScenario = "success"


class CardChargeResponse(BaseModel):
    provider_name: str
    provider_transaction_id: str | None
    status: CardChargeStatus
    amount_minor: int
    currency: str
    error_code: str | None = None
    error_message_safe: str | None = None
    raw_response_hash: str | None = None
