from decimal import Decimal

from app.modules.payments.fees import calculate_fee_minor, calculate_total_minor, amount_to_minor_units


def test_mock_fee_calculation_uses_integer_minor_units() -> None:
    amount_minor = amount_to_minor_units(Decimal("125.50"))
    fee_minor = calculate_fee_minor()

    assert amount_minor == 12550
    assert fee_minor == 750
    assert calculate_total_minor(amount_minor, fee_minor) == 13300
