from datetime import datetime

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.modules.admin.models import ManualReviewCase, ManualReviewEvent, SupportTicket, SupportTicketNote
from app.modules.audit.models import AuditEvent
from app.modules.ledger.models import PaymentIntent
from app.modules.payments.models import Payment
from app.modules.receipts.models import Receipt
from app.modules.users.models import User


def list_users(db: Session, *, q: str | None, limit: int, offset: int) -> list[User]:
    query = db.query(User)
    if q:
        query = query.filter(or_(User.phone.contains(q), User.name.contains(q)))
    return query.order_by(User.id.desc()).offset(offset).limit(limit).all()


def get_user(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).one_or_none()


def list_payments(
    db: Session,
    *,
    status: str | None,
    user_id: int | None,
    correlation_id: str | None,
    provider_reference: str | None,
    limit: int,
    offset: int,
) -> list[Payment]:
    query = db.query(Payment)
    if status:
        query = query.filter(Payment.status == status.upper())
    if user_id is not None:
        query = query.filter(Payment.user_id == user_id)
    if provider_reference:
        query = query.filter(Payment.external_reference.contains(provider_reference))
    if correlation_id:
        query = query.join(PaymentIntent, PaymentIntent.payment_id == Payment.id).filter(
            PaymentIntent.correlation_id == correlation_id
        )
    return query.order_by(Payment.id.desc()).offset(offset).limit(limit).all()


def get_payment(db: Session, payment_id: int) -> Payment | None:
    return db.query(Payment).filter(Payment.id == payment_id).one_or_none()


def list_receipts(
    db: Session,
    *,
    user_id: int | None,
    payment_id: int | None,
    limit: int,
    offset: int,
) -> list[Receipt]:
    query = db.query(Receipt).join(Receipt.payment)
    if user_id is not None:
        query = query.filter(Payment.user_id == user_id)
    if payment_id is not None:
        query = query.filter(Receipt.payment_id == payment_id)
    return query.order_by(Receipt.id.desc()).offset(offset).limit(limit).all()


def get_receipt(db: Session, receipt_id: int) -> Receipt | None:
    return db.query(Receipt).filter(Receipt.id == receipt_id).one_or_none()


def list_audit_events(
    db: Session,
    *,
    event_type: str | None,
    entity_type: str | None,
    entity_id: str | None,
    actor_id: str | None,
    correlation_id: str | None,
    limit: int,
    offset: int,
) -> list[AuditEvent]:
    query = db.query(AuditEvent)
    if event_type:
        query = query.filter(AuditEvent.event_type == event_type)
    if entity_type:
        query = query.filter(AuditEvent.entity_type == entity_type)
    if entity_id:
        query = query.filter(AuditEvent.entity_id == entity_id)
    if actor_id:
        query = query.filter(AuditEvent.actor_id == actor_id)
    if correlation_id:
        query = query.filter(AuditEvent.correlation_id == correlation_id)
    return query.order_by(AuditEvent.id.desc()).offset(offset).limit(limit).all()


def create_support_ticket(db: Session, ticket: SupportTicket) -> SupportTicket:
    db.add(ticket)
    db.flush()
    return ticket


def list_support_tickets(db: Session, *, limit: int, offset: int) -> list[SupportTicket]:
    return db.query(SupportTicket).order_by(SupportTicket.id.desc()).offset(offset).limit(limit).all()


def get_support_ticket(db: Session, ticket_id: int) -> SupportTicket | None:
    return db.query(SupportTicket).filter(SupportTicket.id == ticket_id).one_or_none()


def add_support_ticket_note(db: Session, note: SupportTicketNote) -> SupportTicketNote:
    db.add(note)
    db.flush()
    return note


def create_manual_review_case(db: Session, case: ManualReviewCase) -> ManualReviewCase:
    db.add(case)
    db.flush()
    return case


def list_manual_review_cases(db: Session, *, limit: int, offset: int) -> list[ManualReviewCase]:
    return db.query(ManualReviewCase).order_by(ManualReviewCase.id.desc()).offset(offset).limit(limit).all()


def get_manual_review_case(db: Session, case_id: int) -> ManualReviewCase | None:
    return db.query(ManualReviewCase).filter(ManualReviewCase.id == case_id).one_or_none()


def add_manual_review_event(db: Session, event: ManualReviewEvent) -> ManualReviewEvent:
    db.add(event)
    db.flush()
    return event


def search_users(db: Session, q: str, limit: int) -> list[User]:
    query = db.query(User)
    if q.isdigit():
        query = query.filter(or_(User.id == int(q), User.phone.contains(q)))
    else:
        query = query.filter(or_(User.phone.contains(q), User.name.contains(q)))
    return query.order_by(User.id.desc()).limit(limit).all()


def search_payments(db: Session, q: str, limit: int) -> list[Payment]:
    query = db.query(Payment)
    if q.isdigit():
        query = query.filter(Payment.id == int(q))
    else:
        query = query.filter(Payment.external_reference.contains(q))
    return query.order_by(Payment.id.desc()).limit(limit).all()


def search_receipts(db: Session, q: str, limit: int) -> list[Receipt]:
    query = db.query(Receipt)
    if q.isdigit():
        query = query.filter(Receipt.id == int(q))
    else:
        query = query.filter(Receipt.folio.contains(q))
    return query.order_by(Receipt.id.desc()).limit(limit).all()


def search_support_tickets(db: Session, q: str, limit: int) -> list[SupportTicket]:
    query = db.query(SupportTicket)
    if q.isdigit():
        query = query.filter(SupportTicket.id == int(q))
    else:
        query = query.filter(or_(SupportTicket.correlation_id == q, SupportTicket.subject.contains(q)))
    return query.order_by(SupportTicket.id.desc()).limit(limit).all()


def search_manual_review_cases(db: Session, q: str, limit: int) -> list[ManualReviewCase]:
    query = db.query(ManualReviewCase)
    if q.isdigit():
        query = query.filter(ManualReviewCase.id == int(q))
    else:
        query = query.filter(
            or_(
                ManualReviewCase.correlation_id == q,
                ManualReviewCase.provider_reference.contains(q),
                ManualReviewCase.case_type.contains(q),
            )
        )
    return query.order_by(ManualReviewCase.id.desc()).limit(limit).all()


def search_correlated_payment_intents(db: Session, q: str, limit: int) -> list[PaymentIntent]:
    return db.query(PaymentIntent).filter(PaymentIntent.correlation_id == q).order_by(PaymentIntent.id.desc()).limit(limit).all()
