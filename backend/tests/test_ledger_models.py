from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.ledger import repository
from app.modules.ledger.models import LedgerDirection
from app.modules.ledger.services import amount_to_minor_units


def test_amount_to_minor_units_uses_integer_centavos() -> None:
    assert amount_to_minor_units(Decimal("125.50")) == 12550
    assert amount_to_minor_units(Decimal("10.005")) == 1001


def test_ledger_account_and_entry_are_persisted_as_trace_records(db_session: Session) -> None:
    account = repository.get_or_create_account(
        db_session,
        owner_type="SYSTEM",
        owner_id=None,
        account_type="MOCK_PAYMENT_TRACE",
    )
    entry = repository.create_ledger_entry(
        db_session,
        ledger_account_id=account.id,
        payment_intent_id=None,
        direction=LedgerDirection.DEBIT,
        amount_minor=12550,
        entry_type="mock_payment_trace",
        correlation_id="corr-ledger-test",
        description="Mock trace only",
        created_by="test",
    )
    db_session.commit()

    assert account.id is not None
    assert entry.id is not None
    assert entry.amount_minor == 12550
    assert entry.currency == "MXN"
    assert entry.correlation_id == "corr-ledger-test"
