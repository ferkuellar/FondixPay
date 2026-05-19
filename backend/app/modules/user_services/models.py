from datetime import date, datetime, timezone
from decimal import Decimal

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserService(Base):
    __tablename__ = "user_services"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("service_providers.id"))
    alias: Mapped[str] = mapped_column(String(80))
    reference: Mapped[str] = mapped_column(String(80), index=True)
    amount_due: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="services")
    provider = relationship("ServiceProvider", back_populates="user_services")
    payments = relationship("Payment", back_populates="user_service")

