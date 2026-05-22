from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.admin import repository, services
from app.modules.admin.dependencies import require_admin_permission
from app.modules.admin.redaction import (
    redact_payment_for_role,
    redact_receipt_for_role,
    redact_sensitive_dict,
    redact_user_for_role,
)
from app.modules.admin.schemas import (
    AdminAuditEventListItem,
    AdminPaymentDetail,
    AdminPaymentListItem,
    AdminReceiptDetail,
    AdminReceiptListItem,
    AdminUserDetail,
    AdminUserListItem,
    DashboardSummary,
    ManualReviewCaseCreate,
    ManualReviewCaseRead,
    ManualReviewCaseUpdate,
    ReconciliationSummaryPlaceholder,
    SupportTicketCreate,
    SupportTicketNoteCreate,
    SupportTicketRead,
    SupportTicketUpdate,
)
from app.modules.users.models import User

router = APIRouter()


@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard(
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.dashboard.view")),
    db: Session = Depends(get_db),
) -> DashboardSummary:
    result = services.dashboard_summary(db)
    _audit(db, request, current_user, "admin.dashboard_viewed", "admin.dashboard.view")
    return result


@router.get("/users", response_model=list[AdminUserListItem])
def list_users(
    request: Request,
    q: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.users.list")),
    db: Session = Depends(get_db),
) -> list[AdminUserListItem]:
    result = [
        AdminUserListItem(**redact_user_for_role(user, current_user.role))
        for user in repository.list_users(db, q=q, limit=limit, offset=offset)
    ]
    _audit(db, request, current_user, "admin.users_list_viewed", "admin.users.list", metadata={"q_used": bool(q)})
    return result


@router.get("/users/{user_id}", response_model=AdminUserDetail)
def get_user(
    user_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.users.view")),
    db: Session = Depends(get_db),
) -> AdminUserDetail:
    user = services.get_or_404(repository.get_user(db, user_id), "Usuario no encontrado")
    result = services.user_detail(db, user, current_user.role)
    _audit(db, request, current_user, "admin.user_viewed", "admin.users.view", "User", user.id)
    return result


@router.get("/payments", response_model=list[AdminPaymentListItem])
def list_payments(
    request: Request,
    payment_status: str | None = Query(default=None, alias="status"),
    user_id: int | None = None,
    correlation_id: str | None = None,
    provider_reference: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.payments.list")),
    db: Session = Depends(get_db),
) -> list[AdminPaymentListItem]:
    payments = repository.list_payments(
        db,
        status=payment_status,
        user_id=user_id,
        correlation_id=correlation_id,
        provider_reference=provider_reference,
        limit=limit,
        offset=offset,
    )
    result = [AdminPaymentListItem(**redact_payment_for_role(payment, current_user.role)) for payment in payments]
    _audit(db, request, current_user, "admin.payments_list_viewed", "admin.payments.list")
    return result


@router.get("/payments/{payment_id}", response_model=AdminPaymentDetail)
def get_payment(
    payment_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.payments.view")),
    db: Session = Depends(get_db),
) -> AdminPaymentDetail:
    payment = services.get_or_404(repository.get_payment(db, payment_id), "Pago no encontrado")
    result = services.payment_detail(db, payment, current_user.role)
    _audit(
        db,
        request,
        current_user,
        "admin.payment_viewed",
        "admin.payments.view",
        "Payment",
        payment.id,
        correlation_id=result.correlation_id,
    )
    return result


@router.get("/receipts", response_model=list[AdminReceiptListItem])
def list_receipts(
    request: Request,
    user_id: int | None = None,
    payment_id: int | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.receipts.list")),
    db: Session = Depends(get_db),
) -> list[AdminReceiptListItem]:
    receipts = repository.list_receipts(db, user_id=user_id, payment_id=payment_id, limit=limit, offset=offset)
    result = [AdminReceiptListItem(**redact_receipt_for_role(receipt, current_user.role)) for receipt in receipts]
    _audit(db, request, current_user, "admin.receipts_list_viewed", "admin.receipts.list")
    return result


@router.get("/receipts/{receipt_id}", response_model=AdminReceiptDetail)
def get_receipt(
    receipt_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.receipts.view")),
    db: Session = Depends(get_db),
) -> AdminReceiptDetail:
    receipt = services.get_or_404(repository.get_receipt(db, receipt_id), "Recibo no encontrado")
    result = services.receipt_detail(db, receipt, current_user.role)
    _audit(
        db,
        request,
        current_user,
        "admin.receipt_viewed",
        "admin.receipts.view",
        "Receipt",
        receipt.id,
        correlation_id=result.correlation_id,
    )
    return result


@router.get("/audit-events", response_model=list[AdminAuditEventListItem])
def list_audit_events(
    request: Request,
    event_type: str | None = None,
    entity_type: str | None = None,
    entity_id: str | None = None,
    actor_id: str | None = None,
    correlation_id: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.audit.list")),
    db: Session = Depends(get_db),
) -> list[AdminAuditEventListItem]:
    events = repository.list_audit_events(
        db,
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        actor_id=actor_id,
        correlation_id=correlation_id,
        limit=limit,
        offset=offset,
    )
    result = [
        AdminAuditEventListItem(
            id=event.id,
            event_type=event.event_type,
            actor_type=event.actor_type,
            actor_id=event.actor_id,
            entity_type=event.entity_type,
            entity_id=event.entity_id,
            result=event.result,
            request_id=event.request_id,
            correlation_id=event.correlation_id,
            metadata=redact_sensitive_dict(event.metadata_json),
            created_at=event.created_at,
        )
        for event in events
    ]
    _audit(db, request, current_user, "admin.audit_events_viewed", "admin.audit.list")
    return result


@router.get("/reconciliation/card", response_model=ReconciliationSummaryPlaceholder)
def get_card_reconciliation(
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.reconciliation.card.view")),
    db: Session = Depends(get_db),
) -> ReconciliationSummaryPlaceholder:
    _audit(
        db,
        request,
        current_user,
        "admin.reconciliation_viewed",
        "admin.reconciliation.card.view",
        "Reconciliation",
        "card",
    )
    return _reconciliation_placeholder("card")


@router.get("/reconciliation/prontipagos", response_model=ReconciliationSummaryPlaceholder)
def get_prontipagos_reconciliation(
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.reconciliation.prontipagos.view")),
    db: Session = Depends(get_db),
) -> ReconciliationSummaryPlaceholder:
    _audit(
        db,
        request,
        current_user,
        "admin.reconciliation_viewed",
        "admin.reconciliation.prontipagos.view",
        "Reconciliation",
        "prontipagos",
    )
    return _reconciliation_placeholder("prontipagos")


@router.get("/manual-review", response_model=list[ManualReviewCaseRead])
def list_manual_review(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.manual_review.list")),
    db: Session = Depends(get_db),
) -> list[ManualReviewCaseRead]:
    return [
        ManualReviewCaseRead.model_validate(case, from_attributes=True)
        for case in repository.list_manual_review_cases(db, limit=limit, offset=offset)
    ]


@router.get("/manual-review/{case_id}", response_model=ManualReviewCaseRead)
def get_manual_review(
    case_id: int,
    current_user: User = Depends(require_admin_permission("admin.manual_review.view")),
    db: Session = Depends(get_db),
) -> ManualReviewCaseRead:
    case = services.get_or_404(repository.get_manual_review_case(db, case_id), "Caso no encontrado")
    return ManualReviewCaseRead.model_validate(case, from_attributes=True)


@router.post("/manual-review", response_model=ManualReviewCaseRead, status_code=status.HTTP_201_CREATED)
def create_manual_review(
    payload: ManualReviewCaseCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.manual_review.update")),
    db: Session = Depends(get_db),
) -> ManualReviewCaseRead:
    case = services.create_manual_review_case(db, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "admin.manual_review_created",
        "admin.manual_review.update",
        "ManualReviewCase",
        case.id,
        {"case_type": case.case_type},
        case.correlation_id,
    )
    return ManualReviewCaseRead.model_validate(case, from_attributes=True)


@router.patch("/manual-review/{case_id}", response_model=ManualReviewCaseRead)
def update_manual_review(
    case_id: int,
    payload: ManualReviewCaseUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.manual_review.update")),
    db: Session = Depends(get_db),
) -> ManualReviewCaseRead:
    case = services.get_or_404(repository.get_manual_review_case(db, case_id), "Caso no encontrado")
    case = services.update_manual_review_case(db, case, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "admin.manual_review_updated",
        "admin.manual_review.update",
        "ManualReviewCase",
        case.id,
        {"fields": sorted(payload.model_dump(exclude_unset=True))},
        case.correlation_id,
    )
    return ManualReviewCaseRead.model_validate(case, from_attributes=True)


@router.get("/support/tickets", response_model=list[SupportTicketRead])
def list_tickets(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.support_tickets.list")),
    db: Session = Depends(get_db),
) -> list[SupportTicketRead]:
    return [
        SupportTicketRead.model_validate(ticket, from_attributes=True)
        for ticket in repository.list_support_tickets(db, limit=limit, offset=offset)
    ]


@router.get("/support/tickets/{ticket_id}", response_model=SupportTicketRead)
def get_ticket(
    ticket_id: int,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.list")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.get_or_404(repository.get_support_ticket(db, ticket_id), "Ticket no encontrado")
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@router.post("/support/tickets", response_model=SupportTicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: SupportTicketCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.create")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.create_ticket(db, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "admin.ticket_created",
        "admin.support_tickets.create",
        "SupportTicket",
        ticket.id,
    )
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@router.patch("/support/tickets/{ticket_id}", response_model=SupportTicketRead)
def update_ticket(
    ticket_id: int,
    payload: SupportTicketUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.update")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.get_or_404(repository.get_support_ticket(db, ticket_id), "Ticket no encontrado")
    ticket = services.update_ticket(db, ticket, payload)
    _audit(
        db,
        request,
        current_user,
        "admin.ticket_updated",
        "admin.support_tickets.update",
        "SupportTicket",
        ticket.id,
        {"fields": sorted(payload.model_dump(exclude_unset=True))},
    )
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@router.post("/support/tickets/{ticket_id}/notes", response_model=SupportTicketRead)
def add_ticket_note(
    ticket_id: int,
    payload: SupportTicketNoteCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.support_tickets.update")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.get_or_404(repository.get_support_ticket(db, ticket_id), "Ticket no encontrado")
    services.add_ticket_note(db, ticket, payload, current_user)
    _audit(
        db,
        request,
        current_user,
        "admin.ticket_note_added",
        "admin.support_tickets.update",
        "SupportTicket",
        ticket.id,
        {"is_internal": payload.is_internal},
    )
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


def _audit(
    db: Session,
    request: Request,
    actor: User,
    event_type: str,
    permission: str,
    entity_type: str | None = None,
    entity_id: str | int | None = None,
    metadata: dict | None = None,
    correlation_id: str | None = None,
) -> None:
    services.audit_admin_action(
        db,
        request,
        actor,
        event_type=event_type,
        permission=permission,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata=metadata,
        correlation_id=correlation_id,
    )
    db.commit()


def _reconciliation_placeholder(provider: str) -> ReconciliationSummaryPlaceholder:
    return ReconciliationSummaryPlaceholder(
        status="not_implemented",
        provider=provider,
        message="Reconciliation is planned for a later phase.",
    )
