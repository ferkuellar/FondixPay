from pydantic import BaseModel


class ServiceProviderRead(BaseModel):
    id: int
    name: str
    category: str

    model_config = {"from_attributes": True}

