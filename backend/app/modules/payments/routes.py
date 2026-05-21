from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.payments import repository
from app.modules.payments.schemas import PaymentCreate, PaymentRead, SandboxPaymentCreate, SandboxPaymentRead
from app.modules.payments.orchestrator import process_sandbox_payment
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


@router.post("/sandbox", response_model=SandboxPaymentRead, status_code=status.HTTP_201_CREATED)
def create_sandbox_payment(
    payload: SandboxPaymentCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SandboxPaymentRead:
    result = process_sandbox_payment(
        db,
        user_id=current_user.id,
        user_service_id=payload.user_service_id,
        mock_card_token=payload.mock_card_token,
        idempotency_key=payload.idempotency_key,
        card_scenario=payload.card_scenario,
        prontipagos_scenario=payload.prontipagos_scenario,
        request_context=get_request_context(request),
    )
    return SandboxPaymentRead(
        payment_id=result.payment.id,
        status=result.status,
        card_status=result.card_status,
        service_payment_status=result.service_payment_status,
        receipt_status=result.receipt_status,
        amount_minor=result.intent.amount_minor,
        fee_minor=result.intent.fee_minor,
        total_minor=result.intent.total_minor,
        currency=result.intent.currency,
        is_mock=True,
        is_sandbox=True,
        provider_reference=result.provider_reference,
        card_reference=result.card_reference,
        correlation_id=result.intent.correlation_id,
        message=result.message,
    )

