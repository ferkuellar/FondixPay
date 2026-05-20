from decimal import Decimal
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.request_context import RequestContext
from app.modules.integrations.aggregator_mock.client import AggregatorMockClient
from app.modules.audit.services import create_audit_event
from app.modules.ledger import repository as ledger_repository
from app.modules.ledger.services import create_mock_attempt, get_or_create_mock_payment_intent, mark_mock_success
from app.modules.notifications.repository import create_notification
from app.modules.payments.models import Payment
from app.modules.payments import repository
from app.modules.receipts.repository import create_receipt
from app.modules.user_services.repository import get_for_user


def pay_service(
    db: Session,
    user_id: int,
    user_service_id: int,
    idempotency_key: str | None = None,
    request_context: RequestContext | None = None,
) -> Payment:
    user_service = get_for_user(db, user_service_id, user_id)
    if user_service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")

    key = idempotency_key or f"auto-{uuid4().hex}"
    context = request_context or RequestContext()
    if idempotency_key:
        existing_intent = ledger_repository.get_intent_by_idempotency(db, user_id, idempotency_key)
        if existing_intent is not None:
            create_audit_event(
                db,
                event_type="payment.duplicate_blocked",
                actor_type="USER",
                actor_id=user_id,
                entity_type="PaymentIntent",
                entity_id=existing_intent.id,
                result="blocked",
                metadata={"idempotency_key": idempotency_key, "user_service_id": user_service.id},
                request_id=context.request_id,
                correlation_id=existing_intent.correlation_id,
            )
            db.commit()
            if existing_intent.payment_id is not None:
                existing_payment = db.get(Payment, existing_intent.payment_id)
                if existing_payment is not None:
                    return existing_payment
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Pago duplicado en proceso")

    amount = Decimal(user_service.amount_due)
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay saldo pendiente")

    intent, duplicate = get_or_create_mock_payment_intent(
        db,
        user_id=user_id,
        user_service_id=user_service.id,
        amount=amount,
        idempotency_key=key,
        request_id=context.request_id,
        correlation_id=context.correlation_id,
    )
    if duplicate:
        if intent.payment_id is not None:
            existing_payment = db.get(Payment, intent.payment_id)
            if existing_payment is not None:
                return existing_payment
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Pago duplicado en proceso")

    attempt = create_mock_attempt(db, intent, request_id=context.request_id)
    payment = repository.create(db, user_id, user_service.id, amount)
    result = AggregatorMockClient().pay_service(
        provider_name=user_service.provider.name,
        reference=user_service.reference,
        amount=amount,
    )
    payment = repository.mark_success(db, payment, result.external_reference)
    intent.payment_id = payment.id
    mark_mock_success(
        db,
        intent=intent,
        attempt=attempt,
        provider_reference=result.external_reference,
        request_id=context.request_id,
    )
    receipt_data = AggregatorMockClient().generate_receipt(result.external_reference, amount)
    receipt = create_receipt(db, payment.id, receipt_data.folio, receipt_data.message)
    create_audit_event(
        db,
        event_type="receipt.generated",
        actor_type="SYSTEM",
        entity_type="Receipt",
        entity_id=receipt.id,
        result="success",
        metadata={"payment_id": payment.id, "mock": True},
        request_id=context.request_id,
        correlation_id=intent.correlation_id,
    )
    create_notification(db, user_id, f"Ya quedo pagado {user_service.alias}")
    user_service.amount_due = Decimal("0.00")
    db.commit()
    db.refresh(payment)
    return payment
