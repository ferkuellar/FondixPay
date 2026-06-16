from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core import rate_limit as rl
from app.core.config import settings
from app.modules.audit.models import AuditEvent
from app.modules.chatbot.models import ChatbotFallback, ChatbotFaq, ChatbotMessage, ChatbotSetting
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
    monkeypatch: object,
) -> None:
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "")
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


# ---------------------------------------------------------------------------
# Sprint 054 — Claude AI path
# ---------------------------------------------------------------------------


def test_public_chat_calls_claude_and_returns_ai_reply(
    client: TestClient,
    db_session: Session,
    monkeypatch: object,
) -> None:
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "sk-test-key")

    with patch("app.modules.chatbot.services._call_claude_async", new=AsyncMock(return_value=("La comisión es del 2%.", 120, 10, 15))):
        response = client.post(
            "/api/public/chat",
            json={"message": "¿Cuál es la comisión?", "sessionId": "claude-ok", "source": "landing"},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["reply"] == "La comisión es del 2%."
    assert payload["confidence"] == "ai"
    assert db_session.query(ChatbotFallback).count() == 0


def test_public_chat_falls_back_gracefully_when_claude_returns_none(
    client: TestClient,
    db_session: Session,
    monkeypatch: object,
) -> None:
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "sk-test-key")

    with patch("app.modules.chatbot.services._call_claude_async", new=AsyncMock(return_value=(None, 0, 0, 0))):
        response = client.post(
            "/api/public/chat",
            json={"message": "Pregunta sin cobertura AI", "sessionId": "claude-fail", "source": "landing"},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["confidence"] == "fallback_ai_down"
    assert db_session.query(ChatbotFallback).count() == 1


def test_public_chat_falls_back_when_api_key_is_empty(client: TestClient, monkeypatch: object) -> None:
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "")
    response = client.post(
        "/api/public/chat",
        json={"message": "Pregunta cualquiera sin cobertura", "sessionId": "no-api-key", "source": "landing"},
    )

    assert response.status_code == 200
    assert response.json()["confidence"] == "fallback"


def test_public_chat_faq_match_does_not_call_claude(
    client: TestClient,
    db_session: Session,
    monkeypatch: object,
) -> None:
    db_session.add(
        ChatbotFaq(
            question="¿Cómo descargo la app?",
            normalized_question=normalize_text("¿Cómo descargo la app?"),
            answer="Disponible en Play Store y App Store.",
            category="app",
            priority=1,
            is_active=True,
        )
    )
    db_session.commit()
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "sk-test-key")
    mock_claude = AsyncMock(return_value="respuesta de claude")

    with patch("app.modules.chatbot.services._call_claude_async", new=mock_claude):
        response = client.post(
            "/api/public/chat",
            json={"message": "¿Cómo descargo la app?", "sessionId": "faq-no-claude", "source": "landing"},
        )

    assert response.status_code == 200
    assert response.json()["confidence"] == "faq"
    mock_claude.assert_not_called()


def test_public_chat_ai_reply_not_in_api_key_exposure(
    client: TestClient,
    monkeypatch: object,
) -> None:
    fake_key = "sk-ant-api03-supersecret"
    monkeypatch.setattr(settings, "chatbot_ai_api_key", fake_key)

    with patch("app.modules.chatbot.services._call_claude_async", new=AsyncMock(return_value=("Respuesta normal.", 100, 8, 12))):
        response = client.post(
            "/api/public/chat",
            json={"message": "Hola", "sessionId": "key-check", "source": "landing"},
        )

    body = response.text
    assert fake_key not in body


# ---------------------------------------------------------------------------
# Sprint 054 — Rate limiting
# ---------------------------------------------------------------------------


def test_public_chat_rate_limit_blocks_after_limit(client: TestClient) -> None:
    import time

    rl._buckets.clear()
    rl._buckets["rate-limit-test"] = (rl.RATE_LIMIT - 1, time.monotonic())

    ok = client.post(
        "/api/public/chat",
        json={"message": "Hola mundo", "sessionId": "rate-limit-test", "source": "landing"},
    )
    assert ok.status_code == 200

    blocked = client.post(
        "/api/public/chat",
        json={"message": "Una mas", "sessionId": "rate-limit-test", "source": "landing"},
    )
    assert blocked.status_code == 429
    assert "detail" in blocked.json()


def test_public_chat_rate_limit_is_per_session(client: TestClient) -> None:
    import time

    rl._buckets.clear()
    rl._buckets["session-full-x"] = (rl.RATE_LIMIT, time.monotonic())

    response = client.post(
        "/api/public/chat",
        json={"message": "Hola mundo", "sessionId": "session-other-x", "source": "landing"},
    )
    assert response.status_code == 200


# ---------------------------------------------------------------------------
# Sprint 055 — GET /chat/config
# ---------------------------------------------------------------------------


def test_get_bot_config_returns_defaults_when_no_settings(client: TestClient) -> None:
    response = client.get("/api/public/chat/config")

    assert response.status_code == 200
    payload = response.json()
    assert payload["name"] == "FONDIX Bot"
    assert isinstance(payload["pills"], list)
    assert len(payload["pills"]) == 3
    for pill in payload["pills"]:
        assert "id" in pill
        assert "label" in pill
        assert "question" in pill


def test_get_bot_config_returns_db_identity_values(
    client: TestClient,
    db_session: Session,
) -> None:
    db_session.add(ChatbotSetting(key="bot.identity.name", value="BotDemo"))
    db_session.add(ChatbotSetting(key="bot.identity.tagline", value="Siempre disponible"))
    db_session.commit()

    response = client.get("/api/public/chat/config")

    assert response.status_code == 200
    payload = response.json()
    assert payload["name"] == "BotDemo"
    assert payload["tagline"] == "Siempre disponible"


def test_get_bot_config_returns_db_pills(
    client: TestClient,
    db_session: Session,
) -> None:
    import json

    custom_pills = [
        {"id": "x1", "label": "Pregunta A", "question": "¿Qué es A?"},
        {"id": "x2", "label": "Pregunta B", "question": "¿Qué es B?"},
    ]
    db_session.add(ChatbotSetting(key="bot.pills", value=json.dumps(custom_pills)))
    db_session.commit()

    response = client.get("/api/public/chat/config")

    assert response.status_code == 200
    pills = response.json()["pills"]
    assert len(pills) == 2
    assert pills[0]["id"] == "x1"


def test_get_bot_config_handles_malformed_pills_gracefully(
    client: TestClient,
    db_session: Session,
) -> None:
    db_session.add(ChatbotSetting(key="bot.pills", value="not valid json {{"))
    db_session.commit()

    response = client.get("/api/public/chat/config")

    assert response.status_code == 200
    assert len(response.json()["pills"]) == 3


def test_get_bot_config_has_cache_control_header(client: TestClient) -> None:
    response = client.get("/api/public/chat/config")

    assert response.status_code == 200
    cache = response.headers.get("cache-control", "")
    assert "public" in cache
    assert "max-age=60" in cache


def test_get_bot_config_has_security_header(client: TestClient) -> None:
    response = client.get("/api/public/chat/config")

    assert response.headers.get("x-content-type-options") == "nosniff"


def test_get_bot_config_does_not_expose_system_prompt(
    client: TestClient,
    db_session: Session,
) -> None:
    db_session.add(ChatbotSetting(key="system_prompt", value="instrucciones secretas del admin"))
    db_session.commit()

    response = client.get("/api/public/chat/config")

    assert response.status_code == 200
    body = response.text
    assert "instrucciones secretas del admin" not in body
    assert "system_prompt" not in response.json()


def test_get_bot_config_does_not_expose_api_key(
    client: TestClient,
    monkeypatch: object,
) -> None:
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "sk-ant-api03-do-not-expose")

    response = client.get("/api/public/chat/config")

    assert "sk-ant-api03-do-not-expose" not in response.text


# ---------------------------------------------------------------------------
# Sprint 058 — Production hardening
# ---------------------------------------------------------------------------


def test_get_chat_health_returns_ok(client: TestClient, monkeypatch: object) -> None:
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "sk-test-key")

    response = client.get("/api/public/chat/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["ai_configured"] is True
    assert payload["db_reachable"] is True
    assert isinstance(payload["conversations_today"], int)


def test_get_chat_health_returns_degraded_without_api_key(client: TestClient, monkeypatch: object) -> None:
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "")

    response = client.get("/api/public/chat/health")

    assert response.status_code == 200
    assert response.json()["status"] == "degraded"
    assert response.json()["ai_configured"] is False


def test_public_chat_ip_rate_limit_blocks_after_limit(client: TestClient) -> None:
    import time

    from app.core import rate_limit as rl

    rl._ip_buckets.clear()
    rl._ip_buckets[f"chat:testclient"] = (rl.IP_LIMIT_CHAT - 1, time.monotonic())

    ok = client.post(
        "/api/public/chat",
        json={"message": "Hola mundo", "sessionId": "ip-rl-test-ok", "source": "landing"},
    )
    assert ok.status_code == 200

    blocked = client.post(
        "/api/public/chat",
        json={"message": "Una mas", "sessionId": "ip-rl-test-blocked", "source": "landing"},
    )
    assert blocked.status_code == 429
    assert blocked.headers.get("retry-after") == "3600"


def test_public_chat_has_security_headers(client: TestClient) -> None:
    with patch("app.modules.chatbot.services._call_claude_async", new=AsyncMock(return_value=(None, 0, 0, 0))):
        response = client.post(
            "/api/public/chat",
            json={"message": "Hola", "sessionId": "sec-headers-test", "source": "landing"},
        )

    assert response.status_code == 200
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"


def test_public_chat_fallback_ai_down_uses_configurable_message(
    client: TestClient,
    db_session: Session,
    monkeypatch: object,
) -> None:
    from app.modules.chatbot.models import ChatbotSetting

    db_session.add(ChatbotSetting(key="bot.fallback_message", value="Servicio en mantenimiento."))
    db_session.commit()
    monkeypatch.setattr(settings, "chatbot_ai_api_key", "sk-test-key")

    with patch("app.modules.chatbot.services._call_claude_async", new=AsyncMock(return_value=(None, 0, 0, 0))):
        response = client.post(
            "/api/public/chat",
            json={"message": "cualquier cosa", "sessionId": "fallback-custom", "source": "landing"},
        )

    assert response.status_code == 200
    assert response.json()["reply"] == "Servicio en mantenimiento."
    assert response.json()["confidence"] == "fallback_ai_down"


def test_conversation_expiry_creates_new_after_24h(
    client: TestClient,
    db_session: Session,
) -> None:
    from datetime import datetime, timedelta, timezone

    from app.modules.chatbot.models import ChatbotConversation

    old_conv = ChatbotConversation(
        session_id="expiry-test-session",
        source="landing",
        last_message_at=datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=25),
    )
    db_session.add(old_conv)
    db_session.commit()
    old_id = old_conv.id

    with patch("app.modules.chatbot.services._call_claude_async", new=AsyncMock(return_value=(None, 0, 0, 0))):
        response = client.post(
            "/api/public/chat",
            json={"message": "Hola de nuevo", "sessionId": "expiry-test-session", "source": "landing"},
        )

    assert response.status_code == 200
    new_conv_id = int(response.json()["conversationId"])
    assert new_conv_id != old_id

    db_session.refresh(old_conv)
    assert old_conv.status == "closed"
