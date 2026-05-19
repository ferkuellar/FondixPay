from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.user_services.models import UserService


def list_for_user(db: Session, user_id: int) -> list[UserService]:
    return db.query(UserService).filter(UserService.user_id == user_id).order_by(UserService.id.desc()).all()


def get_for_user(db: Session, service_id: int, user_id: int) -> UserService | None:
    return db.query(UserService).filter(UserService.id == service_id, UserService.user_id == user_id).first()


def create_for_user(
    db: Session,
    user_id: int,
    provider_id: int,
    alias: str,
    reference: str,
    amount_due: Decimal,
) -> UserService:
    service = UserService(
        user_id=user_id,
        provider_id=provider_id,
        alias=alias,
        reference=reference,
        amount_due=amount_due,
        due_date=date.today() + timedelta(days=1),
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

