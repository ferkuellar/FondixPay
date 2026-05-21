from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.payments.models import Payment, PaymentStatus


def create(db: Session, user_id: int, user_service_id: int, amount: Decimal) -> Payment:
    payment = Payment(user_id=user_id, user_service_id=user_service_id, amount=amount, status=PaymentStatus.CREATED)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def list_for_user(db: Session, user_id: int) -> list[Payment]:
    return db.query(Payment).filter(Payment.user_id == user_id).order_by(Payment.id.desc()).all()


def mark_success(db: Session, payment: Payment, external_reference: str) -> Payment:
    payment.status = PaymentStatus.SUCCESS
    payment.external_reference = external_reference
    payment.paid_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(payment)
    return payment


def mark_status(db: Session, payment: Payment, status: PaymentStatus) -> Payment:
    payment.status = status
    db.flush()
    return payment

