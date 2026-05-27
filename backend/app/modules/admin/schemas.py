from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

SupportTicketStatus = Literal["open", "pending", "waiting_user", "waiting_internal", "resolved", "closed"]
SupportTicketPriority = Literal["low", "medium", "high", "urgent"]
SupportTicketCategory = Literal[
    "payment_failed",
    "payment_pending",
    "receipt_missing",
    "prontipagos_issue",
    "duplicate_charge_claim",
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
    "card_success_prontipagos_pending",
    "prontipagos_timeout",
    "prontipagos_pending",
    "receipt_unavailable",
    "duplicate_attempt",
    "duplicate_charge_claim",
    "amount_mismatch",
    "chargeback_suspected",
    "user_claims_not_paid",
    "provider_timeout",
    "provider_status_unknown",
    "reconciliation_mismatch",
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
    manual_review_case_id: int | None = None
    correlation_id: str | None = Field(default=None, max_length=120)
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
    manual_review_case_id: int | None = None
    correlation_id: str | None = Field(default=None, max_length=120)
    resolution_note: str | None = Field(default=None, max_length=4000)


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
    manual_review_case_id: int | None = None
    correlation_id: str | None = None
    status: str
    priority: str
    category: str
    subject: str
    description: str | None = None
    assigned_to: int | None = None
    created_by: int
    created_at: datetime
    updated_at: datetime
    closed_at: datetime | None = None
    notes: list[SupportTicketNoteRead] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class ManualReviewCaseCreate(BaseModel):
    case_type: ManualReviewCaseType
    severity: Literal["low", "medium", "high", "urgent"] = "medium"
    user_id: int | None = None
    payment_id: int | None = None
    receipt_id: int | None = None
    support_ticket_id: int | None = None
    card_reference: str | None = Field(default=None, max_length=160)
    provider_reference: str | None = Field(default=None, max_length=160)
    correlation_id: str | None = Field(default=None, max_length=120)
    assigned_to: int | None = None
    summary: str = Field(min_length=3, max_length=4000)


class ManualReviewCaseUpdate(BaseModel):
    status: ManualReviewStatus | None = None
    severity: Literal["low", "medium", "high", "urgent"] | None = None
    assigned_to: int | None = None
    resolution: str | None = Field(default=None, max_length=4000)
    note: str | None = Field(default=None, max_length=4000)


class ManualReviewCaseRead(BaseModel):
    id: int
    case_type: str
    status: str
    severity: str
    user_id: int | None = None
    payment_id: int | None = None
    receipt_id: int | None = None
    support_ticket_id: int | None = None
    card_reference: str | None = None
    provider_reference: str | None = None
    correlation_id: str | None = None
    assigned_to: int | None = None
    summary: str
    resolution: str | None = None
    created_at: datetime
    updated_at: datetime
    closed_at: datetime | None = None


class ReconciliationSummaryCounts(BaseModel):
    total_count: int = 0
    matched_count: int = 0
    mismatch_count: int = 0
    pending_count: int = 0
    manual_review_count: int = 0


class ReconciliationSummaryPlaceholder(BaseModel):
    provider_type: Literal["card_processor", "prontipagos"]
    status: Literal["not_implemented", "ready_for_sandbox", "partial"]
    summary: ReconciliationSummaryCounts
    items: list[dict] = Field(default_factory=list)
    message: str
    production_ready: bool = False


class AdminSearchResult(BaseModel):
    entity_type: Literal["user", "payment", "receipt", "ticket", "manual_review", "correlation", "provider_reference"]
    entity_id: int | str
    label: str
    status: str | None = None
    correlation_id: str | None = None
    provider_reference: str | None = None


class AdminSearchResponse(BaseModel):
    query: str
    type: str | None = None
    results: list[AdminSearchResult] = Field(default_factory=list)
