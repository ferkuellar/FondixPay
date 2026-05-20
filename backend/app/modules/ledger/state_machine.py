from enum import StrEnum


class InvalidStateTransition(ValueError):
    pass


class PaymentIntentStatus(StrEnum):
    CREATED = "created"
    AWAITING_USER_CONFIRMATION = "awaiting_user_confirmation"
    CONFIRMED_BY_USER = "confirmed_by_user"
    PROCESSING = "processing"
    PROVIDER_PENDING = "provider_pending"
    PROVIDER_CONFIRMED = "provider_confirmed"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    REVERSED = "reversed"
    DISPUTED = "disputed"


class PaymentAttemptStatus(StrEnum):
    CREATED = "created"
    SUBMITTED_TO_PROVIDER = "submitted_to_provider"
    ACCEPTED_BY_PROVIDER = "accepted_by_provider"
    REJECTED_BY_PROVIDER = "rejected_by_provider"
    TIMEOUT = "timeout"
    FAILED = "failed"
    SUCCEEDED = "succeeded"
    DUPLICATE_BLOCKED = "duplicate_blocked"


PAYMENT_INTENT_TRANSITIONS: dict[PaymentIntentStatus, set[PaymentIntentStatus]] = {
    PaymentIntentStatus.CREATED: {PaymentIntentStatus.AWAITING_USER_CONFIRMATION},
    PaymentIntentStatus.AWAITING_USER_CONFIRMATION: {
        PaymentIntentStatus.CONFIRMED_BY_USER,
        PaymentIntentStatus.CANCELLED,
        PaymentIntentStatus.EXPIRED,
    },
    PaymentIntentStatus.CONFIRMED_BY_USER: {PaymentIntentStatus.PROCESSING},
    PaymentIntentStatus.PROCESSING: {PaymentIntentStatus.PROVIDER_PENDING, PaymentIntentStatus.FAILED},
    PaymentIntentStatus.PROVIDER_PENDING: {
        PaymentIntentStatus.PROVIDER_CONFIRMED,
        PaymentIntentStatus.FAILED,
        PaymentIntentStatus.DISPUTED,
    },
    PaymentIntentStatus.PROVIDER_CONFIRMED: {PaymentIntentStatus.SUCCEEDED},
    PaymentIntentStatus.SUCCEEDED: {PaymentIntentStatus.REVERSED, PaymentIntentStatus.DISPUTED},
    PaymentIntentStatus.FAILED: set(),
    PaymentIntentStatus.CANCELLED: set(),
    PaymentIntentStatus.EXPIRED: set(),
    PaymentIntentStatus.REVERSED: set(),
    PaymentIntentStatus.DISPUTED: set(),
}

PAYMENT_ATTEMPT_TRANSITIONS: dict[PaymentAttemptStatus, set[PaymentAttemptStatus]] = {
    PaymentAttemptStatus.CREATED: {
        PaymentAttemptStatus.SUBMITTED_TO_PROVIDER,
        PaymentAttemptStatus.DUPLICATE_BLOCKED,
    },
    PaymentAttemptStatus.SUBMITTED_TO_PROVIDER: {
        PaymentAttemptStatus.ACCEPTED_BY_PROVIDER,
        PaymentAttemptStatus.REJECTED_BY_PROVIDER,
        PaymentAttemptStatus.TIMEOUT,
    },
    PaymentAttemptStatus.ACCEPTED_BY_PROVIDER: {
        PaymentAttemptStatus.SUCCEEDED,
        PaymentAttemptStatus.FAILED,
    },
    PaymentAttemptStatus.REJECTED_BY_PROVIDER: {PaymentAttemptStatus.FAILED},
    PaymentAttemptStatus.TIMEOUT: {PaymentAttemptStatus.FAILED, PaymentAttemptStatus.SUBMITTED_TO_PROVIDER},
    PaymentAttemptStatus.FAILED: set(),
    PaymentAttemptStatus.SUCCEEDED: set(),
    PaymentAttemptStatus.DUPLICATE_BLOCKED: set(),
}


def validate_transition(current: StrEnum | str, next_status: StrEnum | str, transitions: dict) -> None:
    if next_status not in transitions.get(current, set()):
        raise InvalidStateTransition(f"Invalid transition from {current} to {next_status}")


def validate_payment_intent_transition(current: PaymentIntentStatus, next_status: PaymentIntentStatus) -> None:
    validate_transition(current, next_status, PAYMENT_INTENT_TRANSITIONS)


def validate_payment_attempt_transition(current: PaymentAttemptStatus, next_status: PaymentAttemptStatus) -> None:
    validate_transition(current, next_status, PAYMENT_ATTEMPT_TRANSITIONS)
