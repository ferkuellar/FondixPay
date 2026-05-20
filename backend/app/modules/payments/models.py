from datetime import datetime, timezone
from decimal import Decimal
from enum import StrEnum

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.modules.payments.fees import CURRENCY, FEE_DESCRIPTION, FEE_LABEL, calculate_fee_minor, calculate_total_minor, amount_to_minor_units


class PaymentStatus(StrEnum):
    CREATED = "CREATED"
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    REVERSED = "REVERSED"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    user_service_id: Mapped[int] = mapped_column(ForeignKey("user_services.id"))
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), default=PaymentStatus.CREATED)
    external_reference: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    user = relationship("User", back_populates="payments")
    user_service = relationship("UserService", back_populates="payments")
    receipt = relationship("Receipt", back_populates="payment", uselist=False)

    @property
    def amount_minor(self) -> int:
        return amount_to_minor_units(self.amount)

    @property
    def fee_minor(self) -> int:
        return calculate_fee_minor()

    @property
    def total_minor(self) -> int:
        return calculate_total_minor(self.amount_minor, self.fee_minor)

    @property
    def currency(self) -> str:
        return CURRENCY

    @property
    def fee_label(self) -> str:
        return FEE_LABEL

    @property
    def fee_description(self) -> str:
        return FEE_DESCRIPTION

    @property
    def is_mock(self) -> bool:
        return True

