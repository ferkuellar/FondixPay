from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.integrations.aggregator_mock.client import AggregatorMockClient
from app.modules.notifications.repository import create_notification
from app.modules.payments import repository
from app.modules.payments.models import Payment
from app.modules.receipts.repository import create_receipt
from app.modules.user_services.repository import get_for_user


def pay_service(db: Session, user_id: int, user_service_id: int) -> Payment:
    user_service = get_for_user(db, user_service_id, user_id)
    if user_service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")

    amount = Decimal(user_service.amount_due)
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay saldo pendiente")

    payment = repository.create(db, user_id, user_service.id, amount)
    result = AggregatorMockClient().pay_service(
        provider_name=user_service.provider.name,
        reference=user_service.reference,
        amount=amount,
    )
    payment = repository.mark_success(db, payment, result.external_reference)
    receipt_data = AggregatorMockClient().generate_receipt(result.external_reference, amount)
    create_receipt(db, payment.id, receipt_data.folio, receipt_data.message)
    create_notification(db, user_id, f"Ya quedo pagado {user_service.alias}")
    user_service.amount_due = Decimal("0.00")
    db.commit()
    db.refresh(payment)
    return payment

