from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel

from app.modules.payments.models import PaymentStatus
from app.modules.providers.card_processor.schemas import CardMockScenario


class PaymentCreate(BaseModel):
    user_service_id: int
    idempotency_key: str | None = None


class PaymentRead(BaseModel):
    id: int
    user_service_id: int
    amount: Decimal
    amount_minor: int
    fee_minor: int
    total_minor: int
    currency: str
    fee_label: str
    fee_description: str
    is_mock: bool
    status: PaymentStatus
    external_reference: str | None = None
    created_at: datetime
    paid_at: datetime | None = None

    model_config = {"from_attributes": True}


class SandboxPaymentCreate(BaseModel):
    user_service_id: int
    mock_card_token: str = "pm_mock_card_demo"
    idempotency_key: str
    card_scenario: CardMockScenario = "success"
    service_scenario: Literal["success", "pending", "invalid_reference", "amount_mismatch", "timeout", "provider_unavailable", "duplicate_blocked", "failed"] = "success"


class SandboxPaymentRead(BaseModel):
    payment_id: int
    status: str
    card_status: str
    service_payment_status: str
    receipt_status: str
    amount_minor: int
    fee_minor: int
    total_minor: int
    currency: str
    is_mock: bool
    is_sandbox: bool
    provider_reference: str | None = None
    card_reference: str | None = None
    correlation_id: str | None = None
    message: str

