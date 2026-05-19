from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.modules.payments.models import PaymentStatus


class PaymentCreate(BaseModel):
    user_service_id: int


class PaymentRead(BaseModel):
    id: int
    user_service_id: int
    amount: Decimal
    status: PaymentStatus
    external_reference: str | None = None
    created_at: datetime
    paid_at: datetime | None = None

    model_config = {"from_attributes": True}

