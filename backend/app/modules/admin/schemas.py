from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

SupportTicketStatus = Literal["open", "pending", "resolved", "closed"]
SupportTicketPriority = Literal["low", "medium", "high", "urgent"]
SupportTicketCategory = Literal[
    "payment_failed",
    "receipt_missing",
    "pending_payment",
    "account_access",
    "card_issue",
    "other",
]
ManualReviewStatus = Literal[
    "open",
    "assigned",
    "investigating",
    "waiting_provider",
    "waiting_user",
    "resolved",
    "escalated",
    "closed",
]
ManualReviewCaseType = Literal[
    "card_success_prontipagos_failed",
    "prontipagos_pending",
    "receipt_unavailable",
    "duplicate_attempt",
    "amount_mismatch",
    "chargeback_suspected",
    "user_claims_not_paid",
    "provider_timeout",
    "other",
]


class DashboardSummary(BaseModel):
    users_count: int
    payments_count: int
    payments_succeeded_count: int
    payments_pending_count: int
    payments_failed_count: int
    receipts_generated_count: int
    receipts_pending_count: int | None = None
    manual_review_open_count: int
    support_tickets_open_count: int
    card_reconciliation_status: str
    prontipagos_reconciliation_status: str
    note: str | None = None


class AdminUserListItem(BaseModel):
    id: int
    phone: str
    name: str | None = None
    role: str
    is_active: bool
    created_at: datetime


class AdminUserDetail(AdminUserListItem):
    recent_payment_ids: list[int] = Field(default_factory=list)
    receipt_ids: list[int] = Field(default_factory=list)


class AdminPaymentListItem(BaseModel):
    id: int
    user_id: int
    user_service_id: int
    service_name: str
    service_provider_name: str
    service_reference_masked: str
    status: str
    amount_minor: int
    fee_minor: int
    total_minor: int
    currency: str
    provider_reference: str | None = None
    receipt_id: int | None = None
    created_at: datetime
    paid_at: datetime | None = None
    is_mock: bool


class AdminPaymentDetail(AdminPaymentListItem):
    card_status: str
    service_payment_status: str
    receipt_status: str
    correlation_id: str | None = None


class AdminReceiptListItem(BaseModel):
    id: int
    payment_id: int
    user_id: int
    folio: str
    message: str
    amount_minor: int
    fee_minor: int
    total_minor: int
    currency: str
    payment_status: str
    provider_reference: str | None = None
    created_at: datetime
    is_mock: bool


class AdminReceiptDetail(AdminReceiptListItem):
    proof_status: str
    receipt_status: str
    correlation_id: str | None = None


class AdminAuditEventListItem(BaseModel):
    id: int
    event_type: str
    actor_type: str
    actor_id: str | None = None
    entity_type: str | None = None
    entity_id: str | None = None
    result: str
    request_id: str | None = None
    correlation_id: str | None = None
    metadata: dict | None = None
    created_at: datetime


class SupportTicketCreate(BaseModel):
    user_id: int | None = None
    payment_id: int | None = None
    receipt_id: int | None = None
    priority: SupportTicketPriority = "medium"
    category: SupportTicketCategory = "other"
    subject: str = Field(min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=4000)
    assigned_to: int | None = None


class SupportTicketUpdate(BaseModel):
    status: SupportTicketStatus | None = None
    priority: SupportTicketPriority | None = None
    subject: str | None = Field(default=None, min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=4000)
    assigned_to: int | None = None


class SupportTicketNoteCreate(BaseModel):
    note: str = Field(min_length=1, max_length=4000)
    is_internal: bool = True


class SupportTicketNoteRead(BaseModel):
    id: int
    author_id: int
    note: str
    is_internal: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SupportTicketRead(BaseModel):
    id: int
    user_id: int | None = None
    payment_id: int | None = None
    receipt_id: int | None = None
    status: str
    priority: str
    category: str
    subject: str
    description: str | None = None
    assigned_to: int | None = None
    created_by: int
    created_at: datetime
    updated_at: datetime
    notes: list[SupportTicketNoteRead] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class ManualReviewCaseCreate(BaseModel):
    case_type: ManualReviewCaseType
    severity: Literal["low", "medium", "high", "urgent"] = "medium"
    user_id: int | None = None
    payment_id: int | None = None
    receipt_id: int | None = None
    card_reference: str | None = Field(default=None, max_length=160)
    provider_reference: str | None = Field(default=None, max_length=160)
    correlation_id: str | None = Field(default=None, max_length=120)
    assigned_to: int | None = None


class ManualReviewCaseUpdate(BaseModel):
    status: ManualReviewStatus | None = None
    severity: Literal["low", "medium", "high", "urgent"] | None = None
    assigned_to: int | None = None
    resolution: str | None = Field(default=None, max_length=4000)


class ManualReviewCaseRead(BaseModel):
    id: int
    case_type: str
    status: str
    severity: str
    user_id: int | None = None
    payment_id: int | None = None
    receipt_id: int | None = None
    card_reference: str | None = None
    provider_reference: str | None = None
    correlation_id: str | None = None
    assigned_to: int | None = None
    resolution: str | None = None
    created_at: datetime
    updated_at: datetime


class ReconciliationSummaryPlaceholder(BaseModel):
    status: Literal["not_implemented"]
    provider: Literal["card", "prontipagos"]
    message: str
