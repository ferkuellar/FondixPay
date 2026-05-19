from pydantic import BaseModel

from app.modules.service_providers.models import IntegrationType, ServiceCategory


class ServiceProviderRead(BaseModel):
    id: int
    name: str
    display_name: str
    category: ServiceCategory
    icon_key: str
    integration_type: IntegrationType
    is_active: bool
    sort_order: int

    model_config = {"from_attributes": True}
