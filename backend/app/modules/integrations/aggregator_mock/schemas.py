from decimal import Decimal

from pydantic import BaseModel


class BalanceResult(BaseModel):
    amount_due: Decimal
    message: str


class PaymentResult(BaseModel):
    external_reference: str
    message: str


class ReceiptResult(BaseModel):
    folio: str
    message: str

