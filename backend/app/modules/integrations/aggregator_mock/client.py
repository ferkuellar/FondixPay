from decimal import Decimal
from uuid import uuid4

from app.modules.integrations.aggregator_mock.schemas import BalanceResult, PaymentResult, ReceiptResult


class AggregatorMockClient:
    def check_balance(self, provider_name: str, reference: str) -> BalanceResult:
        seed = sum(ord(char) for char in f"{provider_name}{reference}")
        amount = Decimal(150 + (seed % 850)).quantize(Decimal("1.00"))
        return BalanceResult(amount_due=amount, message="Encontramos un saldo pendiente")

    def pay_service(self, provider_name: str, reference: str, amount: Decimal) -> PaymentResult:
        short_id = uuid4().hex[:10].upper()
        return PaymentResult(
            external_reference=f"MOCK-{short_id}",
            message=f"Ya quedo pagado {provider_name}",
        )

    def generate_receipt(self, external_reference: str, amount: Decimal) -> ReceiptResult:
        return ReceiptResult(
            folio=f"FP-{external_reference}",
            message=f"Comprobante por ${amount}",
        )

