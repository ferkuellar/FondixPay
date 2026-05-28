from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent
from app.modules.chatbot.models import ChatbotConversation, ChatbotFallback, ChatbotMessage
from app.modules.users.models import User


def test_regular_user_cannot_access_chatbot_admin_routes(
    client: TestClient,
    create_user,
    auth_headers,
) -> None:
    user = create_user(role="USER")

    response = client.get("/admin/chat/faqs", headers=auth_headers(user))

    assert response.status_code == 403


def test_admin_can_create_update_and_disable_faq(
    client: TestClient,
    create_user,
    auth_headers,
    db_session: Session,
) -> None:
    admin = create_user(role="ADMIN")
    headers = auth_headers(admin)

    create_response = client.post(
        "/admin/chat/faqs",
        headers=headers,
        json={"question": "¿Cómo me registro?", "answer": "Desde la app cuando el registro este disponible."},
    )
    assert create_response.status_code == 201
    faq_id = create_response.json()["id"]

    update_response = client.patch(
        f"/admin/chat/faqs/{faq_id}",
        headers=headers,
        json={"answer": "Usa la app oficial cuando el registro este disponible."},
    )
    assert update_response.status_code == 200
    assert update_response.json()["answer"].startswith("Usa la app")

    disable_response = client.post(f"/admin/chat/faqs/{faq_id}/disable", headers=headers)
    assert disable_response.status_code == 200
    assert disable_response.json()["is_active"] is False

    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "chatbot.faq.created").count() == 1
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "chatbot.faq.updated").count() == 1
    assert db_session.query(AuditEvent).filter(AuditEvent.event_type == "chatbot.faq.disabled").count() == 1


def test_admin_can_manage_intents_and_knowledge(
    client: TestClient,
    create_user,
    auth_headers,
) -> None:
    admin = create_user(role="ADMIN")
    headers = auth_headers(admin)

    intent_response = client.post(
        "/admin/chat/intents",
        headers=headers,
        json={
            "name": "coverage",
            "description": "Cobertura general",
            "example_phrases": ["cobertura", "estados"],
            "response": "La cobertura se comunica de forma general en la app y landing.",
        },
    )
    assert intent_response.status_code == 201
    intent_id = intent_response.json()["id"]
    assert client.post(f"/admin/chat/intents/{intent_id}/disable", headers=headers).status_code == 200

    knowledge_response = client.post(
        "/admin/chat/knowledge",
        headers=headers,
        json={
            "title": "Servicios",
            "content": "FONDIX PAY publica informacion general de servicios soportados.",
            "category": "services",
            "tags": ["servicios"],
        },
    )
    assert knowledge_response.status_code == 201
    knowledge_id = knowledge_response.json()["id"]
    assert client.post(f"/admin/chat/knowledge/{knowledge_id}/disable", headers=headers).status_code == 200


def test_admin_can_view_conversations_and_fallbacks(
    client: TestClient,
    create_user,
    auth_headers,
    db_session: Session,
) -> None:
    admin: User = create_user(role="ADMIN")
    conversation = ChatbotConversation(session_id="landing-view", source="landing", status="open")
    db_session.add(conversation)
    db_session.commit()
    message = ChatbotMessage(
        conversation_id=conversation.id,
        sender_type="user",
        message_text_masked="Pregunta no cubierta",
        raw_message_stored=False,
        classification="fallback",
    )
    db_session.add(message)
    db_session.commit()
    db_session.add(
        ChatbotFallback(
            conversation_id=conversation.id,
            message_id=message.id,
            message_text_masked=message.message_text_masked,
            reason="no_match",
        )
    )
    db_session.commit()

    headers = auth_headers(admin)

    conversations = client.get("/admin/chat/conversations", headers=headers)
    assert conversations.status_code == 200
    assert conversations.json()[0]["id"] == conversation.id

    detail = client.get(f"/admin/chat/conversations/{conversation.id}", headers=headers)
    assert detail.status_code == 200
    assert detail.json()["messages"][0]["message_text_masked"] == "Pregunta no cubierta"

    fallbacks = client.get("/admin/chat/fallbacks", headers=headers)
    assert fallbacks.status_code == 200
    assert fallbacks.json()[0]["reason"] == "no_match"
