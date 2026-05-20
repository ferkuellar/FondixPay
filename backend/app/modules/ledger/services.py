from decimal import Decimal, ROUND_HALF_UP
from uuid import uuid4

from sqlalchemy.orm import Session

from app.modules.audit.services import create_audit_event
from app.modules.ledger import repository
from app.modules.ledger.models import LedgerDirection, PaymentAttempt, PaymentIntent
from app.modules.ledger.state_machine import (
    PaymentAttemptStatus,
    PaymentIntentStatus,
    validate_payment_attempt_transition,
    validate_payment_intent_transition,
)


def amount_to_minor_units(amount: Decimal) -> int:
    return int((amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def new_correlation_id() -> str:
    return f"corr_{uuid4().hex}"


def transition_intent(intent: PaymentIntent, next_status: PaymentIntentStatus) -> PaymentIntent:
    validate_payment_intent_transition(intent.status, next_status)
    intent.status = next_status
    return intent


def transition_attempt(attempt: PaymentAttempt, next_status: PaymentAttemptStatus) -> PaymentAttempt:
    validate_payment_attempt_transition(attempt.status, next_status)
    attempt.status = next_status
    return attempt


def get_or_create_mock_payment_intent(
    db: Session,
    *,
    user_id: int,
    user_service_id: int,
    amount: Decimal,
    idempotency_key: str,
    request_id: str | None,
    correlation_id: str | None,
) -> tuple[PaymentIntent, bool]:
    existing = repository.get_intent_by_idempotency(db, user_id, idempotency_key)
    if existing is not None:
        create_audit_event(
            db,
            event_type="payment.duplicate_blocked",
            actor_type="USER",
            actor_id=user_id,
            entity_type="PaymentIntent",
            entity_id=existing.id,
            result="blocked",
            metadata={"idempotency_key": idempotency_key, "user_service_id": user_service_id},
            request_id=request_id,
            correlation_id=existing.correlation_id,
        )
        return existing, True

    amount_minor = amount_to_minor_units(amount)
    intent = repository.create_payment_intent(
        db,
        user_id=user_id,
        user_service_id=user_service_id,
        amount_minor=amount_minor,
        fee_minor=0,
        total_minor=amount_minor,
        idempotency_key=idempotency_key,
        correlation_id=correlation_id or new_correlation_id(),
    )
    create_audit_event(
        db,
        event_type="payment.intent_created",
        actor_type="USER",
        actor_id=user_id,
        entity_type="PaymentIntent",
        entity_id=intent.id,
        result="success",
        after={"status": intent.status.value},
        metadata={"amount_minor": amount_minor, "fee_minor": 0, "total_minor": amount_minor, "currency": "MXN"},
        request_id=request_id,
        correlation_id=intent.correlation_id,
    )
    transition_intent(intent, PaymentIntentStatus.AWAITING_USER_CONFIRMATION)
    transition_intent(intent, PaymentIntentStatus.CONFIRMED_BY_USER)
    create_audit_event(
        db,
        event_type="payment.confirmed_by_user",
        actor_type="USER",
        actor_id=user_id,
        entity_type="PaymentIntent",
        entity_id=intent.id,
        result="success",
        after={"status": intent.status.value},
        request_id=request_id,
        correlation_id=intent.correlation_id,
    )
    return intent, False


def create_mock_attempt(db: Session, intent: PaymentIntent, *, request_id: str | None) -> PaymentAttempt:
    attempt = repository.create_payment_attempt(db, payment_intent_id=intent.id)
    transition_intent(intent, PaymentIntentStatus.PROCESSING)
    transition_attempt(attempt, PaymentAttemptStatus.SUBMITTED_TO_PROVIDER)
    create_audit_event(
        db,
        event_type="payment.mock_submitted",
        actor_type="SYSTEM",
        entity_type="PaymentAttempt",
        entity_id=attempt.id,
        result="success",
        metadata={"provider_name": "mock", "provider_operation": "mock_payment"},
        request_id=request_id,
        correlation_id=intent.correlation_id,
    )
    return attempt


def mark_mock_success(
    db: Session,
    *,
    intent: PaymentIntent,
    attempt: PaymentAttempt,
    provider_reference: str,
    request_id: str | None,
) -> None:
    transition_attempt(attempt, PaymentAttemptStatus.ACCEPTED_BY_PROVIDER)
    transition_attempt(attempt, PaymentAttemptStatus.SUCCEEDED)
    transition_intent(intent, PaymentIntentStatus.PROVIDER_PENDING)
    transition_intent(intent, PaymentIntentStatus.PROVIDER_CONFIRMED)
    transition_intent(intent, PaymentIntentStatus.SUCCEEDED)
    attempt.provider_reference = provider_reference
    repository.create_provider_transaction(
        db,
        payment_attempt_id=attempt.id,
        provider_name="mock",
        provider_reference=provider_reference,
        provider_status="mock_succeeded",
        amount_minor=intent.total_minor,
    )
    account = repository.get_or_create_account(
        db,
        owner_type="SYSTEM",
        owner_id=None,
        account_type="MOCK_PAYMENT_TRACE",
    )
    repository.create_ledger_entry(
        db,
        ledger_account_id=account.id,
        payment_intent_id=intent.id,
        direction=LedgerDirection.DEBIT,
        amount_minor=intent.total_minor,
        entry_type="mock_payment_trace",
        correlation_id=intent.correlation_id,
        description="Mock payment trace entry; not real money movement",
        created_by="system",
    )
    create_audit_event(
        db,
        event_type="payment.succeeded",
        actor_type="SYSTEM",
        entity_type="PaymentIntent",
        entity_id=intent.id,
        result="success",
        after={"status": intent.status.value},
        metadata={"provider_reference": provider_reference, "mock": True},
        request_id=request_id,
        correlation_id=intent.correlation_id,
    )
