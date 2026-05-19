from datetime import datetime

from pydantic import BaseModel


class ReceiptRead(BaseModel):
    id: int
    payment_id: int
    folio: str
    message: str
    created_at: datetime

    model_config = {"from_attributes": True}

