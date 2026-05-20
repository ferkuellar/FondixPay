from datetime import datetime

from pydantic import BaseModel


class AuditEventRead(BaseModel):
    id: int
    event_type: str
    actor_type: str
    actor_id: str | None
    entity_type: str | None
    entity_id: str | None
    result: str
    request_id: str | None
    correlation_id: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
