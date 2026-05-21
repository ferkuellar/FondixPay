from sqlalchemy.orm import Session

from app.modules.payments.models import Payment
from app.modules.receipts.models import Receipt


def create_receipt(db: Session, payment_id: int, folio: str, message: str) -> Receipt:
    receipt = Receipt(payment_id=payment_id, folio=folio, message=message)
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return receipt


def list_for_user(db: Session, user_id: int) -> list[Receipt]:
    return (
        db.query(Receipt)
        .join(Receipt.payment)
        .filter(Payment.user_id == user_id)
        .order_by(Receipt.id.desc())
        .all()
    )


def get_for_user(db: Session, receipt_id: int, user_id: int) -> Receipt | None:
    return (
        db.query(Receipt)
        .join(Receipt.payment)
        .filter(Receipt.id == receipt_id, Payment.user_id == user_id)
        .one_or_none()
    )
