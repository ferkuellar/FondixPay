from decimal import Decimal, ROUND_HALF_UP

from app.core.config import settings

FEE_LABEL = "Comision FondixPay"
FEE_DESCRIPTION = "Comision fija mock/dev por procesar y registrar tu pago."
CURRENCY = "MXN"


def amount_to_minor_units(amount: Decimal) -> int:
    return int((amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def calculate_fee_minor() -> int:
    return settings.fondix_fee_minor


def calculate_total_minor(amount_minor: int, fee_minor: int | None = None) -> int:
    fee = calculate_fee_minor() if fee_minor is None else fee_minor
    return amount_minor + fee
