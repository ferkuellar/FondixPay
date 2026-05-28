from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent
from app.modules.chatbot.models import ChatbotFallback, ChatbotFaq, ChatbotMessage
from app.modules.chatbot.services import PRIVATE_ROUTING_REPLY, SAFE_FALLBACK_REPLY, normalize_text


def test_public_chat_rejects_empty_message(client: TestClient) -> None:
    response = client.post(
        "/api/public/chat",
        json={"message": "   ", "sessionId": "landing-test", "source": "landing"},
    )

    assert response.status_code == 400


def test_public_chat_rejects_oversized_message(client: TestClient) -> None:
    response = client.post(
        "/api/public/chat",
        json={"message": "x" * 501, "sessionId": "landing-test", "source": "landing"},
    )

    assert response.status_code == 422


def test_public_chat_returns_safe_fallback_and_stores_review_event(
    client: TestClient,
    db_session: Session,
) -> None:
    response = client.post(
        "/api/public/chat",
        json={"message": "Pregunta rara sin cobertura", "sessionId": "landing-test", "source": "landing"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["reply"] == SAFE_FALLBACK_REPLY
    assert payload["confidence"] == "fallback"
    assert db_session.query(ChatbotFallback).count() == 1
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "chatbot.fallback.created").count() == 1


def test_public_chat_exact_faq_match(client: TestClient, db_session: Session) -> None:
    db_session.add(
        ChatbotFaq(
            question="¿Qué servicios puedo pagar?",
            normalized_question=normalize_text("¿Qué servicios puedo pagar?"),
            answer="Puedes consultar servicios domesticos disponibles desde la app.",
            category="services",
            priority=1,
            is_active=True,
        )
    )
    db_session.commit()

    response = client.post(
        "/api/public/chat",
        json={"message": "¿Qué servicios puedo pagar?", "sessionId": "landing-faq", "source": "landing"},
    )

    assert response.status_code == 200
    assert response.json()["reply"] == "Puedes consultar servicios domesticos disponibles desde la app."
    assert response.json()["confidence"] == "faq"


def test_public_chat_routes_private_payment_questions_safely(client: TestClient) -> None:
    response = client.post(
        "/api/public/chat",
        json={"message": "¿Ya se aplicó mi pago 123?", "sessionId": "landing-private", "source": "landing"},
    )

    assert response.status_code == 200
    assert response.json()["reply"] == PRIVATE_ROUTING_REPLY
    assert response.json()["confidence"] == "rule"


def test_public_chat_masks_sensitive_values_before_storage(
    client: TestClient,
    db_session: Session,
) -> None:
    response = client.post(
        "/api/public/chat",
        json={
            "message": "Mi tarjeta 4111111111111111 y codigo 123456, correo user@example.com",
            "sessionId": "landing-mask",
            "source": "landing",
        },
    )

    assert response.status_code == 200
    user_message = db_session.query(ChatbotMessage).filter(ChatbotMessage.sender_type == "user").first()
    assert user_message is not None
    assert "[CARD_MASKED]" in user_message.message_text_masked
    assert "[CODE_MASKED]" in user_message.message_text_masked
    assert "[EMAIL_MASKED]" in user_message.message_text_masked
    assert user_message.raw_message_stored is False
