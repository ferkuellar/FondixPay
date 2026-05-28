from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent
from app.modules.chatbot.models import ChatbotConversation


def test_public_payment_concern_is_classified_for_human_review(
    client: TestClient,
    db_session: Session,
) -> None:
    response = client.post(
        "/api/public/chat",
        json={
            "message": "Mi pago no se aplico y perdi dinero",
            "sessionId": "chatops-session-1",
            "source": "landing",
        },
    )

    assert response.status_code == 200
    conversation = db_session.query(ChatbotConversation).one()
    assert conversation.detected_intent == "payment_concern"
    assert conversation.severity == "SEV-2"
    assert conversation.escalation_status == "ticket_required"
    assert conversation.status == "escalated"


def test_admin_can_create_ticket_from_chat_conversation(
    client: TestClient,
    create_user,
    auth_headers,
    db_session: Session,
) -> None:
    admin = create_user(role="ADMIN")
    conversation = ChatbotConversation(
        session_id="chatops-ticket",
        source="landing",
        status="escalated",
        detected_intent="receipt_issue",
        severity="SEV-2",
        escalation_status="ticket_required",
        classification_reason="receipt or proof-of-payment issue",
    )
    db_session.add(conversation)
    db_session.commit()

    response = client.post(
        f"/admin/chat/operations/conversations/{conversation.id}/ticket",
        headers=auth_headers(admin),
        json={"summary": "Usuario reporto recibo faltante."},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["source"] == "chatbot"
    assert body["severity"] == "SEV-2"
    assert body["status"] == "escalated"
    db_session.refresh(conversation)
    assert conversation.linked_ticket_id == body["id"]
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "ticket.created").count() == 1


def test_support_cannot_downgrade_sev1_without_manager_approval(
    client: TestClient,
    create_user,
    auth_headers,
    db_session: Session,
) -> None:
    support = create_user(role="SUPPORT")
    conversation = ChatbotConversation(
        session_id="chatops-sev1",
        source="landing",
        status="escalated",
        detected_intent="fraud_concern",
        severity="SEV-1",
        escalation_status="human_queue",
    )
    db_session.add(conversation)
    db_session.commit()

    response = client.post(
        f"/admin/chat/operations/conversations/{conversation.id}/severity",
        headers=auth_headers(support),
        json={"severity": "SEV-3", "note": "Intento de bajar severidad"},
    )

    assert response.status_code == 403
