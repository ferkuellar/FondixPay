import pytest

from app.modules.ledger.state_machine import (
    InvalidStateTransition,
    PaymentAttemptStatus,
    PaymentIntentStatus,
    validate_payment_attempt_transition,
    validate_payment_intent_transition,
)


def test_valid_payment_intent_transition_passes() -> None:
    validate_payment_intent_transition(
        PaymentIntentStatus.CREATED,
        PaymentIntentStatus.AWAITING_USER_CONFIRMATION,
    )


def test_invalid_payment_intent_transition_fails() -> None:
    with pytest.raises(InvalidStateTransition):
        validate_payment_intent_transition(PaymentIntentStatus.CREATED, PaymentIntentStatus.SUCCEEDED)


def test_valid_payment_attempt_transition_passes() -> None:
    validate_payment_attempt_transition(
        PaymentAttemptStatus.CREATED,
        PaymentAttemptStatus.SUBMITTED_TO_PROVIDER,
    )


def test_invalid_payment_attempt_transition_fails() -> None:
    with pytest.raises(InvalidStateTransition):
        validate_payment_attempt_transition(PaymentAttemptStatus.CREATED, PaymentAttemptStatus.SUCCEEDED)
