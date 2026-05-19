from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field

from app.modules.service_providers.schemas import ServiceProviderRead


class UserServiceCreate(BaseModel):
    provider_id: int
    alias: str = Field(min_length=2, max_length=80)
    reference: str = Field(min_length=4, max_length=80)


class UserServiceRead(BaseModel):
    id: int
    alias: str
    reference: str
    amount_due: Decimal
    due_date: date | None = None
    provider: ServiceProviderRead

    model_config = {"from_attributes": True}

