from app.modules.receipts.services import can_generate_confirmed_receipt, map_receipt_status


def test_confirmed_receipt_requires_succeeded_payment_and_confirmed_provider() -> None:
    assert can_generate_confirmed_receipt("succeeded", "provider_confirmed")
    assert not can_generate_confirmed_receipt("pending", "provider_confirmed")
    assert not can_generate_confirmed_receipt("succeeded", "provider_pending")


def test_pending_timeout_and_failed_states_never_map_to_confirmed() -> None:
    assert map_receipt_status("pending", "provider_pending")[:2] == ("pending", "pending")
    assert map_receipt_status("pending", "provider_timeout")[:2] == ("pending", "pending")
    assert map_receipt_status("failed", "provider_failed")[:2] == ("unavailable", "unavailable")
    assert map_receipt_status("failed", "provider_unknown")[:2] == ("unavailable", "unavailable")
