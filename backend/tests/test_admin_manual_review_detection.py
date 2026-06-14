from app.modules.admin.services import detect_manual_review_reason


def test_detect_manual_review_reason_for_card_success_service_payment_failure() -> None:
    reason = detect_manual_review_reason(card_status="succeeded", provider_status="provider_failed")

    assert reason == "card_success_service_payment_failed"


def test_detect_manual_review_reason_for_receipt_unavailable() -> None:
    reason = detect_manual_review_reason(
        card_status="succeeded",
        provider_status="provider_confirmed",
        receipt_status="unavailable",
    )

    assert reason == "receipt_unavailable"


def test_detect_manual_review_reason_for_amount_mismatch() -> None:
    reason = detect_manual_review_reason(card_status="succeeded", provider_status="provider_confirmed", amount_mismatch=True)

    assert reason == "amount_mismatch"
