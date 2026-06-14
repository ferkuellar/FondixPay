from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.modules.service_catalog.constants import CapabilityStatus, CoverageStatus


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ServiceCategory(Base):
    __tablename__ = "catalog_service_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    display_order: Mapped[int] = mapped_column(Integer, default=100)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

    items = relationship("ServiceCatalogItem", back_populates="category")


class ServiceCatalogItem(Base):
    __tablename__ = "service_catalog_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("catalog_service_categories.id"), index=True)
    display_name: Mapped[str] = mapped_column(String(160), index=True)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    icon_key: Mapped[str] = mapped_column(String(40), default="other")
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_national: Mapped[bool] = mapped_column(Boolean, default=False)
    coverage_status: Mapped[str] = mapped_column(String(40), default=CoverageStatus.TO_CONFIRM.value, index=True)
    visible_on_landing: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    visible_on_mobile: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    payable_in_mobile: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    visible_on_admin: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    show_in_coverage_map: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    is_mock: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=100)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

    category = relationship("ServiceCategory", back_populates="items")
    coverage_states = relationship("ServiceCoverageByState", back_populates="service", cascade="all, delete-orphan")
    capabilities = relationship("ProviderServiceCapability", back_populates="service", cascade="all, delete-orphan")


class ServiceCoverageByState(Base):
    __tablename__ = "service_coverage_by_state"
    __table_args__ = (UniqueConstraint("service_catalog_item_id", "state_code", name="uq_service_coverage_state"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    service_catalog_item_id: Mapped[int] = mapped_column(ForeignKey("service_catalog_items.id"), index=True)
    state_code: Mapped[str] = mapped_column(String(3), index=True)
    state_name: Mapped[str] = mapped_column(String(120))
    coverage_status: Mapped[str] = mapped_column(String(40), default=CoverageStatus.TO_CONFIRM.value, index=True)
    source: Mapped[str] = mapped_column(String(120), default="seed")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

    service = relationship("ServiceCatalogItem", back_populates="coverage_states")


class ProviderServiceCapability(Base):
    __tablename__ = "provider_service_capabilities"

    id: Mapped[int] = mapped_column(primary_key=True)
    service_catalog_item_id: Mapped[int] = mapped_column(ForeignKey("service_catalog_items.id"), index=True)
    provider_name: Mapped[str] = mapped_column(String(80), default="service_provider_tbd", index=True)
    provider_service_code: Mapped[str | None] = mapped_column(String(120), nullable=True)
    supports_reference_validation: Mapped[bool] = mapped_column(Boolean, default=False)
    supports_amount_lookup: Mapped[bool] = mapped_column(Boolean, default=False)
    supports_payment_execution: Mapped[bool] = mapped_column(Boolean, default=False)
    supports_receipt: Mapped[bool] = mapped_column(Boolean, default=False)
    min_amount_minor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    max_amount_minor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="MXN")
    status: Mapped[str] = mapped_column(String(40), default=CapabilityStatus.TO_CONFIRM.value, index=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

    service = relationship("ServiceCatalogItem", back_populates="capabilities")


class CoverageMapSource(Base):
    __tablename__ = "coverage_map_sources"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_name: Mapped[str] = mapped_column(String(120), index=True)
    source_type: Mapped[str] = mapped_column(String(80), index=True)
    file_path: Mapped[str | None] = mapped_column(String(260), nullable=True)
    version: Mapped[str | None] = mapped_column(String(80), nullable=True)
    imported_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

