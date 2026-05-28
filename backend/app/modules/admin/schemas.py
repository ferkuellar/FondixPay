from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

SupportTicketStatus = Literal[
    "open",
    "pending",
    "waiting_user",
    "waiting_internal",
    "resolved",
    "closed",
    "new",
    "triaged",
    "assigned",
    "waiting_customer",
    "waiting_internal_review",
    "escalated",
    "reopened",
]
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
FraudSignalStatus = Literal["open", "reviewed", "dismissed", "escalated"]
FraudSignalSeverity = Literal["low", "medium", "high", "urgent"]
DisputeCaseType = Literal["dispute", "chargeback"]
DisputeCaseStatus = Literal[
    "OPEN",
    "UNDER_REVIEW",
    "EVIDENCE_GATHERING",
    "SUBMITTED",
    "WON",
    "LOST",
    "CLOSED",
    "CANCELED",
]
DisputeEvidenceType = Literal[
    "payment_summary",
    "receipt",
    "provider_confirmation",
    "card_processor_reference",
    "support_note",
    "manual_review",
    "reconciliation",
    "customer_communication",
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


class AdminNotificationDeliveryListItem(BaseModel):
    id: int
    user_id: int
    channel: str
    notification_type: str
    template_name: str
    entity_type: str
    entity_id: str
    recipient_masked: str
    status: str
    provider_name: str | None = None
    provider_message_id: str | None = None
    error_code: str | None = None
    error_message_safe: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AdminNotificationDeliveryDetail(AdminNotificationDeliveryListItem):
    metadata_json: dict | None = None


class SupportTicketCreate(BaseModel):
    user_id: int | None = None
    payment_id: int | None = None
    receipt_id: int | None = None
    conversation_id: int | None = None
    manual_review_case_id: int | None = None
    correlation_id: str | None = Field(default=None, max_length=120)
    ticket_number: str | None = Field(default=None, max_length=40)
    source: str = Field(default="admin", max_length=40)
    priority: SupportTicketPriority = "medium"
    severity: str = Field(default="SEV-3", pattern=r"^SEV-[1-5]$")
    category: SupportTicketCategory = "other"
    title: str | None = Field(default=None, max_length=180)
    summary: str | None = Field(default=None, max_length=4000)
    customer_message_excerpt: str | None = Field(default=None, max_length=4000)
    subject: str = Field(min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=4000)
    assigned_to: int | None = None
    sla_due_at: datetime | None = None


class SupportTicketUpdate(BaseModel):
    status: SupportTicketStatus | None = None
    priority: SupportTicketPriority | None = None
    severity: str | None = Field(default=None, pattern=r"^SEV-[1-5]$")
    title: str | None = Field(default=None, min_length=3, max_length=180)
    summary: str | None = Field(default=None, max_length=4000)
    customer_message_excerpt: str | None = Field(default=None, max_length=4000)
    subject: str | None = Field(default=None, min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=4000)
    assigned_to: int | None = None
    manual_review_case_id: int | None = None
    correlation_id: str | None = Field(default=None, max_length=120)
    sla_due_at: datetime | None = None
    first_response_at: datetime | None = None
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
    conversation_id: int | None = None
    manual_review_case_id: int | None = None
    correlation_id: str | None = None
    ticket_number: str | None = None
    source: str = "admin"
    status: str
    priority: str
    severity: str = "SEV-3"
    category: str
    title: str | None = None
    summary: str | None = None
    customer_message_excerpt: str | None = None
    subject: str
    description: str | None = None
    assigned_to: int | None = None
    created_by: int
    sla_due_at: datetime | None = None
    first_response_at: datetime | None = None
    resolved_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    closed_at: datetime | None = None
    reopened_at: datetime | None = None
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


class FraudSignalCreate(BaseModel):
    signal_type: str = Field(min_length=3, max_length=120)
    severity: FraudSignalSeverity = "medium"
    entity_type: str = Field(min_length=2, max_length=80)
    entity_id: str = Field(min_length=1, max_length=80)
    user_id: int | None = None
    payment_id: int | None = None
    transaction_id: int | None = None
    reason: str = Field(min_length=3, max_length=4000)
    metadata_json: dict | None = None


class FraudSignalUpdate(BaseModel):
    status: FraudSignalStatus
    resolution: str | None = Field(default=None, max_length=4000)


class FraudSignalRead(BaseModel):
    id: int
    signal_type: str
    severity: str
    status: str
    entity_type: str
    entity_id: str
    user_id: int | None = None
    payment_id: int | None = None
    transaction_id: int | None = None
    reason: str
    metadata_json: dict | None = None
    created_by: int
    created_at: datetime
    reviewed_at: datetime | None = None
    reviewed_by: int | None = None
    resolution: str | None = None

    model_config = {"from_attributes": True}


class DisputeEvidenceCreate(BaseModel):
    evidence_type: DisputeEvidenceType
    title: str = Field(min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=4000)
    storage_reference: str | None = Field(default=None, max_length=260)
    source_entity_type: str | None = Field(default=None, max_length=80)
    source_entity_id: str | None = Field(default=None, max_length=80)


class DisputeEvidenceRead(BaseModel):
    id: int
    dispute_case_id: int
    evidence_type: str
    title: str
    description: str | None = None
    storage_reference: str | None = None
    source_entity_type: str | None = None
    source_entity_id: str | None = None
    created_at: datetime
    created_by: int

    model_config = {"from_attributes": True}


class DisputeCaseCreate(BaseModel):
    case_type: DisputeCaseType = "dispute"
    payment_id: int | None = None
    transaction_id: int | None = None
    user_id: int | None = None
    provider_transaction_id: str | None = Field(default=None, max_length=160)
    card_processor_reference: str | None = Field(default=None, max_length=160)
    amount_minor: int | None = Field(default=None, ge=0)
    currency: str = Field(default="MXN", min_length=3, max_length=3)
    reason_code: str | None = Field(default=None, max_length=80)
    summary: str = Field(min_length=3, max_length=4000)
    due_at: datetime | None = None
    assigned_to: int | None = None


class DisputeCaseUpdate(BaseModel):
    status: DisputeCaseStatus
    assigned_to: int | None = None


class DisputeCaseRead(BaseModel):
    id: int
    case_type: str
    status: str
    payment_id: int | None = None
    transaction_id: int | None = None
    user_id: int | None = None
    provider_transaction_id: str | None = None
    card_processor_reference: str | None = None
    amount_minor: int | None = None
    currency: str
    reason_code: str | None = None
    summary: str
    opened_at: datetime
    due_at: datetime | None = None
    closed_at: datetime | None = None
    assigned_to: int | None = None
    created_by: int
    updated_by: int | None = None
    updated_at: datetime
    evidence: list[DisputeEvidenceRead] = Field(default_factory=list)

    model_config = {"from_attributes": True}


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
