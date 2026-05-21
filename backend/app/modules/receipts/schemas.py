from datetime import datetime

from pydantic import BaseModel


class ReceiptRead(BaseModel):
    id: int
    payment_id: int
    folio: str
    message: str
    amount_minor: int
    fee_minor: int
    total_minor: int
    currency: str
    fee_label: str
    payment_reference: str | None = None
    is_mock: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ReceiptProofRead(BaseModel):
    id: str
    payment_id: int
    receipt_id: int | None = None
    service_name: str
    service_provider_name: str
    service_reference_masked: str
    amount_minor: int
    fee_minor: int
    total_minor: int
    currency: str
    payment_status: str
    provider_status: str
    receipt_status: str
    proof_status: str
    card_label_safe: str | None = None
    card_last4: str | None = None
    provider_reference: str | None = None
    internal_reference: str
    correlation_id: str | None = None
    is_mock: bool
    is_sandbox: bool
    issued_at: datetime
    confirmed_at: datetime | None = None
    unavailable_reason: str | None = None
    disclaimer: str

