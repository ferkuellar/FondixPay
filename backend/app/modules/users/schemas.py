from pydantic import BaseModel


class UserRead(BaseModel):
    id: int
    phone: str
    name: str | None = None

    model_config = {"from_attributes": True}

