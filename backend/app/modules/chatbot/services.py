import re
import unicodedata
from datetime import datetime, timezone

from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.request_context import get_request_context
from app.modules.audit.services import create_audit_event
from app.modules.chatbot import repository
from app.modules.chatbot.models import ChatbotFallback, ChatbotFaq, ChatbotIntent, ChatbotKnowledgeEntry, ChatbotMessage
from app.modules.chatbot.schemas import (
    ChatbotFaqCreate,
    ChatbotFaqUpdate,
    ChatbotIntentCreate,
    ChatbotIntentUpdate,
    ChatbotKnowledgeCreate,
    ChatbotKnowledgeUpdate,
    PublicChatRequest,
    PublicChatResponse,
)
from app.modules.users.models import User

PRIVATE_ROUTING_REPLY = "Por seguridad, ese tipo de consulta debe revisarse dentro de la app o por el canal oficial de soporte autenticado."
SAFE_FALLBACK_REPLY = "No quiero inventarte una respuesta. Puedo dejar registrado tu caso para que soporte lo revise."

PRIVATE_TERMS = {
    "pago",
    "recibo",
    "comprobante",
    "saldo",
    "balance",
    "transaccion",
    "transacción",
    "cancelar",
    "otp",
    "codigo",
    "código",
    "tarjeta",
    "cuenta",
}


def normalize_text(value: str) -> str:
    text = unicodedata.normalize("NFKD", value.strip().lower())
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", text)


def tokenize(value: str) -> list[str]:
    normalized = normalize_text(value)
    return [part for part in re.split(r"[^a-z0-9]+", normalized) if len(part) >= 4]


def mask_sensitive_message(value: str) -> str:
    # Keep this helper explicit: public chat text is untrusted and must be masked before storage.
    text = re.sub(r"\b(?:\d[ -]?){13,19}\b", "[CARD_MASKED]", value)
    text = re.sub(r"\b\d{4,8}\b", "[CODE_MASKED]", text)
    text = re.sub(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[EMAIL_MASKED]", text, flags=re.IGNORECASE)
    text = re.sub(r"\b(?:\+?52)?\s?\d{10}\b", "[PHONE_MASKED]", text)
    text = re.sub(r"(?i)(password|token|api[_ -]?key|secret|contrase(?:n|ñ)a)\s*[:=]\s*\S+", r"\1=[REDACTED]", text)
    return text


def resolve_public_chat(db: Session, payload: PublicChatRequest, request: Request) -> PublicChatResponse:
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message is required.")
    if len(message) > settings.chatbot_max_message_length:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Message is too long.")

    conversation, created = repository.get_or_create_conversation(
        db,
        session_id=payload.sessionId,
        source=payload.source,
        page_url=payload.pageUrl,
    )
    masked = mask_sensitive_message(message)
    user_message = repository.add_message(
        db,
        ChatbotMessage(
            conversation_id=conversation.id,
            sender_type="user",
            message_text_masked=masked,
            raw_message_stored=False,
            classification="received",
        ),
    )
    if created:
        _audit_public(db, request, "chatbot.conversation.created", conversation.id)
    _audit_public(db, request, "chatbot.message.received", conversation.id, {"message_id": user_message.id})

    reply, confidence, detected_intent = _resolve_reply(db, message)
    bot_message = repository.add_message(
        db,
        ChatbotMessage(
            conversation_id=conversation.id,
            sender_type="bot",
            message_text_masked=reply,
            raw_message_stored=False,
            classification=confidence,
        ),
    )
    conversation.last_message_at = datetime.now(timezone.utc)
    conversation.detected_intent = detected_intent
    conversation.confidence = confidence
    if confidence == "fallback":
        repository.add_fallback(
            db,
            ChatbotFallback(
                conversation_id=conversation.id,
                message_id=user_message.id,
                message_text_masked=masked,
                reason="no_confident_answer",
            ),
        )
        _audit_public(db, request, "chatbot.fallback.created", conversation.id, {"message_id": user_message.id})
    db.commit()
    return PublicChatResponse(reply=bot_message.message_text_masked, conversationId=str(conversation.id), confidence=confidence)


def _resolve_reply(db: Session, message: str) -> tuple[str, str, str | None]:
    normalized = normalize_text(message)
    if _is_private_request(normalized):
        return PRIVATE_ROUTING_REPLY, "rule", "private_data_request"

    faq = repository.find_faq_by_normalized_question(db, normalized)
    if faq is not None:
        return faq.answer, "faq", "faq"

    intent = _match_intent(db, normalized)
    if intent is not None:
        return intent.response, "intent", intent.name

    knowledge = repository.search_knowledge(db, tokenize(message))
    if knowledge is not None:
        return knowledge.content, "rule", "knowledge"

    if settings.chatbot_ai_provider and settings.chatbot_ai_api_key:
        # AI provider wiring is intentionally deferred to a provider-specific implementation.
        return SAFE_FALLBACK_REPLY, "fallback", "ai_not_configured"

    return SAFE_FALLBACK_REPLY, "fallback", None


def _is_private_request(normalized: str) -> bool:
    return any(term in normalized for term in PRIVATE_TERMS) and any(
        marker in normalized for marker in {"mi ", "mis ", "me ", "puedes", "chec", "verifica", "cancela", "aplico", "aplicó"}
    )


def _match_intent(db: Session, normalized: str) -> ChatbotIntent | None:
    for intent in repository.list_intents(db, include_inactive=False):
        examples = intent.example_phrases or []
        candidates = [intent.name, *(str(item) for item in examples)]
        for candidate in candidates:
            normalized_candidate = normalize_text(candidate)
            if normalized_candidate and normalized_candidate in normalized:
                return intent
    return None


def create_faq(db: Session, payload: ChatbotFaqCreate, actor: User) -> ChatbotFaq:
    return repository.create_faq(db, ChatbotFaq(**payload.model_dump(), normalized_question=normalize_text(payload.question), created_by=actor.id, updated_by=actor.id))


def update_faq(db: Session, item: ChatbotFaq, payload: ChatbotFaqUpdate, actor: User) -> ChatbotFaq:
    changes = payload.model_dump(exclude_unset=True)
    if "question" in changes:
        item.normalized_question = normalize_text(changes["question"])
    for key, value in changes.items():
        setattr(item, key, value)
    item.updated_by = actor.id
    db.flush()
    return item


def create_intent(db: Session, payload: ChatbotIntentCreate, actor: User) -> ChatbotIntent:
    return repository.create_intent(db, ChatbotIntent(**payload.model_dump(), created_by=actor.id, updated_by=actor.id))


def update_intent(db: Session, item: ChatbotIntent, payload: ChatbotIntentUpdate, actor: User) -> ChatbotIntent:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    item.updated_by = actor.id
    db.flush()
    return item


def create_knowledge(db: Session, payload: ChatbotKnowledgeCreate, actor: User) -> ChatbotKnowledgeEntry:
    return repository.create_knowledge(db, ChatbotKnowledgeEntry(**payload.model_dump(), created_by=actor.id, updated_by=actor.id))


def update_knowledge(db: Session, item: ChatbotKnowledgeEntry, payload: ChatbotKnowledgeUpdate, actor: User) -> ChatbotKnowledgeEntry:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    item.updated_by = actor.id
    db.flush()
    return item


def get_or_404(item, detail: str):
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
    return item


def audit_admin_chatbot_action(
    db: Session,
    request: Request,
    actor: User,
    *,
    event_type: str,
    permission: str,
    entity_type: str | None = None,
    entity_id: str | int | None = None,
    metadata: dict | None = None,
) -> None:
    context = get_request_context(request)
    create_audit_event(
        db,
        event_type=event_type,
        actor_type="ADMIN",
        actor_id=actor.id,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata={"role": actor.role, "permission": permission, **(metadata or {})},
        request_id=context.request_id,
        ip_address=context.ip_address,
        user_agent=context.user_agent,
    )
    db.commit()


def _audit_public(db: Session, request: Request, event_type: str, conversation_id: int, metadata: dict | None = None) -> None:
    context = get_request_context(request)
    create_audit_event(
        db,
        event_type=event_type,
        actor_type="PUBLIC",
        entity_type="ChatbotConversation",
        entity_id=conversation_id,
        metadata=metadata,
        request_id=context.request_id,
        ip_address=context.ip_address,
        user_agent=context.user_agent,
    )
