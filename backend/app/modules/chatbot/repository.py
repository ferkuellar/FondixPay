from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.modules.chatbot.models import (
    ChatbotConversation,
    ChatbotConversationEvent,
    ChatbotFallback,
    ChatbotFaq,
    ChatbotIntent,
    ChatbotInternalNote,
    ChatbotKnowledgeEntry,
    ChatbotMessage,
    ChatbotSetting,
)


def create_faq(db: Session, item: ChatbotFaq) -> ChatbotFaq:
    db.add(item)
    db.flush()
    return item


def list_faqs(db: Session, *, include_inactive: bool = True) -> list[ChatbotFaq]:
    query = db.query(ChatbotFaq)
    if not include_inactive:
        query = query.filter(ChatbotFaq.is_active.is_(True))
    return query.order_by(ChatbotFaq.priority.asc(), ChatbotFaq.id.desc()).all()


def get_faq(db: Session, item_id: int) -> ChatbotFaq | None:
    return db.query(ChatbotFaq).filter(ChatbotFaq.id == item_id).one_or_none()


def find_faq_by_normalized_question(db: Session, normalized_question: str) -> ChatbotFaq | None:
    return (
        db.query(ChatbotFaq)
        .filter(ChatbotFaq.normalized_question == normalized_question, ChatbotFaq.is_active.is_(True))
        .order_by(ChatbotFaq.priority.asc(), ChatbotFaq.id.desc())
        .first()
    )


def create_intent(db: Session, item: ChatbotIntent) -> ChatbotIntent:
    db.add(item)
    db.flush()
    return item


def list_intents(db: Session, *, include_inactive: bool = True) -> list[ChatbotIntent]:
    query = db.query(ChatbotIntent)
    if not include_inactive:
        query = query.filter(ChatbotIntent.is_active.is_(True))
    return query.order_by(ChatbotIntent.id.desc()).all()


def get_intent(db: Session, item_id: int) -> ChatbotIntent | None:
    return db.query(ChatbotIntent).filter(ChatbotIntent.id == item_id).one_or_none()


def create_knowledge(db: Session, item: ChatbotKnowledgeEntry) -> ChatbotKnowledgeEntry:
    db.add(item)
    db.flush()
    return item


def list_knowledge(db: Session, *, include_inactive: bool = True) -> list[ChatbotKnowledgeEntry]:
    query = db.query(ChatbotKnowledgeEntry)
    if not include_inactive:
        query = query.filter(ChatbotKnowledgeEntry.is_active.is_(True))
    return query.order_by(ChatbotKnowledgeEntry.id.desc()).all()


def get_knowledge(db: Session, item_id: int) -> ChatbotKnowledgeEntry | None:
    return db.query(ChatbotKnowledgeEntry).filter(ChatbotKnowledgeEntry.id == item_id).one_or_none()


def search_knowledge(db: Session, terms: list[str]) -> ChatbotKnowledgeEntry | None:
    if not terms:
        return None
    filters = []
    for term in terms[:8]:
        filters.append(ChatbotKnowledgeEntry.title.contains(term))
        filters.append(ChatbotKnowledgeEntry.content.contains(term))
    return (
        db.query(ChatbotKnowledgeEntry)
        .filter(ChatbotKnowledgeEntry.is_active.is_(True), or_(*filters))
        .order_by(ChatbotKnowledgeEntry.id.desc())
        .first()
    )


def get_or_create_conversation(db: Session, *, session_id: str, source: str, page_url: str | None) -> tuple[ChatbotConversation, bool]:
    conversation = (
        db.query(ChatbotConversation)
        .filter(ChatbotConversation.session_id == session_id, ChatbotConversation.source == source)
        .order_by(ChatbotConversation.id.desc())
        .first()
    )
    if conversation is not None:
        return conversation, False
    conversation = ChatbotConversation(session_id=session_id, source=source, page_url=page_url)
    db.add(conversation)
    db.flush()
    return conversation, True


def add_message(db: Session, message: ChatbotMessage) -> ChatbotMessage:
    db.add(message)
    db.flush()
    return message


def add_fallback(db: Session, fallback: ChatbotFallback) -> ChatbotFallback:
    db.add(fallback)
    db.flush()
    return fallback


def list_conversations(
    db: Session,
    *,
    limit: int,
    offset: int,
    status: str | None = None,
    severity: str | None = None,
    source: str | None = None,
    assigned_to: int | None = None,
    has_ticket: bool | None = None,
    escalated: bool | None = None,
    q: str | None = None,
) -> list[ChatbotConversation]:
    query = db.query(ChatbotConversation)
    if status:
        query = query.filter(ChatbotConversation.status == status)
    if severity:
        query = query.filter(ChatbotConversation.severity == severity)
    if source:
        query = query.filter(ChatbotConversation.source == source)
    if assigned_to is not None:
        query = query.filter(ChatbotConversation.assigned_to == assigned_to)
    if has_ticket is True:
        query = query.filter(ChatbotConversation.linked_ticket_id.is_not(None))
    elif has_ticket is False:
        query = query.filter(ChatbotConversation.linked_ticket_id.is_(None))
    if escalated is True:
        query = query.filter(ChatbotConversation.escalation_status.in_(["human_queue", "ticket_required", "escalated"]))
    elif escalated is False:
        query = query.filter(ChatbotConversation.escalation_status == "none")
    if q:
        like = f"%{q}%"
        query = query.filter(or_(ChatbotConversation.session_id.contains(q), ChatbotConversation.detected_intent.like(like)))
    return query.order_by(ChatbotConversation.last_message_at.desc()).offset(offset).limit(limit).all()


def get_conversation(db: Session, item_id: int) -> ChatbotConversation | None:
    return db.query(ChatbotConversation).filter(ChatbotConversation.id == item_id).one_or_none()


def add_conversation_event(db: Session, event: ChatbotConversationEvent) -> ChatbotConversationEvent:
    db.add(event)
    db.flush()
    return event


def add_internal_note(db: Session, note: ChatbotInternalNote) -> ChatbotInternalNote:
    db.add(note)
    db.flush()
    return note


def list_fallbacks(db: Session, *, reviewed: bool | None, limit: int, offset: int) -> list[ChatbotFallback]:
    query = db.query(ChatbotFallback)
    if reviewed is not None:
        query = query.filter(ChatbotFallback.reviewed.is_(reviewed))
    return query.order_by(ChatbotFallback.id.desc()).offset(offset).limit(limit).all()


def list_settings(db: Session) -> list[ChatbotSetting]:
    return db.query(ChatbotSetting).order_by(ChatbotSetting.key.asc()).all()


def get_setting(db: Session, key: str) -> ChatbotSetting | None:
    return db.query(ChatbotSetting).filter(ChatbotSetting.key == key).one_or_none()


def upsert_setting(db: Session, *, key: str, value: str | None, actor_id: int) -> ChatbotSetting:
    item = get_setting(db, key)
    if item is None:
        item = ChatbotSetting(key=key, value=value, updated_by=actor_id)
        db.add(item)
    else:
        item.value = value
        item.updated_by = actor_id
    db.flush()
    return item


def get_setting_value(db: Session, key: str, default: str = "") -> str:
    item = get_setting(db, key)
    if item is None or item.value is None:
        return default
    return item.value
