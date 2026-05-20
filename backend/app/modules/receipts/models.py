from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id: Mapped[int] = mapped_column(primary_key=True)
    payment_id: Mapped[int] = mapped_column(ForeignKey("payments.id"), unique=True)
    folio: Mapped[str] = mapped_column(String(120), unique=True)
    message: Mapped[str] = mapped_column(String(240))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    payment = relationship("Payment", back_populates="receipt")

    @property
    def amount_minor(self) -> int:
        return self.payment.amount_minor

    @property
    def fee_minor(self) -> int:
        return self.payment.fee_minor

    @property
    def total_minor(self) -> int:
        return self.payment.total_minor

    @property
    def currency(self) -> str:
        return self.payment.currency

    @property
    def fee_label(self) -> str:
        return self.payment.fee_label

    @property
    def payment_reference(self) -> str | None:
        return self.payment.external_reference

    @property
    def is_mock(self) -> bool:
        return True

