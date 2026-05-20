from datetime import datetime

from pydantic import BaseModel


class PaymentIntentRead(BaseModel):
    id: int
    user_id: int
    user_service_id: int
    amount_minor: int
    fee_minor: int
    total_minor: int
    currency: str
    status: str
    idempotency_key: str
    correlation_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
