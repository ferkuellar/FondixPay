from dataclasses import dataclass
from decimal import Decimal
from hashlib import sha256
from typing import Literal
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.request_context import RequestContext
from app.modules.audit.services import create_audit_event
from app.modules.ledger import repository as ledger_repository
from app.modules.ledger.models import LedgerDirection, PaymentAttempt, PaymentIntent, ProviderTransaction
from app.modules.ledger.services import (
    get_or_create_mock_payment_intent,
    transition_attempt,
    transition_intent,
)
from app.modules.ledger.state_machine import PaymentAttemptStatus, PaymentIntentStatus
from app.modules.notifications.repository import create_notification
from app.modules.payments import repository as payment_repository
from app.modules.payments.fees import calculate_fee_minor
from app.modules.payments.models import Payment, PaymentStatus
from app.modules.providers.card_processor.adapter import CardProcessorSandboxAdapter
from app.modules.providers.card_processor.schemas import CardChargeRequest, CardMockScenario
from app.modules.receipts.repository import create_receipt
from app.modules.user_services.repository import get_for_user

ServiceMockScenario = Literal["success", "pending", "invalid_reference", "amount_mismatch", "timeout", "provider_unavailable", "duplicate_blocked", "failed"]

_SERVICE_MOCK_STATUS_MAP = {
    "success":              ("provider_confirmed",        None,                   None),
    "pending":              ("provider_pending",          None,                   "Pago pendiente de confirmacion."),
    "invalid_reference":    ("provider_rejected",         "invalid_reference",    "La referencia del servicio no es valida."),
    "amount_mismatch":      ("provider_failed",           "amount_mismatch",      "El monto no coincide con el esperado por el proveedor."),
    "timeout":              ("provider_timeout",          "provider_timeout",     "El proveedor no respondio a tiempo."),
    "provider_unavailable": ("provider_failed",           "provider_unavailable", "El proveedor no esta disponible temporalmente."),
    "duplicate_blocked":    ("provider_duplicate_blocked","duplicate_transaction","Transaccion duplicada bloqueada por el proveedor."),
    "failed":               ("provider_failed",           "provider_failed",      "El proveedor rechazo el pago."),
}


@dataclass(frozen=True)
class _ServiceMockResponse:
    provider_name: str
    provider_reference: str | None
    status: str
    amount_minor: int
    currency: str
    receipt_reference: str | None
    error_code: str | None
    error_message_safe: str | None
    raw_response_hash: str | None


def _mock_service_payment(
    scenario: ServiceMockScenario,
    *,
    payment_intent_id: int,
    amount_minor: int,
    currency: str,
    idempotency_key: str,
) -> _ServiceMockResponse:
    status_str, error_code, error_message = _SERVICE_MOCK_STATUS_MAP[scenario]
    confirmed = status_str == "provider_confirmed"
    raw = sha256(f"{payment_intent_id}:{idempotency_key}:{status_str}".encode()).hexdigest()
    return _ServiceMockResponse(
        provider_name="service_mock",
        provider_reference=f"svc_mock_{uuid4().hex[:16]}" if confirmed else None,
        status=status_str,
        amount_minor=amount_minor,
        currency=currency,
        receipt_reference=f"folio_{uuid4().hex[:12]}" if confirmed else None,
        error_code=error_code,
        error_message_safe=error_message,
        raw_response_hash=raw,
    )


@dataclass(frozen=True)
class SandboxPaymentResult:
    payment: Payment
    intent: PaymentIntent
    status: str
    card_status: str
    service_payment_status: str
    receipt_status: str
    provider_reference: str | None
    card_reference: str | None
    message: str


def _create_attempt(db: Session, intent: PaymentIntent, provider_name: str, operation: str) -> PaymentAttempt:
    return ledger_repository.create_payment_attempt(
        db,
        payment_intent_id=intent.id,
        provider_name=provider_name,
        provider_operation=operation,
    )


def _provider_transaction(
    db: Session,
    attempt: PaymentAttempt,
    *,
    provider_name: str,
    provider_reference: str | None,
    provider_status: str,
    amount_minor: int,
    raw_response_hash: str | None,
) -> ProviderTransaction:
    return ledger_repository.create_provider_transaction(
        db,
        payment_attempt_id=attempt.id,
        provider_name=provider_name,
        provider_reference=provider_reference,
        provider_status=provider_status,
        amount_minor=amount_minor,
        raw_response_hash=raw_response_hash,
    )


def _latest_attempt(intent: PaymentIntent, operation: str) -> PaymentAttempt | None:
    for attempt in sorted(intent.attempts, key=lambda item: item.id, reverse=True):
        if attempt.provider_operation == operation:
            return attempt
    return None


def _latest_transaction(attempt: PaymentAttempt | None) -> ProviderTransaction | None:
    if attempt is None or not attempt.provider_transactions:
        return None
    return sorted(attempt.provider_transactions, key=lambda item: item.id, reverse=True)[0]


def _receipt_status(payment: Payment) -> str:
    return "generated" if payment.receipt is not None else "pending"


def _duplicate_result(db: Session, intent: PaymentIntent) -> SandboxPaymentResult:
    if intent.payment_id is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Pago sandbox duplicado en proceso")
    payment = db.get(Payment, intent.payment_id)
    if payment is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Pago sandbox duplicado en proceso")
    card_attempt = _latest_attempt(intent, "card_charge")
    service_attempt = _latest_attempt(intent, "service_payment")
    card_tx = _latest_transaction(card_attempt)
    service_tx = _latest_transaction(service_attempt)
    return SandboxPaymentResult(
        payment=payment,
        intent=intent,
        status="duplicate_blocked" if payment.status != PaymentStatus.SUCCESS else "succeeded",
        card_status=card_tx.provider_status if card_tx is not None else (card_attempt.error_code or "not_submitted"),
        service_payment_status=(
            service_tx.provider_status
            if service_tx is not None
            else (service_attempt.error_code if service_attempt is not None else "not_started")
        ),
        receipt_status=_receipt_status(payment),
        provider_reference=service_tx.provider_reference if service_tx is not None else None,
        card_reference=card_tx.provider_reference if card_tx is not None else None,
        message="Se reutilizo el resultado sandbox existente para esta idempotency key.",
    )


def _mark_manual_review(
    db: Session,
    *,
    intent: PaymentIntent,
    payment: Payment,
    context: RequestContext,
    event_type: str,
    metadata: dict,
) -> None:
    create_audit_event(
        db,
        event_type=event_type,
        actor_type="SYSTEM",
        entity_type="PaymentIntent",
        entity_id=intent.id,
        result="pending",
        metadata=metadata,
        request_id=context.request_id,
        correlation_id=intent.correlation_id,
    )
    create_audit_event(
        db,
        event_type="payment.manual_review_required",
        actor_type="SYSTEM",
        entity_type="Payment",
        entity_id=payment.id,
        result="pending",
        metadata=metadata,
        request_id=context.request_id,
        correlation_id=intent.correlation_id,
    )


def process_sandbox_payment(
    db: Session,
    *,
    user_id: int,
    user_service_id: int,
    mock_card_token: str,
    idempotency_key: str,
    card_scenario: CardMockScenario = "success",
    service_scenario: ServiceMockScenario = "success",
    request_context: RequestContext | None = None,
    card_processor: CardProcessorSandboxAdapter | None = None,
) -> SandboxPaymentResult:
    context = request_context or RequestContext()
    user_service = get_for_user(db, user_service_id, user_id)
    if user_service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
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
            metadata={"idempotency_key": idempotency_key, "user_service_id": user_service.id, "sandbox": True},
            request_id=context.request_id,
            correlation_id=existing_intent.correlation_id,
        )
        db.commit()
        return _duplicate_result(db, existing_intent)
    amount = Decimal(user_service.amount_due)
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay saldo pendiente")

    intent, duplicate = get_or_create_mock_payment_intent(
        db,
        user_id=user_id,
        user_service_id=user_service.id,
        amount=amount,
        fee_minor=calculate_fee_minor(),
        idempotency_key=idempotency_key,
        request_id=context.request_id,
        correlation_id=context.correlation_id,
    )
    if duplicate:
        db.commit()
        return _duplicate_result(db, intent)

    payment = payment_repository.create(db, user_id, user_service.id, amount)
    intent.payment_id = payment.id
    transition_intent(intent, PaymentIntentStatus.PROCESSING)
    card_attempt = _create_attempt(db, intent, "card_processor_mock", "card_charge")
    transition_attempt(card_attempt, PaymentAttemptStatus.SUBMITTED_TO_PROVIDER)
    create_audit_event(
        db,
        event_type="card.charge_submitted",
        actor_type="SYSTEM",
        entity_type="PaymentAttempt",
        entity_id=card_attempt.id,
        result="success",
        metadata={"sandbox": True, "provider_name": "card_processor_mock"},
        request_id=context.request_id,
        correlation_id=intent.correlation_id,
    )
    card_adapter = card_processor or CardProcessorSandboxAdapter()
    card_response = card_adapter.charge_card(
        CardChargeRequest(
            payment_intent_id=intent.id,
            amount_minor=intent.total_minor,
            currency=intent.currency,
            card_payment_method_token=mock_card_token,
            idempotency_key=f"{idempotency_key}:card_charge",
            correlation_id=intent.correlation_id,
            scenario=card_scenario,
        )
    )
    _provider_transaction(
        db,
        card_attempt,
        provider_name=card_response.provider_name,
        provider_reference=card_response.provider_transaction_id,
        provider_status=card_response.status,
        amount_minor=card_response.amount_minor,
        raw_response_hash=card_response.raw_response_hash,
    )
    card_attempt.provider_reference = card_response.provider_transaction_id
    card_attempt.error_code = card_response.error_code
    card_attempt.error_message_safe = card_response.error_message_safe

    if card_response.status != "succeeded":
        if card_response.status == "declined":
            transition_attempt(card_attempt, PaymentAttemptStatus.REJECTED_BY_PROVIDER)
            transition_attempt(card_attempt, PaymentAttemptStatus.FAILED)
            transition_intent(intent, PaymentIntentStatus.FAILED)
            payment_repository.mark_status(db, payment, PaymentStatus.FAILED)
            event_type = "card.charge_declined"
            overall_status = "failed"
            result = "failure"
        elif card_response.status == "timeout":
            transition_attempt(card_attempt, PaymentAttemptStatus.TIMEOUT)
            transition_intent(intent, PaymentIntentStatus.PROVIDER_PENDING)
            payment_repository.mark_status(db, payment, PaymentStatus.PENDING)
            event_type = "card.charge_timeout"
            overall_status = "manual_review_required"
            result = "pending"
        elif card_response.status == "duplicate_blocked":
            transition_attempt(card_attempt, PaymentAttemptStatus.REJECTED_BY_PROVIDER)
            transition_attempt(card_attempt, PaymentAttemptStatus.FAILED)
            transition_intent(intent, PaymentIntentStatus.FAILED)
            payment_repository.mark_status(db, payment, PaymentStatus.FAILED)
            event_type = "card.charge_duplicate_blocked"
            overall_status = "duplicate_blocked"
            result = "blocked"
        else:
            transition_attempt(card_attempt, PaymentAttemptStatus.ACCEPTED_BY_PROVIDER)
            transition_attempt(card_attempt, PaymentAttemptStatus.FAILED)
            if card_response.status == "pending" or card_response.status == "auth_required_future":
                transition_intent(intent, PaymentIntentStatus.PROVIDER_PENDING)
                payment_repository.mark_status(db, payment, PaymentStatus.PENDING)
                overall_status = "manual_review_required"
                result = "pending"
            else:
                transition_intent(intent, PaymentIntentStatus.FAILED)
                payment_repository.mark_status(db, payment, PaymentStatus.FAILED)
                overall_status = "failed"
                result = "failure"
            event_type = "card.charge_failed"

        create_audit_event(
            db,
            event_type=event_type,
            actor_type="SYSTEM",
            entity_type="PaymentAttempt",
            entity_id=card_attempt.id,
            result=result,
            metadata={"sandbox": True, "card_status": card_response.status, "error_code": card_response.error_code},
            request_id=context.request_id,
            correlation_id=intent.correlation_id,
        )
        receipt_event = "receipt.pending" if overall_status == "manual_review_required" else "receipt.unavailable"
        create_audit_event(
            db,
            event_type=receipt_event,
            actor_type="SYSTEM",
            entity_type="Payment",
            entity_id=payment.id,
            result="pending" if receipt_event == "receipt.pending" else "failure",
            metadata={"sandbox": True, "card_status": card_response.status},
            request_id=context.request_id,
            correlation_id=intent.correlation_id,
        )
        create_notification(
            db,
            user_id,
            (
                f"Comprobante pendiente para {user_service.alias}"
                if overall_status == "manual_review_required"
                else f"No se genero comprobante confirmado para {user_service.alias}"
            ),
            notification_type="payment.timeout" if card_response.status == "timeout" else "payment.failed",
            title="Pago sandbox en revision" if overall_status == "manual_review_required" else "Pago sandbox no completado",
            entity_type="Payment",
            entity_id=payment.id,
            correlation_id=intent.correlation_id,
        )
        db.commit()
        db.refresh(payment)
        return SandboxPaymentResult(
            payment=payment,
            intent=intent,
            status=overall_status,
            card_status=card_response.status,
            service_payment_status="not_started",
            receipt_status="pending",
            provider_reference=None,
            card_reference=card_response.provider_transaction_id,
            message=card_response.error_message_safe or "El cargo sandbox no se completo.",
        )

    transition_attempt(card_attempt, PaymentAttemptStatus.ACCEPTED_BY_PROVIDER)
    transition_attempt(card_attempt, PaymentAttemptStatus.SUCCEEDED)
    create_audit_event(
        db,
        event_type="card.charge_authorized",
        actor_type="SYSTEM",
        entity_type="PaymentAttempt",
        entity_id=card_attempt.id,
        result="success",
        metadata={"sandbox": True, "card_status": card_response.status},
        request_id=context.request_id,
        correlation_id=intent.correlation_id,
    )

    service_attempt = _create_attempt(db, intent, "service_mock", "service_payment")
    transition_attempt(service_attempt, PaymentAttemptStatus.SUBMITTED_TO_PROVIDER)
    create_audit_event(
        db,
        event_type="service_payment.submitted",
        actor_type="SYSTEM",
        entity_type="PaymentAttempt",
        entity_id=service_attempt.id,
        result="success",
        metadata={"sandbox": True, "provider_name": "service_mock"},
        request_id=context.request_id,
        correlation_id=intent.correlation_id,
    )
    service_response = _mock_service_payment(
        service_scenario,
        payment_intent_id=intent.id,
        amount_minor=intent.amount_minor,
        currency=intent.currency,
        idempotency_key=f"{idempotency_key}:service_payment",
    )
    _provider_transaction(
        db,
        service_attempt,
        provider_name=service_response.provider_name,
        provider_reference=service_response.provider_reference,
        provider_status=service_response.status,
        amount_minor=service_response.amount_minor,
        raw_response_hash=service_response.raw_response_hash,
    )
    service_attempt.provider_reference = service_response.provider_reference
    service_attempt.error_code = service_response.error_code
    service_attempt.error_message_safe = service_response.error_message_safe

    if service_response.status == "provider_confirmed":
        transition_attempt(service_attempt, PaymentAttemptStatus.ACCEPTED_BY_PROVIDER)
        transition_attempt(service_attempt, PaymentAttemptStatus.SUCCEEDED)
        transition_intent(intent, PaymentIntentStatus.PROVIDER_PENDING)
        transition_intent(intent, PaymentIntentStatus.PROVIDER_CONFIRMED)
        transition_intent(intent, PaymentIntentStatus.SUCCEEDED)
        payment = payment_repository.mark_success(db, payment, service_response.provider_reference or "svc_mock_confirmed")
        account = ledger_repository.get_or_create_account(
            db,
            owner_type="SYSTEM",
            owner_id=None,
            account_type="SANDBOX_PAYMENT_TRACE",
        )
        ledger_repository.create_ledger_entry(
            db,
            ledger_account_id=account.id,
            payment_intent_id=intent.id,
            direction=LedgerDirection.DEBIT,
            amount_minor=intent.total_minor,
            entry_type="sandbox_payment_trace",
            correlation_id=intent.correlation_id,
            description="Sandbox payment trace entry; not real money movement",
            created_by="system",
        )
        receipt = create_receipt(
            db,
            payment.id,
            service_response.receipt_reference or f"folio_sandbox_{payment.id}",
            "Pago sandbox confirmado por mock contractual",
        )
        create_audit_event(
            db,
            event_type="service_payment.succeeded",
            actor_type="SYSTEM",
            entity_type="PaymentAttempt",
            entity_id=service_attempt.id,
            result="success",
            metadata={"sandbox": True, "provider_reference": service_response.provider_reference},
            request_id=context.request_id,
            correlation_id=intent.correlation_id,
        )
        create_audit_event(
            db,
            event_type="receipt.generated",
            actor_type="SYSTEM",
            entity_type="Receipt",
            entity_id=receipt.id,
            result="success",
            metadata={"sandbox": True, "payment_id": payment.id},
            request_id=context.request_id,
            correlation_id=intent.correlation_id,
        )
        create_notification(
            db,
            user_id,
            f"Pago sandbox confirmado para {user_service.alias}",
            notification_type="payment.succeeded",
            title="Comprobante sandbox disponible",
            entity_type="Payment",
            entity_id=payment.id,
            correlation_id=intent.correlation_id,
        )
        user_service.amount_due = Decimal("0.00")
        db.commit()
        db.refresh(payment)
        return SandboxPaymentResult(
            payment=payment,
            intent=intent,
            status="succeeded",
            card_status=card_response.status,
            service_payment_status=service_response.status,
            receipt_status="generated",
            provider_reference=service_response.provider_reference,
            card_reference=card_response.provider_transaction_id,
            message="Pago sandbox confirmado por mocks contractuales.",
        )

    if service_response.status == "provider_timeout":
        transition_attempt(service_attempt, PaymentAttemptStatus.TIMEOUT)
        transition_intent(intent, PaymentIntentStatus.PROVIDER_PENDING)
        payment_repository.mark_status(db, payment, PaymentStatus.PENDING)
        audit_event = "service_payment.timeout"
        payment_status = "manual_review_required"
        audit_result = "pending"
    elif service_response.status == "provider_pending":
        transition_attempt(service_attempt, PaymentAttemptStatus.ACCEPTED_BY_PROVIDER)
        transition_intent(intent, PaymentIntentStatus.PROVIDER_PENDING)
        payment_repository.mark_status(db, payment, PaymentStatus.PENDING)
        audit_event = "service_payment.pending"
        payment_status = "manual_review_required"
        audit_result = "pending"
    else:
        transition_attempt(service_attempt, PaymentAttemptStatus.REJECTED_BY_PROVIDER)
        transition_attempt(service_attempt, PaymentAttemptStatus.FAILED)
        transition_intent(intent, PaymentIntentStatus.FAILED)
        payment_repository.mark_status(db, payment, PaymentStatus.FAILED)
        audit_event = (
            "service_payment.duplicate_blocked"
            if service_response.status == "provider_duplicate_blocked"
            else "service_payment.failed"
        )
        payment_status = "manual_review_required"
        audit_result = "blocked" if service_response.status == "provider_duplicate_blocked" else "failure"

    _mark_manual_review(
        db,
        intent=intent,
        payment=payment,
        context=context,
        event_type=audit_event,
        metadata={
            "sandbox": True,
            "service_payment_status": service_response.status,
            "error_code": service_response.error_code,
        },
    )
    create_audit_event(
        db,
        event_type="receipt.pending" if payment.status == PaymentStatus.PENDING else "receipt.unavailable",
        actor_type="SYSTEM",
        entity_type="Payment",
        entity_id=payment.id,
        result="pending" if payment.status == PaymentStatus.PENDING else "failure",
        metadata={"sandbox": True, "service_payment_status": service_response.status},
        request_id=context.request_id,
        correlation_id=intent.correlation_id,
    )
    if payment.status == PaymentStatus.PENDING:
        notification_type = "payment.timeout" if service_response.status == "provider_timeout" else "payment.pending"
        notification_title = "Pago sandbox pendiente"
        notification_message = f"Comprobante pendiente para {user_service.alias}"
    else:
        notification_type = "receipt.unavailable"
        notification_title = "Comprobante no disponible"
        notification_message = f"No se genero comprobante confirmado para {user_service.alias}"
    create_notification(
        db,
        user_id,
        notification_message,
        notification_type=notification_type,
        title=notification_title,
        entity_type="Payment",
        entity_id=payment.id,
        correlation_id=intent.correlation_id,
    )
    db.commit()
    db.refresh(payment)
    return SandboxPaymentResult(
        payment=payment,
        intent=intent,
        status=payment_status,
        card_status=card_response.status,
        service_payment_status=service_response.status,
        receipt_status="pending",
        provider_reference=service_response.provider_reference,
        card_reference=card_response.provider_transaction_id,
        message=service_response.error_message_safe or "El pago sandbox requiere revision.",
    )
