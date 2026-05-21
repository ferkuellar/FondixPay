from datetime import datetime

from pydantic import BaseModel


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

