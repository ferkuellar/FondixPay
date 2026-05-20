from datetime import date, datetime, timezone
from enum import StrEnum

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.modules.ledger.state_machine import PaymentAttemptStatus, PaymentIntentStatus


class LedgerDirection(StrEnum):
    DEBIT = "debit"
    CREDIT = "credit"


class PaymentIntent(Base):
    __tablename__ = "payment_intents"
    __table_args__ = (UniqueConstraint("user_id", "idempotency_key", name="uq_payment_intents_user_idempotency"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    user_service_id: Mapped[int] = mapped_column(ForeignKey("user_services.id"), index=True)
    payment_id: Mapped[int | None] = mapped_column(ForeignKey("payments.id"), nullable=True, index=True)
    amount_minor: Mapped[int] = mapped_column(Integer)
    fee_minor: Mapped[int] = mapped_column(Integer, default=0)
    total_minor: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    status: Mapped[PaymentIntentStatus] = mapped_column(
        Enum(PaymentIntentStatus),
        default=PaymentIntentStatus.CREATED,
        index=True,
    )
    idempotency_key: Mapped[str] = mapped_column(String(120), index=True)
    correlation_id: Mapped[str] = mapped_column(String(80), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    attempts = relationship("PaymentAttempt", back_populates="payment_intent")
    ledger_entries = relationship("LedgerEntry", back_populates="payment_intent")


class PaymentAttempt(Base):
    __tablename__ = "payment_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    payment_intent_id: Mapped[int] = mapped_column(ForeignKey("payment_intents.id"), index=True)
    provider_name: Mapped[str] = mapped_column(String(80), default="mock")
    provider_operation: Mapped[str] = mapped_column(String(80), default="mock_payment")
    status: Mapped[PaymentAttemptStatus] = mapped_column(
        Enum(PaymentAttemptStatus),
        default=PaymentAttemptStatus.CREATED,
        index=True,
    )
    request_payload_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    response_payload_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    provider_reference: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    error_code: Mapped[str | None] = mapped_column(String(80), nullable=True)
    error_message_safe: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    payment_intent = relationship("PaymentIntent", back_populates="attempts")
    provider_transactions = relationship("ProviderTransaction", back_populates="payment_attempt")


class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_type: Mapped[str] = mapped_column(String(40), index=True)
    owner_id: Mapped[str | None] = mapped_column(String(80), nullable=True, index=True)
    account_type: Mapped[str] = mapped_column(String(80), index=True)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    status: Mapped[str] = mapped_column(String(40), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    entries = relationship("LedgerEntry", back_populates="ledger_account")


class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    ledger_account_id: Mapped[int] = mapped_column(ForeignKey("ledger_accounts.id"), index=True)
    payment_intent_id: Mapped[int | None] = mapped_column(ForeignKey("payment_intents.id"), nullable=True, index=True)
    direction: Mapped[LedgerDirection] = mapped_column(Enum(LedgerDirection))
    amount_minor: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    entry_type: Mapped[str] = mapped_column(String(80), index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    correlation_id: Mapped[str] = mapped_column(String(80), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_by: Mapped[str | None] = mapped_column(String(80), nullable=True)

    ledger_account = relationship("LedgerAccount", back_populates="entries")
    payment_intent = relationship("PaymentIntent", back_populates="ledger_entries")


class ProviderTransaction(Base):
    __tablename__ = "provider_transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    payment_attempt_id: Mapped[int] = mapped_column(ForeignKey("payment_attempts.id"), index=True)
    provider_name: Mapped[str] = mapped_column(String(80), index=True)
    provider_reference: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    provider_status: Mapped[str] = mapped_column(String(80), index=True)
    amount_minor: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    raw_response_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    payment_attempt = relationship("PaymentAttempt", back_populates="provider_transactions")


class ReconciliationRecord(Base):
    __tablename__ = "reconciliation_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    provider_name: Mapped[str] = mapped_column(String(80), index=True)
    reconciliation_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(80), index=True)
    matched_count: Mapped[int] = mapped_column(Integer, default=0)
    mismatch_count: Mapped[int] = mapped_column(Integer, default=0)
    metadata_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
