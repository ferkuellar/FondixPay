from datetime import datetime

from pydantic import BaseModel, Field


ChatSeverity = str


class PublicChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    sessionId: str = Field(min_length=8, max_length=120)
    source: str = Field(default="landing", max_length=40)
    pageUrl: str | None = Field(default=None, max_length=500)


class PublicChatResponse(BaseModel):
    reply: str
    conversationId: str
    confidence: str


class ChatbotFaqBase(BaseModel):
    question: str = Field(min_length=3, max_length=500)
    answer: str = Field(min_length=3, max_length=4000)
    category: str = Field(default="general", max_length=80)
    priority: int = Field(default=100, ge=0, le=9999)
    is_active: bool = True


class ChatbotFaqCreate(ChatbotFaqBase):
    pass


class ChatbotFaqUpdate(BaseModel):
    question: str | None = Field(default=None, min_length=3, max_length=500)
    answer: str | None = Field(default=None, min_length=3, max_length=4000)
    category: str | None = Field(default=None, max_length=80)
    priority: int | None = Field(default=None, ge=0, le=9999)
    is_active: bool | None = None


class ChatbotFaqRead(ChatbotFaqBase):
    id: int
    normalized_question: str
    created_at: datetime
    updated_at: datetime
    created_by: int | None = None
    updated_by: int | None = None

    model_config = {"from_attributes": True}


class ChatbotIntentBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    example_phrases: list[str] = Field(default_factory=list)
    response: str = Field(min_length=3, max_length=4000)
    severity_hint: str = Field(default="low", max_length=40)
    is_active: bool = True


class ChatbotIntentCreate(ChatbotIntentBase):
    pass


class ChatbotIntentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    example_phrases: list[str] | None = None
    response: str | None = Field(default=None, min_length=3, max_length=4000)
    severity_hint: str | None = Field(default=None, max_length=40)
    is_active: bool | None = None


class ChatbotIntentRead(ChatbotIntentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: int | None = None
    updated_by: int | None = None

    model_config = {"from_attributes": True}


class ChatbotKnowledgeBase(BaseModel):
    title: str = Field(min_length=3, max_length=180)
    content: str = Field(min_length=3, max_length=5000)
    category: str = Field(default="general", max_length=80)
    tags: list[str] = Field(default_factory=list)
    is_active: bool = True


class ChatbotKnowledgeCreate(ChatbotKnowledgeBase):
    pass


class ChatbotKnowledgeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=180)
    content: str | None = Field(default=None, min_length=3, max_length=5000)
    category: str | None = Field(default=None, max_length=80)
    tags: list[str] | None = None
    is_active: bool | None = None


class ChatbotKnowledgeRead(ChatbotKnowledgeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: int | None = None
    updated_by: int | None = None

    model_config = {"from_attributes": True}


class ChatbotSettingRead(BaseModel):
    key: str
    value: str | None = None
    updated_at: datetime
    updated_by: int | None = None

    model_config = {"from_attributes": True}


class ChatbotSettingUpdate(BaseModel):
    value: str | None = Field(default=None, max_length=4000)


class ChatbotMessageRead(BaseModel):
    id: int
    sender_type: str
    message_text_masked: str
    raw_message_stored: bool
    classification: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatbotConversationEventRead(BaseModel):
    id: int
    event_type: str
    actor_id: int | None = None
    before_json: dict | None = None
    after_json: dict | None = None
    note: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatbotInternalNoteRead(BaseModel):
    id: int
    author_id: int
    body: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatbotConversationRead(BaseModel):
    id: int
    session_id: str
    source: str
    page_url: str | None = None
    started_at: datetime
    last_message_at: datetime
    status: str
    detected_intent: str | None = None
    confidence: str | None = None
    severity: str = "SEV-4"
    suggested_severity: str | None = None
    classification_reason: str | None = None
    ai_suggested_severity: str | None = None
    linked_ticket_id: int | None = None
    assigned_to: int | None = None
    escalation_status: str = "none"
    reviewed_at: datetime | None = None
    reviewed_by: int | None = None
    messages: list[ChatbotMessageRead] = Field(default_factory=list)
    events: list[ChatbotConversationEventRead] = Field(default_factory=list)
    internal_notes: list[ChatbotInternalNoteRead] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class ChatbotFallbackRead(BaseModel):
    id: int
    conversation_id: int
    message_id: int | None = None
    message_text_masked: str
    reason: str
    reviewed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatOperationsMetrics(BaseModel):
    total_conversations: int
    active_conversations: int
    bot_resolved_conversations: int
    human_escalated_conversations: int
    tickets_created: int
    assigned_tickets: int
    unassigned_tickets: int
    sla_breached_tickets: int
    fallback_rate: float
    average_first_response_minutes: float | None = None
    average_resolution_minutes: float | None = None
    csat_average: float | None = None
    tickets_by_severity: dict[str, int] = Field(default_factory=dict)
    tickets_by_status: dict[str, int] = Field(default_factory=dict)
    top_intents: list[dict] = Field(default_factory=list)
    top_unresolved_questions: list[dict] = Field(default_factory=list)


class ChatOperationAssign(BaseModel):
    assigned_to: int | None = None


class ChatOperationSeverityUpdate(BaseModel):
    severity: str = Field(pattern=r"^SEV-[1-5]$")
    note: str | None = Field(default=None, max_length=1000)


class ChatOperationNoteCreate(BaseModel):
    body: str = Field(min_length=1, max_length=4000)


class ChatOperationTicketCreate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=180)
    summary: str | None = Field(default=None, max_length=4000)
    priority: str | None = Field(default=None, max_length=40)
    assigned_to: int | None = None


class ChatOperationTicketStatusUpdate(BaseModel):
    note: str | None = Field(default=None, max_length=4000)


class ChatTestMessage(BaseModel):
    role: str = Field(pattern=r"^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class ChatTestRequest(BaseModel):
    system: str = Field(default="", max_length=10000)
    messages: list[ChatTestMessage] = Field(min_length=1, max_length=20)
    model: str = Field(default="claude-haiku-4-5-20251001", max_length=100)


class ChatTestResponse(BaseModel):
    content: str
    model: str
