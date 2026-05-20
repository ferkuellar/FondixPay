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

