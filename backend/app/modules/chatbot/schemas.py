from datetime import datetime

from pydantic import BaseModel, Field


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
    messages: list[ChatbotMessageRead] = Field(default_factory=list)

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
