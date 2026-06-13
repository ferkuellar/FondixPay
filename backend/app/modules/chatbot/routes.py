import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.modules.admin.dependencies import require_admin_permission
from app.modules.admin.models import SupportTicket
from app.modules.admin.schemas import SupportTicketRead
from app.modules.chatbot import repository, services
from app.modules.chatbot.schemas import (
    ChatOperationAssign,
    ChatOperationNoteCreate,
    ChatOperationSeverityUpdate,
    ChatOperationTicketCreate,
    ChatOperationTicketStatusUpdate,
    ChatOperationsMetrics,
    ChatbotConversationRead,
    ChatbotFallbackRead,
    ChatbotFaqCreate,
    ChatbotFaqRead,
    ChatbotFaqUpdate,
    ChatbotIntentCreate,
    ChatbotIntentRead,
    ChatbotIntentUpdate,
    ChatbotKnowledgeCreate,
    ChatbotKnowledgeRead,
    ChatbotKnowledgeUpdate,
    ChatbotSettingRead,
    ChatbotSettingUpdate,
    ChatTestRequest,
    ChatTestResponse,
    PublicChatRequest,
    PublicChatResponse,
)
from app.modules.users.models import User

public_router = APIRouter()
admin_router = APIRouter()


@public_router.post("/chat", response_model=PublicChatResponse)
def public_chat(payload: PublicChatRequest, request: Request, db: Session = Depends(get_db)) -> PublicChatResponse:
    return services.resolve_public_chat(db, payload, request)


@admin_router.get("/faqs", response_model=list[ChatbotFaqRead])
def list_faqs(
    current_user: User = Depends(require_admin_permission("admin.chatbot.view")),
    db: Session = Depends(get_db),
) -> list[ChatbotFaqRead]:
    return [ChatbotFaqRead.model_validate(item, from_attributes=True) for item in repository.list_faqs(db)]


@admin_router.post("/faqs", response_model=ChatbotFaqRead, status_code=status.HTTP_201_CREATED)
def create_faq(
    payload: ChatbotFaqCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chatbot.manage")),
    db: Session = Depends(get_db),
) -> ChatbotFaqRead:
    item = services.create_faq(db, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.faq.created", permission="admin.chatbot.manage", entity_type="ChatbotFaq", entity_id=item.id)
    return ChatbotFaqRead.model_validate(item, from_attributes=True)


@admin_router.patch("/faqs/{item_id}", response_model=ChatbotFaqRead)
def update_faq(
    item_id: int,
    payload: ChatbotFaqUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chatbot.manage")),
    db: Session = Depends(get_db),
) -> ChatbotFaqRead:
    item = services.get_or_404(repository.get_faq(db, item_id), "FAQ no encontrada")
    item = services.update_faq(db, item, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.faq.updated", permission="admin.chatbot.manage", entity_type="ChatbotFaq", entity_id=item.id)
    return ChatbotFaqRead.model_validate(item, from_attributes=True)


@admin_router.post("/faqs/{item_id}/disable", response_model=ChatbotFaqRead)
def disable_faq(item_id: int, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotFaqRead:
    item = services.get_or_404(repository.get_faq(db, item_id), "FAQ no encontrada")
    item = services.update_faq(db, item, ChatbotFaqUpdate(is_active=False), current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.faq.disabled", permission="admin.chatbot.manage", entity_type="ChatbotFaq", entity_id=item.id)
    return ChatbotFaqRead.model_validate(item, from_attributes=True)


@admin_router.post("/faqs/{item_id}/enable", response_model=ChatbotFaqRead)
def enable_faq(item_id: int, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotFaqRead:
    item = services.get_or_404(repository.get_faq(db, item_id), "FAQ no encontrada")
    item = services.update_faq(db, item, ChatbotFaqUpdate(is_active=True), current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.faq.enabled", permission="admin.chatbot.manage", entity_type="ChatbotFaq", entity_id=item.id)
    return ChatbotFaqRead.model_validate(item, from_attributes=True)


@admin_router.get("/intents", response_model=list[ChatbotIntentRead])
def list_intents(current_user: User = Depends(require_admin_permission("admin.chatbot.view")), db: Session = Depends(get_db)) -> list[ChatbotIntentRead]:
    return [ChatbotIntentRead.model_validate(item, from_attributes=True) for item in repository.list_intents(db)]


@admin_router.post("/intents", response_model=ChatbotIntentRead, status_code=status.HTTP_201_CREATED)
def create_intent(payload: ChatbotIntentCreate, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotIntentRead:
    item = services.create_intent(db, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.intent.created", permission="admin.chatbot.manage", entity_type="ChatbotIntent", entity_id=item.id)
    return ChatbotIntentRead.model_validate(item, from_attributes=True)


@admin_router.patch("/intents/{item_id}", response_model=ChatbotIntentRead)
def update_intent(item_id: int, payload: ChatbotIntentUpdate, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotIntentRead:
    item = services.get_or_404(repository.get_intent(db, item_id), "Intent no encontrado")
    item = services.update_intent(db, item, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.intent.updated", permission="admin.chatbot.manage", entity_type="ChatbotIntent", entity_id=item.id)
    return ChatbotIntentRead.model_validate(item, from_attributes=True)


@admin_router.post("/intents/{item_id}/disable", response_model=ChatbotIntentRead)
def disable_intent(item_id: int, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotIntentRead:
    item = services.get_or_404(repository.get_intent(db, item_id), "Intent no encontrado")
    item = services.update_intent(db, item, ChatbotIntentUpdate(is_active=False), current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.intent.disabled", permission="admin.chatbot.manage", entity_type="ChatbotIntent", entity_id=item.id)
    return ChatbotIntentRead.model_validate(item, from_attributes=True)


@admin_router.post("/intents/{item_id}/enable", response_model=ChatbotIntentRead)
def enable_intent(item_id: int, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotIntentRead:
    item = services.get_or_404(repository.get_intent(db, item_id), "Intent no encontrado")
    item = services.update_intent(db, item, ChatbotIntentUpdate(is_active=True), current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.intent.enabled", permission="admin.chatbot.manage", entity_type="ChatbotIntent", entity_id=item.id)
    return ChatbotIntentRead.model_validate(item, from_attributes=True)


@admin_router.get("/knowledge", response_model=list[ChatbotKnowledgeRead])
def list_knowledge(current_user: User = Depends(require_admin_permission("admin.chatbot.view")), db: Session = Depends(get_db)) -> list[ChatbotKnowledgeRead]:
    return [ChatbotKnowledgeRead.model_validate(item, from_attributes=True) for item in repository.list_knowledge(db)]


@admin_router.post("/knowledge", response_model=ChatbotKnowledgeRead, status_code=status.HTTP_201_CREATED)
def create_knowledge(payload: ChatbotKnowledgeCreate, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotKnowledgeRead:
    item = services.create_knowledge(db, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.knowledge.created", permission="admin.chatbot.manage", entity_type="ChatbotKnowledgeEntry", entity_id=item.id)
    return ChatbotKnowledgeRead.model_validate(item, from_attributes=True)


@admin_router.patch("/knowledge/{item_id}", response_model=ChatbotKnowledgeRead)
def update_knowledge(item_id: int, payload: ChatbotKnowledgeUpdate, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotKnowledgeRead:
    item = services.get_or_404(repository.get_knowledge(db, item_id), "Entrada no encontrada")
    item = services.update_knowledge(db, item, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.knowledge.updated", permission="admin.chatbot.manage", entity_type="ChatbotKnowledgeEntry", entity_id=item.id)
    return ChatbotKnowledgeRead.model_validate(item, from_attributes=True)


@admin_router.post("/knowledge/{item_id}/disable", response_model=ChatbotKnowledgeRead)
def disable_knowledge(item_id: int, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotKnowledgeRead:
    item = services.get_or_404(repository.get_knowledge(db, item_id), "Entrada no encontrada")
    item = services.update_knowledge(db, item, ChatbotKnowledgeUpdate(is_active=False), current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.knowledge.disabled", permission="admin.chatbot.manage", entity_type="ChatbotKnowledgeEntry", entity_id=item.id)
    return ChatbotKnowledgeRead.model_validate(item, from_attributes=True)


@admin_router.post("/knowledge/{item_id}/enable", response_model=ChatbotKnowledgeRead)
def enable_knowledge(item_id: int, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.manage")), db: Session = Depends(get_db)) -> ChatbotKnowledgeRead:
    item = services.get_or_404(repository.get_knowledge(db, item_id), "Entrada no encontrada")
    item = services.update_knowledge(db, item, ChatbotKnowledgeUpdate(is_active=True), current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.knowledge.enabled", permission="admin.chatbot.manage", entity_type="ChatbotKnowledgeEntry", entity_id=item.id)
    return ChatbotKnowledgeRead.model_validate(item, from_attributes=True)


@admin_router.get("/conversations", response_model=list[ChatbotConversationRead])
def list_conversations(limit: int = Query(default=50, ge=1, le=200), offset: int = Query(default=0, ge=0), current_user: User = Depends(require_admin_permission("admin.chatbot.conversations.view")), db: Session = Depends(get_db)) -> list[ChatbotConversationRead]:
    return [ChatbotConversationRead.model_validate(item, from_attributes=True) for item in repository.list_conversations(db, limit=limit, offset=offset)]


@admin_router.get("/conversations/{item_id}", response_model=ChatbotConversationRead)
def get_conversation(item_id: int, current_user: User = Depends(require_admin_permission("admin.chatbot.conversations.view")), db: Session = Depends(get_db)) -> ChatbotConversationRead:
    item = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    return ChatbotConversationRead.model_validate(item, from_attributes=True)


@admin_router.get("/operations/metrics", response_model=ChatOperationsMetrics)
def get_chat_operations_metrics(
    current_user: User = Depends(require_admin_permission("admin.chat_ops.view")),
    db: Session = Depends(get_db),
) -> ChatOperationsMetrics:
    return services.chat_operations_metrics(db)


@admin_router.get("/operations/conversations", response_model=list[ChatbotConversationRead])
def list_chat_operations_conversations(
    status_value: str | None = Query(default=None, alias="status"),
    severity: str | None = None,
    source: str | None = None,
    assigned_to: int | None = None,
    has_ticket: bool | None = None,
    escalated: bool | None = None,
    q: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.chat_ops.view")),
    db: Session = Depends(get_db),
) -> list[ChatbotConversationRead]:
    return [
        ChatbotConversationRead.model_validate(item, from_attributes=True)
        for item in repository.list_conversations(
            db,
            limit=limit,
            offset=offset,
            status=status_value,
            severity=severity,
            source=source,
            assigned_to=assigned_to,
            has_ticket=has_ticket,
            escalated=escalated,
            q=q,
        )
    ]


@admin_router.get("/operations/conversations/{item_id}", response_model=ChatbotConversationRead)
def get_chat_operations_conversation(
    item_id: int,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.view")),
    db: Session = Depends(get_db),
) -> ChatbotConversationRead:
    item = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    return ChatbotConversationRead.model_validate(item, from_attributes=True)


@admin_router.post("/operations/conversations/{item_id}/ticket", response_model=SupportTicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket_from_conversation(
    item_id: int,
    payload: ChatOperationTicketCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.manage")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    conversation = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    ticket = services.create_ticket_from_conversation(db, conversation, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="ticket.created", permission="admin.chat_ops.manage", entity_type="SupportTicket", entity_id=ticket.id)
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@admin_router.post("/operations/conversations/{item_id}/escalate", response_model=ChatbotConversationRead)
def escalate_conversation(
    item_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.manage")),
    db: Session = Depends(get_db),
) -> ChatbotConversationRead:
    conversation = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    conversation = services.escalate_conversation(db, conversation, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="conversation.escalated", permission="admin.chat_ops.manage", entity_type="ChatbotConversation", entity_id=conversation.id)
    return ChatbotConversationRead.model_validate(conversation, from_attributes=True)


@admin_router.post("/operations/conversations/{item_id}/assign", response_model=ChatbotConversationRead)
def assign_conversation(
    item_id: int,
    payload: ChatOperationAssign,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.assign")),
    db: Session = Depends(get_db),
) -> ChatbotConversationRead:
    conversation = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    conversation = services.assign_conversation(db, conversation, current_user, payload.assigned_to or current_user.id)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="ticket.assigned", permission="admin.chat_ops.assign", entity_type="ChatbotConversation", entity_id=conversation.id)
    return ChatbotConversationRead.model_validate(conversation, from_attributes=True)


@admin_router.post("/operations/conversations/{item_id}/severity", response_model=ChatbotConversationRead)
def update_conversation_severity(
    item_id: int,
    payload: ChatOperationSeverityUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.severity.override")),
    db: Session = Depends(get_db),
) -> ChatbotConversationRead:
    conversation = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    conversation = services.update_conversation_severity(db, conversation, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="human_override.created", permission="admin.chat_ops.severity.override", entity_type="ChatbotConversation", entity_id=conversation.id, metadata={"severity": conversation.severity})
    return ChatbotConversationRead.model_validate(conversation, from_attributes=True)


@admin_router.post("/operations/conversations/{item_id}/notes", response_model=ChatbotConversationRead)
def add_conversation_note(
    item_id: int,
    payload: ChatOperationNoteCreate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.notes.create")),
    db: Session = Depends(get_db),
) -> ChatbotConversationRead:
    conversation = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    services.add_internal_note(db, conversation, payload, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="internal_note.created", permission="admin.chat_ops.notes.create", entity_type="ChatbotConversation", entity_id=conversation.id)
    return ChatbotConversationRead.model_validate(conversation, from_attributes=True)


@admin_router.post("/operations/conversations/{item_id}/review", response_model=ChatbotConversationRead)
def mark_conversation_reviewed(
    item_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.manage")),
    db: Session = Depends(get_db),
) -> ChatbotConversationRead:
    conversation = services.get_or_404(repository.get_conversation(db, item_id), "Conversacion no encontrada")
    conversation = services.mark_reviewed(db, conversation, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="conversation.reviewed", permission="admin.chat_ops.manage", entity_type="ChatbotConversation", entity_id=conversation.id)
    return ChatbotConversationRead.model_validate(conversation, from_attributes=True)


@admin_router.post("/operations/tickets/{ticket_id}/first-response", response_model=SupportTicketRead)
def mark_ticket_first_response(
    ticket_id: int,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.first_response")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    ticket = services.get_or_404(db.query(SupportTicket).filter(SupportTicket.id == ticket_id).one_or_none(), "Ticket no encontrado")
    conversation = repository.get_conversation(db, ticket.conversation_id) if ticket.conversation_id else None
    ticket = services.mark_ticket_first_response(db, ticket, conversation, current_user)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="ticket.first_response_marked", permission="admin.chat_ops.first_response", entity_type="SupportTicket", entity_id=ticket.id)
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@admin_router.post("/operations/tickets/{ticket_id}/{target_status}", response_model=SupportTicketRead)
def update_chat_ticket_status(
    ticket_id: int,
    target_status: str,
    payload: ChatOperationTicketStatusUpdate,
    request: Request,
    current_user: User = Depends(require_admin_permission("admin.chat_ops.manage")),
    db: Session = Depends(get_db),
) -> SupportTicketRead:
    if target_status not in {"resolved", "closed", "reopened"}:
        services.get_or_404(None, "Estado no soportado")
    ticket = services.get_or_404(db.query(SupportTicket).filter(SupportTicket.id == ticket_id).one_or_none(), "Ticket no encontrado")
    conversation = repository.get_conversation(db, ticket.conversation_id) if ticket.conversation_id else None
    ticket = services.update_chat_ticket_status(db, ticket, conversation, current_user, target_status, payload.note)
    services.audit_admin_chatbot_action(db, request, current_user, event_type=f"ticket.{target_status}", permission="admin.chat_ops.manage", entity_type="SupportTicket", entity_id=ticket.id)
    return SupportTicketRead.model_validate(ticket, from_attributes=True)


@admin_router.get("/fallbacks", response_model=list[ChatbotFallbackRead])
def list_fallbacks(reviewed: bool | None = None, limit: int = Query(default=50, ge=1, le=200), offset: int = Query(default=0, ge=0), current_user: User = Depends(require_admin_permission("admin.chatbot.fallbacks.review")), db: Session = Depends(get_db)) -> list[ChatbotFallbackRead]:
    return [ChatbotFallbackRead.model_validate(item, from_attributes=True) for item in repository.list_fallbacks(db, reviewed=reviewed, limit=limit, offset=offset)]


@admin_router.get("/settings", response_model=list[ChatbotSettingRead])
def list_settings(current_user: User = Depends(require_admin_permission("admin.chatbot.settings.manage")), db: Session = Depends(get_db)) -> list[ChatbotSettingRead]:
    return [ChatbotSettingRead.model_validate(item, from_attributes=True) for item in repository.list_settings(db)]


@admin_router.patch("/settings/{key}", response_model=ChatbotSettingRead)
def update_setting(key: str, payload: ChatbotSettingUpdate, request: Request, current_user: User = Depends(require_admin_permission("admin.chatbot.settings.manage")), db: Session = Depends(get_db)) -> ChatbotSettingRead:
    item = repository.upsert_setting(db, key=key, value=payload.value, actor_id=current_user.id)
    services.audit_admin_chatbot_action(db, request, current_user, event_type="chatbot.settings.updated", permission="admin.chatbot.settings.manage", entity_type="ChatbotSetting", entity_id=key)
    return ChatbotSettingRead.model_validate(item, from_attributes=True)


@admin_router.post("/test", response_model=ChatTestResponse)
async def chat_test(
    payload: ChatTestRequest,
) -> ChatTestResponse:
    if not settings.chatbot_ai_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="CHATBOT_AI_API_KEY no está configurado en el backend. Agrega la clave al archivo .env y reinicia el servidor.",
        )
    model = payload.model or settings.chatbot_ai_model or "claude-haiku-4-5-20251001"
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": settings.chatbot_ai_api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": model,
                "max_tokens": 1024,
                "system": payload.system,
                "messages": [{"role": m.role, "content": m.content} for m in payload.messages],
            },
        )
    if not response.is_success:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Anthropic API respondió con error {response.status_code}.")
    data = response.json()
    content = data["content"][0]["text"]
    return ChatTestResponse(content=content, model=model)
