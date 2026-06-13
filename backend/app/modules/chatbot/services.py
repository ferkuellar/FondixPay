import re
import unicodedata
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import HTTPException, Request, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.request_context import get_request_context
from app.modules.admin.models import SupportTicket
from app.modules.audit.services import create_audit_event
from app.modules.chatbot import repository
from app.modules.chatbot.models import (
    ChatbotAiMetric,
    ChatbotConversation,
    ChatbotConversationEvent,
    ChatbotFallback,
    ChatbotFaq,
    ChatbotIntent,
    ChatbotInternalNote,
    ChatbotKnowledgeEntry,
    ChatbotMessage,
)
from app.modules.chatbot.schemas import (
    ChatOperationNoteCreate,
    ChatOperationSeverityUpdate,
    ChatOperationTicketCreate,
    ChatOperationsMetrics,
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
AI_DOWN_FALLBACK = (
    "En este momento estoy teniendo dificultades para responderte. "
    "Por favor escríbenos directamente al soporte o descarga la app para ayudarte mejor."
)

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

SEVERITY_RANK = {"SEV-1": 1, "SEV-2": 2, "SEV-3": 3, "SEV-4": 4, "SEV-5": 5}
HIGH_SEVERITIES = {"SEV-1", "SEV-2"}


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


def classify_message(value: str) -> dict[str, str]:
    normalized = normalize_text(value)
    rules: list[tuple[str, str, set[str], str]] = [
        ("fraud_concern", "SEV-1", {"fraude", "hack", "hackearon", "robo", "clonaron", "datos", "demanda", "legal", "profeco"}, "fraud, security, data exposure, or legal concern"),
        ("payment_concern", "SEV-2", {"no se aplico", "no aplico", "pago no", "cobraron", "cargo", "dinero", "perdi"}, "payment confirmation, charge, or money-loss concern"),
        ("receipt_issue", "SEV-2", {"recibo", "comprobante", "folio"}, "receipt or proof-of-payment issue"),
        ("registration_issue", "SEV-3", {"registro", "registrar", "cuenta", "login", "entrar"}, "registration or account-access question"),
        ("coverage_question", "SEV-3", {"cobertura", "estado", "municipio", "ciudad", "funciona"}, "coverage question"),
        ("commission_question", "SEV-4", {"comision", "comisione", "costo", "cuanto cobran"}, "commission or cost FAQ"),
        ("app_download_question", "SEV-4", {"descargar", "app store", "google play", "instalar"}, "app download question"),
        ("feature_request", "SEV-5", {"podrian", "agregar", "sugerencia", "feature", "me gustaria"}, "feature request or product suggestion"),
    ]
    for intent, severity, terms, reason in rules:
        if any(term in normalized for term in terms):
            return {"intent": intent, "severity": severity, "reason": reason}
    if _is_private_request(normalized):
        return {"intent": "payment_concern", "severity": "SEV-2", "reason": "private payment/account request routed to authenticated support"}
    return {"intent": "general_faq", "severity": "SEV-4", "reason": "general public FAQ or informational question"}


_DEFAULT_SYSTEM_PROMPT = (
    "Eres el asistente virtual de FondixPay, una plataforma de pagos de servicios en México. "
    "Responde en español de forma concisa y amigable. "
    "Si no tienes información suficiente, sugiere al usuario que contacte al soporte."
)


def _load_system_prompt(db: Session) -> str:
    setting = repository.get_setting(db, "system_prompt")
    if setting and setting.value:
        return setting.value
    return _DEFAULT_SYSTEM_PROMPT


def _load_fallback_message(db: Session) -> str:
    setting = repository.get_setting(db, "bot.fallback_message")
    if setting and setting.value:
        return setting.value
    return AI_DOWN_FALLBACK


async def _call_claude_async(message: str, system_prompt: str) -> tuple[str | None, int, int, int]:
    """Returns (text, latency_ms, input_tokens, output_tokens)."""
    import time
    model = settings.chatbot_ai_model or "claude-haiku-4-5-20251001"
    t0 = time.perf_counter()
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": settings.chatbot_ai_api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": model,
                    "max_tokens": 400,
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": message}],
                },
            )
        latency_ms = int((time.perf_counter() - t0) * 1000)
        if response.is_success:
            data = response.json()
            usage = data.get("usage", {})
            return (
                data["content"][0]["text"],
                latency_ms,
                usage.get("input_tokens", 0),
                usage.get("output_tokens", 0),
            )
    except Exception:
        pass
    return None, 0, 0, 0


async def resolve_public_chat(db: Session, payload: PublicChatRequest, request: Request) -> PublicChatResponse:
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

    classification = classify_message(message)
    previous_state = {
        "detected_intent": conversation.detected_intent,
        "severity": conversation.severity,
        "escalation_status": conversation.escalation_status,
    }
    conversation.detected_intent = classification["intent"]
    conversation.severity = classification["severity"]
    conversation.suggested_severity = classification["severity"]
    conversation.classification_reason = classification["reason"]
    if classification["severity"] in HIGH_SEVERITIES:
        conversation.escalation_status = "ticket_required"
        conversation.status = "escalated"
    repository.add_conversation_event(
        db,
        ChatbotConversationEvent(
            conversation_id=conversation.id,
            event_type="conversation.classified",
            before_json=previous_state,
            after_json={
                "detected_intent": classification["intent"],
                "severity": classification["severity"],
                "escalation_status": conversation.escalation_status,
            },
            note=classification["reason"],
        ),
    )
    _audit_public(
        db,
        request,
        "conversation.classified",
        conversation.id,
        {"intent": classification["intent"], "severity": classification["severity"]},
    )
    if classification["severity"] in HIGH_SEVERITIES:
        _audit_public(db, request, "conversation.escalated", conversation.id, {"severity": classification["severity"]})

    reply, confidence, detected_intent, latency_ms, input_tokens, output_tokens = await _resolve_reply(db, message)
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
    if detected_intent and classification["intent"] in {"general_faq", "fallback_unknown"}:
        conversation.detected_intent = detected_intent
    conversation.confidence = confidence
    if confidence in {"fallback", "fallback_ai_down"}:
        repository.add_fallback(
            db,
            ChatbotFallback(
                conversation_id=conversation.id,
                message_id=user_message.id,
                message_text_masked=masked,
                reason="no_confident_answer" if confidence == "fallback" else "ai_unavailable",
            ),
        )
        _audit_public(db, request, "chatbot.fallback.created", conversation.id, {"message_id": user_message.id})
    if latency_ms > 0:
        repository.add_ai_metric(
            db,
            ChatbotAiMetric(
                conversation_id=conversation.id,
                model=settings.chatbot_ai_model or "claude-haiku-4-5-20251001",
                latency_ms=latency_ms,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
            ),
        )
    db.commit()
    return PublicChatResponse(reply=bot_message.message_text_masked, conversationId=str(conversation.id), confidence=confidence)


async def _resolve_reply(db: Session, message: str) -> tuple[str, str, str | None, int, int, int]:
    """Returns (reply, confidence, detected_intent, latency_ms, input_tokens, output_tokens)."""
    normalized = normalize_text(message)
    if _is_private_request(normalized):
        return PRIVATE_ROUTING_REPLY, "rule", "private_data_request", 0, 0, 0

    faq = repository.find_faq_by_normalized_question(db, normalized)
    if faq is not None:
        return faq.answer, "faq", "faq", 0, 0, 0

    intent = _match_intent(db, normalized)
    if intent is not None:
        return intent.response, "intent", intent.name, 0, 0, 0

    knowledge = repository.search_knowledge(db, tokenize(message))
    if knowledge is not None:
        return knowledge.content, "rule", "knowledge", 0, 0, 0

    if settings.chatbot_ai_api_key:
        system_prompt = _load_system_prompt(db)
        ai_reply, latency_ms, input_tokens, output_tokens = await _call_claude_async(message, system_prompt)
        if ai_reply is not None:
            return ai_reply, "ai", "ai_response", latency_ms, input_tokens, output_tokens
        fallback_msg = _load_fallback_message(db)
        return fallback_msg, "fallback_ai_down", None, 0, 0, 0

    return SAFE_FALLBACK_REPLY, "fallback", None, 0, 0, 0


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


def chat_operations_metrics(db: Session) -> ChatOperationsMetrics:
    total = db.query(ChatbotConversation).count()
    active = db.query(ChatbotConversation).filter(ChatbotConversation.status.in_(["open", "escalated"])).count()
    escalated = db.query(ChatbotConversation).filter(ChatbotConversation.escalation_status.in_(["human_queue", "ticket_required", "escalated"])).count()
    fallback_count = db.query(ChatbotFallback).count()
    ticket_query = db.query(SupportTicket).filter(SupportTicket.source == "chatbot")
    tickets = ticket_query.count()
    by_severity = {severity: ticket_query.filter(SupportTicket.severity == severity).count() for severity in SEVERITY_RANK}
    statuses = ["new", "triaged", "assigned", "waiting_customer", "waiting_internal_review", "escalated", "resolved", "closed", "reopened"]
    by_status = {value: ticket_query.filter(SupportTicket.status == value).count() for value in statuses}
    top_intents = [
        {"intent": intent or "unknown", "count": count}
        for intent, count in db.query(ChatbotConversation.detected_intent, func.count(ChatbotConversation.id))
        .group_by(ChatbotConversation.detected_intent)
        .order_by(func.count(ChatbotConversation.id).desc())
        .limit(6)
        .all()
    ]
    top_unresolved = [
        {"question": item.message_text_masked[:120], "count": 1}
        for item in db.query(ChatbotFallback).order_by(ChatbotFallback.created_at.desc()).limit(6).all()
    ]
    return ChatOperationsMetrics(
        total_conversations=total,
        active_conversations=active,
        bot_resolved_conversations=max(total - escalated - fallback_count, 0),
        human_escalated_conversations=escalated,
        tickets_created=tickets,
        assigned_tickets=ticket_query.filter(SupportTicket.assigned_to.is_not(None)).count(),
        unassigned_tickets=ticket_query.filter(SupportTicket.assigned_to.is_(None)).count(),
        sla_breached_tickets=ticket_query.filter(SupportTicket.sla_due_at < datetime.now(timezone.utc), SupportTicket.status.notin_(["resolved", "closed"])).count(),
        fallback_rate=round((fallback_count / total) * 100, 2) if total else 0.0,
        tickets_by_severity=by_severity,
        tickets_by_status=by_status,
        top_intents=top_intents,
        top_unresolved_questions=top_unresolved,
    )


def assign_conversation(db: Session, conversation: ChatbotConversation, actor: User, assigned_to: int | None) -> ChatbotConversation:
    before = {"assigned_to": conversation.assigned_to, "escalation_status": conversation.escalation_status}
    conversation.assigned_to = assigned_to
    if assigned_to is not None and conversation.escalation_status in {"none", "ticket_required"}:
        conversation.escalation_status = "human_queue"
    _add_event(db, conversation, actor, "ticket.assigned" if before["assigned_to"] is None else "ticket.reassigned", before, {"assigned_to": assigned_to})
    db.flush()
    return conversation


def update_conversation_severity(db: Session, conversation: ChatbotConversation, payload: ChatOperationSeverityUpdate, actor: User) -> ChatbotConversation:
    before_severity = conversation.severity
    if actor.role == "SUPPORT" and before_severity == "SEV-1" and SEVERITY_RANK[payload.severity] > SEVERITY_RANK[before_severity]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="SUPPORT cannot downgrade SEV-1 without manager approval.")
    conversation.severity = payload.severity
    conversation.suggested_severity = conversation.suggested_severity or payload.severity
    if payload.severity in HIGH_SEVERITIES:
        conversation.escalation_status = "human_queue"
        conversation.status = "escalated"
    _add_event(
        db,
        conversation,
        actor,
        "ticket.severity_changed",
        {"severity": before_severity},
        {"severity": payload.severity},
        note=payload.note,
    )
    db.flush()
    return conversation


def add_internal_note(db: Session, conversation: ChatbotConversation, payload: ChatOperationNoteCreate, actor: User) -> ChatbotInternalNote:
    note = repository.add_internal_note(db, ChatbotInternalNote(conversation_id=conversation.id, author_id=actor.id, body=mask_sensitive_message(payload.body)))
    _add_event(db, conversation, actor, "internal_note.created", None, {"note_id": note.id})
    return note


def mark_reviewed(db: Session, conversation: ChatbotConversation, actor: User) -> ChatbotConversation:
    before = {"status": conversation.status, "reviewed_at": conversation.reviewed_at.isoformat() if conversation.reviewed_at else None}
    conversation.reviewed_at = datetime.now(timezone.utc)
    conversation.reviewed_by = actor.id
    if conversation.status == "open":
        conversation.status = "reviewed"
    _add_event(db, conversation, actor, "conversation.reviewed", before, {"status": conversation.status, "reviewed_by": actor.id})
    db.flush()
    return conversation


def escalate_conversation(db: Session, conversation: ChatbotConversation, actor: User) -> ChatbotConversation:
    before = {"status": conversation.status, "escalation_status": conversation.escalation_status}
    conversation.status = "escalated"
    conversation.escalation_status = "human_queue"
    if conversation.severity not in HIGH_SEVERITIES and conversation.severity == "SEV-4":
        conversation.severity = "SEV-3"
    _add_event(db, conversation, actor, "conversation.escalated", before, {"status": conversation.status, "escalation_status": conversation.escalation_status})
    db.flush()
    return conversation


def create_ticket_from_conversation(
    db: Session,
    conversation: ChatbotConversation,
    payload: ChatOperationTicketCreate,
    actor: User,
) -> SupportTicket:
    from app.modules.admin import repository as admin_repository

    latest_user_message = next((message for message in sorted(conversation.messages, key=lambda item: item.id, reverse=True) if message.sender_type == "user"), None)
    priority = payload.priority or _priority_for_severity(conversation.severity)
    title = payload.title or f"Chat {conversation.id} - {conversation.detected_intent or 'sin clasificar'}"
    ticket = SupportTicket(
        conversation_id=conversation.id,
        ticket_number=None,
        source="chatbot",
        status="new" if conversation.severity not in HIGH_SEVERITIES else "escalated",
        priority=priority,
        severity=conversation.severity,
        category="other",
        title=title,
        subject=title,
        summary=payload.summary or conversation.classification_reason,
        description=payload.summary or conversation.classification_reason,
        customer_message_excerpt=latest_user_message.message_text_masked[:500] if latest_user_message else None,
        assigned_to=payload.assigned_to,
        created_by=actor.id,
        sla_due_at=datetime.now(timezone.utc) + _sla_for_severity(conversation.severity),
    )
    admin_repository.create_support_ticket(db, ticket)
    ticket.ticket_number = f"TK-{ticket.id:06d}"
    conversation.linked_ticket_id = ticket.id
    conversation.escalation_status = "human_queue" if conversation.severity in HIGH_SEVERITIES else "ticket_created"
    _add_event(db, conversation, actor, "ticket.created", None, {"ticket_id": ticket.id, "severity": ticket.severity})
    db.flush()
    return ticket


def mark_ticket_first_response(db: Session, ticket: SupportTicket, conversation: ChatbotConversation | None, actor: User) -> SupportTicket:
    ticket.first_response_at = datetime.now(timezone.utc)
    if ticket.status in {"new", "triaged", "escalated"}:
        ticket.status = "assigned" if ticket.assigned_to else "triaged"
    if conversation is not None:
        _add_event(db, conversation, actor, "ticket.first_response_marked", None, {"ticket_id": ticket.id})
    db.flush()
    return ticket


def update_chat_ticket_status(db: Session, ticket: SupportTicket, conversation: ChatbotConversation | None, actor: User, target_status: str, note: str | None) -> SupportTicket:
    before = {"status": ticket.status}
    if target_status in {"resolved", "closed"} and not note:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resolution note is required.")
    ticket.status = target_status
    now = datetime.now(timezone.utc)
    if target_status == "resolved":
        ticket.resolved_at = now
    if target_status == "closed":
        ticket.closed_at = now
    if target_status == "reopened":
        ticket.reopened_at = now
        ticket.closed_at = None
        ticket.resolved_at = None
    if conversation is not None:
        _add_event(db, conversation, actor, f"ticket.{target_status}", before, {"status": target_status, "ticket_id": ticket.id}, note=note)
    db.flush()
    return ticket


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


def _add_event(
    db: Session,
    conversation: ChatbotConversation,
    actor: User,
    event_type: str,
    before: dict | None,
    after: dict | None,
    note: str | None = None,
) -> None:
    repository.add_conversation_event(
        db,
        ChatbotConversationEvent(
            conversation_id=conversation.id,
            event_type=event_type,
            actor_id=actor.id,
            before_json=before,
            after_json=after,
            note=mask_sensitive_message(note) if note else None,
        ),
    )


def _priority_for_severity(severity: str) -> str:
    return {
        "SEV-1": "urgent",
        "SEV-2": "high",
        "SEV-3": "medium",
        "SEV-4": "low",
        "SEV-5": "low",
    }.get(severity, "medium")


def _sla_for_severity(severity: str) -> timedelta:
    return {
        "SEV-1": timedelta(minutes=30),
        "SEV-2": timedelta(hours=2),
        "SEV-3": timedelta(hours=8),
        "SEV-4": timedelta(days=2),
        "SEV-5": timedelta(days=5),
    }.get(severity, timedelta(hours=8))


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
