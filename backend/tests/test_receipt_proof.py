from collections.abc import Callable

from fastapi.testclient import TestClient

from app.modules.audit.models import AuditEvent
from app.modules.payments.models import Payment
from app.modules.users.models import User


def test_payment_proof_requires_owner_and_exposes_safe_breakdown(
    client: TestClient,
    db_session,
    create_user: Callable[[str | None], User],
    auth_headers: Callable[[User | None], dict[str, str]],
    create_payment: Callable[[User], Payment],
) -> None:
    owner = create_user("5511111111")
    other = create_user("5522222222")
    payment = create_payment(owner)

    assert client.get(f"/payments/{payment.id}/proof").status_code == 401
    assert client.get(f"/payments/{payment.id}/proof", headers=auth_headers(other)).status_code == 404

    response = client.get(f"/payments/{payment.id}/proof", headers=auth_headers(owner))
    proof = response.json()

    assert response.status_code == 200
    assert proof["amount_minor"] > 0
    assert proof["fee_minor"] > 0
    assert proof["total_minor"] == proof["amount_minor"] + proof["fee_minor"]
    assert proof["currency"] == "MXN"
    assert proof["proof_status"] != "confirmed"
    assert "mock" in proof["disclaimer"].lower()
    assert "pan" not in str(proof).lower()
    assert "cvv" not in str(proof).lower()
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "proof.viewed").count() == 1
