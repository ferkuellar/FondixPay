from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class NotificationRead(BaseModel):
    id: int
    type: str
    title: str
    message: str
    entity_type: str | None = None
    entity_id: str | None = None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


NotificationChannel = Literal["whatsapp"]
NotificationType = Literal["payment_receipt"]


class NotificationPreferenceRead(BaseModel):
    id: int
    user_id: int
    channel: str
    notification_type: str
    enabled: bool
    consented_at: datetime | None = None
    revoked_at: datetime | None = None
    source: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class NotificationPreferenceUpdate(BaseModel):
    channel: NotificationChannel = "whatsapp"
    notification_type: NotificationType = "payment_receipt"
    enabled: bool
    source: str = Field(default="settings", max_length=80)


class NotificationDeliveryRead(BaseModel):
    id: int
    user_id: int
    channel: str
    notification_type: str
    template_name: str
    entity_type: str
    entity_id: str
    recipient_hash: str
    recipient_masked: str
    status: str
    idempotency_key: str
    provider_name: str | None = None
    provider_message_id: str | None = None
    error_code: str | None = None
    error_message_safe: str | None = None
    metadata_json: dict | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

