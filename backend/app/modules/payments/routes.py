from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.payments import repository
from app.modules.payments.schemas import PaymentCreate, PaymentRead
from app.modules.payments.services import pay_service
from app.modules.users.models import User

router = APIRouter()


@router.get("", response_model=list[PaymentRead])
def list_payments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return repository.list_for_user(db, current_user.id)


@router.post("", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
def create_payment(
    payload: PaymentCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return pay_service(db, current_user.id, payload.user_service_id, payload.idempotency_key, get_request_context(request))

