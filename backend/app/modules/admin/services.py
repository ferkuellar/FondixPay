from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, Request, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.request_context import get_request_context
from app.modules.admin import repository
from app.modules.admin.models import (
    DisputeCase,
    DisputeEvidence,
    FraudSignal,
    ManualReviewCase,
    ManualReviewEvent,
    SupportTicket,
    SupportTicketNote,
)
from app.modules.admin.redaction import redact_sensitive_dict
from app.modules.admin.schemas import (
    AdminSearchResponse,
    AdminSearchResult,
    AdminPaymentDetail,
    AdminReceiptDetail,
    AdminUserDetail,
    DashboardSummary,
    DisputeCaseCreate,
    DisputeCaseUpdate,
    DisputeEvidenceCreate,
    FraudSignalCreate,
    FraudSignalUpdate,
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
        .filter(SupportTicket.status.in_(["open", "pending", "new", "triaged", "assigned", "waiting_customer", "waiting_internal_review", "escalated", "reopened"]))
        .scalar()
        or 0,
        card_reconciliation_status="not_implemented",
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
    ticket = repository.create_support_ticket(db, ticket)
    if ticket.ticket_number is None:
        ticket.ticket_number = f"TK-{ticket.id:06d}"
        db.flush()
    return ticket


def update_ticket(db: Session, ticket: SupportTicket, payload: SupportTicketUpdate, actor: User) -> SupportTicket:
    changes = payload.model_dump(exclude_unset=True)
    resolution_note = changes.pop("resolution_note", None)
    if changes.get("status") in {"resolved", "closed"} and not _has_resolution_text(resolution_note):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket resolution_note is required before resolved or closed.",
        )
    for field, value in changes.items():
        setattr(ticket, field, value)
    if ticket.status == "resolved":
        ticket.resolved_at = datetime.now(timezone.utc)
        ticket.closed_at = None
    elif ticket.status == "closed":
        ticket.closed_at = datetime.now(timezone.utc)
    elif ticket.status == "reopened":
        ticket.reopened_at = datetime.now(timezone.utc)
        ticket.closed_at = None
        ticket.resolved_at = None
    elif "status" in changes:
        ticket.closed_at = None
    if _has_resolution_text(resolution_note):
        add_ticket_note(
            db,
            ticket,
            SupportTicketNoteCreate(note=f"Resolucion: {resolution_note}", is_internal=True),
            actor,
        )
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
        ManualReviewEvent(
            case_id=case.id,
            actor_id=actor.id,
            event_type="case_created",
            after_status=case.status,
            note=case.summary,
            metadata_json={},
        ),
    )
    return case


def update_manual_review_case(
    db: Session,
    case: ManualReviewCase,
    payload: ManualReviewCaseUpdate,
    actor: User,
) -> ManualReviewCase:
    changes = payload.model_dump(exclude_unset=True)
    before_status = case.status
    note = changes.pop("note", None)
    next_status = changes.get("status", case.status)
    if next_status in {"resolved", "closed"} and not _has_resolution_text(changes.get("resolution") or case.resolution):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Manual review resolution is required before resolved or closed.",
        )
    for field, value in changes.items():
        setattr(case, field, value)
    if case.status == "closed":
        case.closed_at = datetime.now(timezone.utc)
    elif "status" in changes:
        case.closed_at = None
    event_type = _manual_review_event_type(before_status, case.status, note)
    repository.add_manual_review_event(
        db,
        ManualReviewEvent(
            case_id=case.id,
            actor_id=actor.id,
            event_type=event_type,
            before_status=before_status,
            after_status=case.status,
            note=note,
            metadata_json=redact_sensitive_dict(changes),
        ),
    )
    db.flush()
    return case


def create_fraud_signal(db: Session, payload: FraudSignalCreate, actor: User) -> FraudSignal:
    signal = FraudSignal(
        **payload.model_dump(),
        created_by=actor.id,
    )
    return repository.create_fraud_signal(db, signal)


def update_fraud_signal(db: Session, signal: FraudSignal, payload: FraudSignalUpdate, actor: User) -> FraudSignal:
    if payload.status in {"reviewed", "dismissed", "escalated"} and not _has_resolution_text(payload.resolution):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fraud signal resolution is required before reviewed, dismissed, or escalated.",
        )
    signal.status = payload.status
    signal.resolution = payload.resolution
    signal.reviewed_by = actor.id
    signal.reviewed_at = datetime.now(timezone.utc)
    db.flush()
    return signal


def create_dispute_case(db: Session, payload: DisputeCaseCreate, actor: User) -> DisputeCase:
    case = DisputeCase(**payload.model_dump(), status="OPEN", created_by=actor.id, updated_by=actor.id)
    return repository.create_dispute_case(db, case)


def update_dispute_case(db: Session, case: DisputeCase, payload: DisputeCaseUpdate, actor: User) -> DisputeCase:
    before_status = case.status
    case.status = payload.status
    case.assigned_to = payload.assigned_to
    case.updated_by = actor.id
    if payload.status in {"CLOSED", "CANCELED", "WON", "LOST"}:
        case.closed_at = datetime.now(timezone.utc)
    elif before_status != payload.status:
        case.closed_at = None
    db.flush()
    return case


def add_dispute_evidence(
    db: Session,
    case: DisputeCase,
    payload: DisputeEvidenceCreate,
    actor: User,
) -> DisputeEvidence:
    evidence = DisputeEvidence(dispute_case_id=case.id, created_by=actor.id, **payload.model_dump())
    return repository.add_dispute_evidence(db, evidence)


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


def search_operational_references(db: Session, q: str, search_type: str | None, role: str) -> AdminSearchResponse:
    query = q.strip()
    limit = 10
    results: list[AdminSearchResult] = []
    if search_type in {None, "user"}:
        results.extend(
            AdminSearchResult(entity_type="user", entity_id=user.id, label=f"Usuario {user.id}", status=user.role)
            for user in repository.search_users(db, query, limit)
        )
    if search_type in {None, "payment", "provider_reference"}:
        from app.modules.admin.redaction import redact_provider_reference

        results.extend(
            AdminSearchResult(
                entity_type="payment" if search_type != "provider_reference" else "provider_reference",
                entity_id=payment.id,
                label=f"Pago {payment.id}",
                status=payment.status.value,
                provider_reference=redact_provider_reference(role, payment.external_reference),
            )
            for payment in repository.search_payments(db, query, limit)
        )
    if search_type in {None, "receipt"}:
        results.extend(
            AdminSearchResult(entity_type="receipt", entity_id=receipt.id, label=f"Recibo {receipt.id}", status=receipt.folio)
            for receipt in repository.search_receipts(db, query, limit)
        )
    if search_type in {None, "ticket"}:
        results.extend(
            AdminSearchResult(
                entity_type="ticket",
                entity_id=ticket.id,
                label=ticket.subject,
                status=ticket.status,
                correlation_id=ticket.correlation_id,
            )
            for ticket in repository.search_support_tickets(db, query, limit)
        )
    if search_type in {None, "manual_review", "correlation", "provider_reference"}:
        from app.modules.admin.redaction import redact_provider_reference

        results.extend(
            AdminSearchResult(
                entity_type="manual_review",
                entity_id=case.id,
                label=case.case_type,
                status=case.status,
                correlation_id=case.correlation_id,
                provider_reference=redact_provider_reference(role, case.provider_reference),
            )
            for case in repository.search_manual_review_cases(db, query, limit)
        )
    if search_type in {None, "correlation"}:
        results.extend(
            AdminSearchResult(
                entity_type="correlation",
                entity_id=intent.payment_id or intent.id,
                label="Payment correlation",
                status=intent.status,
                correlation_id=intent.correlation_id,
            )
            for intent in repository.search_correlated_payment_intents(db, query, limit)
        )
    return AdminSearchResponse(query=query, type=search_type, results=results[:25])


def detect_manual_review_reason(
    *,
    card_status: str | None,
    provider_status: str | None,
    receipt_status: str | None = None,
    duplicate_suspected: bool = False,
    amount_mismatch: bool = False,
) -> str | None:
    if card_status in {"succeeded", "authorized", "captured"} and provider_status in {"provider_failed", "provider_rejected"}:
        return "card_success_service_payment_failed"
    if card_status in {"succeeded", "authorized", "captured"} and provider_status == "provider_pending":
        return "card_success_service_payment_pending"
    if provider_status == "provider_timeout":
        return "service_payment_timeout"
    if receipt_status == "unavailable" and provider_status in {"provider_confirmed", "mock_confirmed"}:
        return "receipt_unavailable"
    if duplicate_suspected:
        return "duplicate_attempt"
    if amount_mismatch:
        return "amount_mismatch"
    if provider_status in {"provider_unknown", "unknown"}:
        return "provider_status_unknown"
    return None


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


def _has_resolution_text(value: str | None) -> bool:
    return bool(value and value.strip())


def _manual_review_event_type(before_status: str, after_status: str, note: str | None) -> str:
    if before_status != after_status:
        if after_status == "assigned":
            return "case_assigned"
        if after_status == "escalated":
            return "escalated"
        if after_status == "resolved":
            return "resolved"
        if after_status == "closed":
            return "closed"
        return "status_changed"
    if _has_resolution_text(note):
        return "note_added"
    return "updated"
