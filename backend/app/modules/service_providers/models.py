from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ServiceCategory(StrEnum):
    ELECTRICITY = "ELECTRICITY"
    PHONE = "PHONE"
    INTERNET = "INTERNET"
    WATER = "WATER"
    GAS = "GAS"
    TV = "TV"
    OTHER = "OTHER"


class IntegrationType(StrEnum):
    MOCK = "MOCK"
    MANUAL = "MANUAL"
    API_READY = "API_READY"


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(120))
    category: Mapped[str] = mapped_column(String(40), index=True)
    icon_key: Mapped[str] = mapped_column(String(40), default="other")
    integration_type: Mapped[str] = mapped_column(String(20), default=IntegrationType.MOCK.value)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=100)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user_services = relationship("UserService", back_populates="provider")
