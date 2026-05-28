from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.admin.dependencies import require_admin_permission
from app.modules.chatbot import repository, services
from app.modules.chatbot.schemas import (
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
