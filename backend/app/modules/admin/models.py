from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    payment_id: Mapped[int | None] = mapped_column(ForeignKey("payments.id"), nullable=True, index=True)
    receipt_id: Mapped[int | None] = mapped_column(ForeignKey("receipts.id"), nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(40), default="open", index=True)
    priority: Mapped[str] = mapped_column(String(40), default="medium", index=True)
    category: Mapped[str] = mapped_column(String(80), default="other", index=True)
    subject: Mapped[str] = mapped_column(String(180))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    assigned_to: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    notes = relationship("SupportTicketNote", back_populates="ticket", cascade="all, delete-orphan")


class SupportTicketNote(Base):
    __tablename__ = "support_ticket_notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("support_tickets.id"), index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    note: Mapped[str] = mapped_column(Text)
    is_internal: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    ticket = relationship("SupportTicket", back_populates="notes")


class ManualReviewCase(Base):
    __tablename__ = "manual_review_cases"

    id: Mapped[int] = mapped_column(primary_key=True)
    case_type: Mapped[str] = mapped_column(String(120), index=True)
    status: Mapped[str] = mapped_column(String(40), default="open", index=True)
    severity: Mapped[str] = mapped_column(String(40), default="medium", index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    payment_id: Mapped[int | None] = mapped_column(ForeignKey("payments.id"), nullable=True, index=True)
    receipt_id: Mapped[int | None] = mapped_column(ForeignKey("receipts.id"), nullable=True, index=True)
    card_reference: Mapped[str | None] = mapped_column(String(160), nullable=True)
    provider_reference: Mapped[str | None] = mapped_column(String(160), nullable=True)
    correlation_id: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    assigned_to: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    resolution: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    events = relationship("ManualReviewEvent", back_populates="case", cascade="all, delete-orphan")


class ManualReviewEvent(Base):
    __tablename__ = "manual_review_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    case_id: Mapped[int] = mapped_column(ForeignKey("manual_review_cases.id"), index=True)
    actor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    event_type: Mapped[str] = mapped_column(String(120))
    metadata_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    case = relationship("ManualReviewCase", back_populates="events")
