from sqlalchemy.orm import Session

from app.modules.ledger.models import (
    LedgerAccount,
    LedgerDirection,
    LedgerEntry,
    PaymentAttempt,
    PaymentIntent,
    ProviderTransaction,
)
from app.modules.ledger.state_machine import PaymentAttemptStatus, PaymentIntentStatus


def get_intent_by_idempotency(db: Session, user_id: int, idempotency_key: str) -> PaymentIntent | None:
    return (
        db.query(PaymentIntent)
        .filter(PaymentIntent.user_id == user_id, PaymentIntent.idempotency_key == idempotency_key)
        .one_or_none()
    )


def create_payment_intent(
    db: Session,
    *,
    user_id: int,
    user_service_id: int,
    amount_minor: int,
    fee_minor: int,
    total_minor: int,
    idempotency_key: str,
    correlation_id: str,
) -> PaymentIntent:
    intent = PaymentIntent(
        user_id=user_id,
        user_service_id=user_service_id,
        amount_minor=amount_minor,
        fee_minor=fee_minor,
        total_minor=total_minor,
        currency="MXN",
        status=PaymentIntentStatus.CREATED,
        idempotency_key=idempotency_key,
        correlation_id=correlation_id,
    )
    db.add(intent)
    db.flush()
    return intent


def create_payment_attempt(
    db: Session,
    *,
    payment_intent_id: int,
    provider_name: str = "mock",
    provider_operation: str = "mock_payment",
) -> PaymentAttempt:
    attempt = PaymentAttempt(
        payment_intent_id=payment_intent_id,
        provider_name=provider_name,
        provider_operation=provider_operation,
        status=PaymentAttemptStatus.CREATED,
    )
    db.add(attempt)
    db.flush()
    return attempt


def get_or_create_account(
    db: Session,
    *,
    owner_type: str,
    owner_id: str | None,
    account_type: str,
    currency: str = "MXN",
) -> LedgerAccount:
    account = (
        db.query(LedgerAccount)
        .filter(
            LedgerAccount.owner_type == owner_type,
            LedgerAccount.owner_id == owner_id,
            LedgerAccount.account_type == account_type,
            LedgerAccount.currency == currency,
        )
        .one_or_none()
    )
    if account is not None:
        return account
    account = LedgerAccount(owner_type=owner_type, owner_id=owner_id, account_type=account_type, currency=currency)
    db.add(account)
    db.flush()
    return account


def create_ledger_entry(
    db: Session,
    *,
    ledger_account_id: int,
    payment_intent_id: int | None,
    direction: LedgerDirection,
    amount_minor: int,
    entry_type: str,
    correlation_id: str,
    description: str | None = None,
    created_by: str | None = None,
) -> LedgerEntry:
    entry = LedgerEntry(
        ledger_account_id=ledger_account_id,
        payment_intent_id=payment_intent_id,
        direction=direction,
        amount_minor=amount_minor,
        currency="MXN",
        entry_type=entry_type,
        description=description,
        correlation_id=correlation_id,
        created_by=created_by,
    )
    db.add(entry)
    db.flush()
    return entry


def create_provider_transaction(
    db: Session,
    *,
    payment_attempt_id: int,
    provider_name: str,
    provider_reference: str | None,
    provider_status: str,
    amount_minor: int,
    raw_response_hash: str | None = None,
) -> ProviderTransaction:
    transaction = ProviderTransaction(
        payment_attempt_id=payment_attempt_id,
        provider_name=provider_name,
        provider_reference=provider_reference,
        provider_status=provider_status,
        amount_minor=amount_minor,
        currency="MXN",
        raw_response_hash=raw_response_hash,
    )
    db.add(transaction)
    db.flush()
    return transaction
