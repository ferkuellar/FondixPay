from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.ledger.models import PaymentAttempt, PaymentIntent, ProviderTransaction
from app.modules.payments.models import Payment, PaymentStatus
from app.modules.receipts.models import Receipt
from app.modules.receipts.schemas import ReceiptProofRead

CONFIRMED_PROVIDER_STATUSES = {"provider_confirmed", "mock_succeeded"}
PENDING_PROVIDER_STATUSES = {
    "provider_pending",
    "provider_timeout",
    "provider_unknown",
    "pending",
    "timeout",
    "not_started",
}
FAILED_PROVIDER_STATUSES = {"provider_failed", "provider_rejected", "provider_duplicate_blocked", "failed", "declined"}


def can_generate_confirmed_receipt(payment_status: str, provider_status: str) -> bool:
    return payment_status == "succeeded" and provider_status in CONFIRMED_PROVIDER_STATUSES


def map_receipt_status(payment_status: str, provider_status: str) -> tuple[str, str, str | None]:
    if can_generate_confirmed_receipt(payment_status, provider_status):
        return "generated", "confirmed", None
    if payment_status == "failed" or provider_status in FAILED_PROVIDER_STATUSES:
        return "unavailable", "unavailable", "payment_not_confirmed"
    if payment_status in {"pending", "timeout", "processing"} or provider_status in PENDING_PROVIDER_STATUSES:
        return "pending", "pending", "provider_confirmation_pending"
    return "pending", "review", "provider_state_unknown"


def build_receipt_proof(db: Session, receipt_id: int, user_id: int) -> ReceiptProofRead:
    receipt = _receipt_for_user(db, receipt_id, user_id)
    return _build_proof(db, receipt.payment, receipt)


def build_payment_proof(db: Session, payment_id: int, user_id: int) -> ReceiptProofRead:
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id, Payment.user_id == user_id)
        .one_or_none()
    )
    if payment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pago no encontrado")
    return _build_proof(db, payment, payment.receipt)


def _receipt_for_user(db: Session, receipt_id: int, user_id: int) -> Receipt:
    receipt = (
        db.query(Receipt)
        .join(Receipt.payment)
        .filter(Receipt.id == receipt_id, Payment.user_id == user_id)
        .one_or_none()
    )
    if receipt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comprobante no encontrado")
    return receipt


def _build_proof(db: Session, payment: Payment, receipt: Receipt | None) -> ReceiptProofRead:
    intent = _intent_for_payment(db, payment.id)
    provider_tx = _latest_service_transaction(intent)
    provider_status = provider_tx.provider_status if provider_tx is not None else "provider_unknown"
    payment_status = _payment_status(payment)
    receipt_status, proof_status, unavailable_reason = map_receipt_status(payment_status, provider_status)
    if receipt is None and receipt_status == "generated":
        receipt_status, proof_status, unavailable_reason = "unavailable", "unavailable", "receipt_missing"

    user_service = payment.user_service
    provider_reference = provider_tx.provider_reference if provider_tx is not None else payment.external_reference
    issued_at = receipt.created_at if receipt is not None else payment.created_at
    is_sandbox = bool(intent and any(attempt.provider_name == "card_processor_mock" for attempt in intent.attempts))
    internal_reference = receipt.folio if receipt is not None else f"payment-{payment.id}"
    confirmed_at = payment.paid_at if proof_status == "confirmed" else None
    return ReceiptProofRead(
        id=f"proof-payment-{payment.id}",
        payment_id=payment.id,
        receipt_id=receipt.id if receipt is not None else None,
        service_name=user_service.alias,
        service_provider_name=user_service.provider.display_name,
        service_reference_masked=_mask_reference(user_service.reference),
        amount_minor=intent.amount_minor if intent is not None else payment.amount_minor,
        fee_minor=intent.fee_minor if intent is not None else payment.fee_minor,
        total_minor=intent.total_minor if intent is not None else payment.total_minor,
        currency=intent.currency if intent is not None else payment.currency,
        payment_status=payment_status,
        provider_status=provider_status,
        receipt_status=receipt_status,
        proof_status=proof_status,
        card_label_safe="Tarjeta demo sandbox" if is_sandbox else "Metodo mock/dev",
        card_last4=None,
        provider_reference=provider_reference,
        internal_reference=internal_reference,
        correlation_id=intent.correlation_id if intent is not None else None,
        is_mock=True,
        is_sandbox=is_sandbox,
        issued_at=issued_at,
        confirmed_at=confirmed_at,
        unavailable_reason=unavailable_reason,
        disclaimer=(
            "Comprobante mock/sandbox. No es comprobante fiscal ni confirmacion productiva."
            if is_sandbox
            else "Comprobante mock/dev. No es comprobante fiscal ni confirmacion productiva."
        ),
    )


def _intent_for_payment(db: Session, payment_id: int) -> PaymentIntent | None:
    return (
        db.query(PaymentIntent)
        .filter(PaymentIntent.payment_id == payment_id)
        .order_by(PaymentIntent.id.desc())
        .first()
    )


def _latest_service_transaction(intent: PaymentIntent | None) -> ProviderTransaction | None:
    if intent is None:
        return None
    attempts: list[PaymentAttempt] = sorted(intent.attempts, key=lambda attempt: attempt.id, reverse=True)
    for attempt in attempts:
        if attempt.provider_operation not in {"service_payment", "mock_payment"}:
            continue
        if attempt.provider_transactions:
            return sorted(attempt.provider_transactions, key=lambda transaction: transaction.id, reverse=True)[0]
    return None


def _payment_status(payment: Payment) -> str:
    if payment.status == PaymentStatus.SUCCESS:
        return "succeeded"
    if payment.status == PaymentStatus.FAILED:
        return "failed"
    if payment.status == PaymentStatus.PENDING:
        return "pending"
    if payment.status == PaymentStatus.PROCESSING:
        return "processing"
    return payment.status.value.lower()


def _mask_reference(reference: str) -> str:
    if len(reference) <= 4:
        return "*" * len(reference)
    visible = reference[-4:]
    return f"{'*' * min(len(reference) - 4, 8)}{visible}"
