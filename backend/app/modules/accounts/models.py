from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class AccountStatus(StrEnum):
    DEMO = "demo"
    ACTIVE = "active"
    RESTRICTED = "restricted"
    SUSPENDED = "suspended"
    CLOSED = "closed"


class MovementType(StrEnum):
    DEMO_CREDIT = "demo_credit"
    DEMO_DEBIT = "demo_debit"
    SERVICE_PAYMENT = "service_payment"
    FEE_CHARGE = "fee_charge"
    PAYMENT_REVERSAL = "payment_reversal"
    ADJUSTMENT = "adjustment"


class MovementDirection(StrEnum):
    CREDIT = "credit"
    DEBIT = "debit"


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    account_type: Mapped[str] = mapped_column(String(80), default="demo_account", index=True)
    status: Mapped[AccountStatus] = mapped_column(Enum(AccountStatus), default=AccountStatus.DEMO, index=True)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    closed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    snapshots = relationship("BalanceSnapshot", back_populates="account")
    movements = relationship("Movement", back_populates="account")


class BalanceSnapshot(Base):
    __tablename__ = "balance_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), index=True)
    available_minor: Mapped[int] = mapped_column(Integer, default=0)
    pending_minor: Mapped[int] = mapped_column(Integer, default=0)
    held_minor: Mapped[int] = mapped_column(Integer, default=0)
    simulated_minor: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    source: Mapped[str] = mapped_column(String(80), default="demo_seed")
    is_real_money: Mapped[bool] = mapped_column(Boolean, default=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)
    as_of: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    account = relationship("Account", back_populates="snapshots")


class Movement(Base):
    __tablename__ = "movements"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), index=True)
    ledger_entry_id: Mapped[int | None] = mapped_column(ForeignKey("ledger_entries.id"), nullable=True, index=True)
    payment_id: Mapped[int | None] = mapped_column(ForeignKey("payments.id"), nullable=True, index=True)
    receipt_id: Mapped[int | None] = mapped_column(ForeignKey("receipts.id"), nullable=True, index=True)
    movement_type: Mapped[MovementType] = mapped_column(Enum(MovementType), index=True)
    direction: Mapped[MovementDirection] = mapped_column(Enum(MovementDirection), index=True)
    amount_minor: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    status: Mapped[str] = mapped_column(String(40), default="demo_confirmed", index=True)
    description: Mapped[str] = mapped_column(Text)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    account = relationship("Account", back_populates="movements")
