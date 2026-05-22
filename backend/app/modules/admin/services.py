from typing import Any

from fastapi import HTTPException, Request, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.request_context import get_request_context
from app.modules.admin import repository
from app.modules.admin.models import ManualReviewCase, ManualReviewEvent, SupportTicket, SupportTicketNote
from app.modules.admin.redaction import redact_sensitive_dict
from app.modules.admin.schemas import (
    AdminPaymentDetail,
    AdminReceiptDetail,
    AdminUserDetail,
    DashboardSummary,
    ManualReviewCaseCreate,
    ManualReviewCaseUpdate,
    SupportTicketCreate,
    SupportTicketNoteCreate,
    SupportTicketUpdate,
)
from app.modules.audit.services import create_audit_event
from app.modules.ledger.models import PaymentAttempt, PaymentIntent, ProviderTransaction
from app.modules.payments.models import Payment, PaymentStatus
from app.modules.receipts.models import Receipt
from app.modules.receipts.services import map_receipt_status
from app.modules.users.models import User


def dashboard_summary(db: Session) -> DashboardSummary:
    return DashboardSummary(
        users_count=db.query(func.count(User.id)).scalar() or 0,
        payments_count=db.query(func.count(Payment.id)).scalar() or 0,
        payments_succeeded_count=_payment_count(db, PaymentStatus.SUCCESS),
        payments_pending_count=_payment_count(db, PaymentStatus.PENDING),
        payments_failed_count=_payment_count(db, PaymentStatus.FAILED),
        receipts_generated_count=db.query(func.count(Receipt.id)).scalar() or 0,
        receipts_pending_count=None,
        manual_review_open_count=db.query(func.count(ManualReviewCase.id))
        .filter(ManualReviewCase.status.in_(["open", "assigned", "investigating", "waiting_provider", "waiting_user"]))
        .scalar()
        or 0,
        support_tickets_open_count=db.query(func.count(SupportTicket.id))
        .filter(SupportTicket.status.in_(["open", "pending"]))
        .scalar()
        or 0,
        card_reconciliation_status="not_implemented",
        prontipagos_reconciliation_status="not_implemented",
        note="Receipt pending count requires receipt status persistence in a later phase.",
    )


def user_detail(db: Session, user: User, role: str) -> AdminUserDetail:
    from app.modules.admin.redaction import redact_user_for_role

    data = redact_user_for_role(user, role)
    data["recent_payment_ids"] = [payment.id for payment in user.payments[-10:]]
    data["receipt_ids"] = [payment.receipt.id for payment in user.payments if payment.receipt is not None][-10:]
    return AdminUserDetail(**data)


def payment_detail(db: Session, payment: Payment, role: str) -> AdminPaymentDetail:
    from app.modules.admin.redaction import redact_payment_for_role

    data = redact_payment_for_role(payment, role)
    intent = _latest_intent(db, payment.id)
    card_tx = _latest_transaction(intent, "card_charge")
    service_tx = _latest_transaction(intent, "service_payment")
    provider_status = service_tx.provider_status if service_tx is not None else "provider_unknown"
    payment_status = _proof_payment_status(payment.status)
    receipt_status, _, _ = map_receipt_status(payment_status, provider_status)
    data.update(
        {
            "card_status": card_tx.provider_status if card_tx is not None else "not_available",
            "service_payment_status": provider_status,
            "receipt_status": receipt_status,
            "correlation_id": intent.correlation_id if intent is not None else None,
        }
    )
    return AdminPaymentDetail(**data)


def receipt_detail(db: Session, receipt: Receipt, role: str) -> AdminReceiptDetail:
    from app.modules.admin.redaction import redact_receipt_for_role

    data = redact_receipt_for_role(receipt, role)
    intent = _latest_intent(db, receipt.payment_id)
    service_tx = _latest_transaction(intent, "service_payment")
    provider_status = service_tx.provider_status if service_tx is not None else "provider_unknown"
    payment_status = _proof_payment_status(receipt.payment.status)
    receipt_status, proof_status, _ = map_receipt_status(payment_status, provider_status)
    data.update(
        {
            "proof_status": proof_status,
            "receipt_status": receipt_status,
            "correlation_id": intent.correlation_id if intent is not None else None,
        }
    )
    return AdminReceiptDetail(**data)


def create_ticket(db: Session, payload: SupportTicketCreate, actor: User) -> SupportTicket:
    ticket = SupportTicket(**payload.model_dump(), created_by=actor.id)
    return repository.create_support_ticket(db, ticket)


def update_ticket(db: Session, ticket: SupportTicket, payload: SupportTicketUpdate) -> SupportTicket:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(ticket, field, value)
    db.flush()
    return ticket


def add_ticket_note(db: Session, ticket: SupportTicket, payload: SupportTicketNoteCreate, actor: User) -> SupportTicketNote:
    return repository.add_support_ticket_note(
        db,
        SupportTicketNote(ticket_id=ticket.id, author_id=actor.id, **payload.model_dump()),
    )


def create_manual_review_case(db: Session, payload: ManualReviewCaseCreate, actor: User) -> ManualReviewCase:
    case = repository.create_manual_review_case(db, ManualReviewCase(**payload.model_dump()))
    repository.add_manual_review_event(
        db,
        ManualReviewEvent(case_id=case.id, actor_id=actor.id, event_type="created", metadata_json={}),
    )
    return case


def update_manual_review_case(
    db: Session,
    case: ManualReviewCase,
    payload: ManualReviewCaseUpdate,
    actor: User,
) -> ManualReviewCase:
    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(case, field, value)
    repository.add_manual_review_event(
        db,
        ManualReviewEvent(case_id=case.id, actor_id=actor.id, event_type="updated", metadata_json=changes),
    )
    db.flush()
    return case


def get_or_404(item: Any, detail: str):
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
    return item


def audit_admin_action(
    db: Session,
    request: Request,
    actor: User,
    *,
    event_type: str,
    permission: str,
    entity_type: str | None = None,
    entity_id: str | int | None = None,
    metadata: dict | None = None,
    correlation_id: str | None = None,
) -> None:
    context = get_request_context(request)
    create_audit_event(
        db,
        event_type=event_type,
        actor_type="ADMIN",
        actor_id=actor.id,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata=redact_sensitive_dict({"role": actor.role, "permission": permission, **(metadata or {})}),
        request_id=context.request_id,
        correlation_id=correlation_id,
        ip_address=context.ip_address,
        user_agent=context.user_agent,
    )


def _payment_count(db: Session, payment_status: PaymentStatus) -> int:
    return db.query(func.count(Payment.id)).filter(Payment.status == payment_status).scalar() or 0


def _latest_intent(db: Session, payment_id: int) -> PaymentIntent | None:
    return db.query(PaymentIntent).filter(PaymentIntent.payment_id == payment_id).order_by(PaymentIntent.id.desc()).first()


def _latest_transaction(intent: PaymentIntent | None, operation: str) -> ProviderTransaction | None:
    if intent is None:
        return None
    attempts: list[PaymentAttempt] = sorted(intent.attempts, key=lambda attempt: attempt.id, reverse=True)
    for attempt in attempts:
        if attempt.provider_operation != operation:
            continue
        if attempt.provider_transactions:
            return sorted(attempt.provider_transactions, key=lambda transaction: transaction.id, reverse=True)[0]
    return None


def _proof_payment_status(payment_status: PaymentStatus) -> str:
    if payment_status == PaymentStatus.SUCCESS:
        return "succeeded"
    if payment_status == PaymentStatus.FAILED:
        return "failed"
    if payment_status == PaymentStatus.PENDING:
        return "pending"
    if payment_status == PaymentStatus.PROCESSING:
        return "processing"
    return payment_status.value.lower()
