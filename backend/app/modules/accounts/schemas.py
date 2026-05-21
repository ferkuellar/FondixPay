from datetime import datetime

from pydantic import BaseModel

from app.modules.accounts.models import AccountStatus, MovementDirection, MovementType


DEMO_BALANCE_LABEL = "Saldo demo"
DEMO_BALANCE_DISCLAIMER = "Este saldo es simulado y no representa dinero real."


class AccountRead(BaseModel):
    id: int
    account_type: str
    status: AccountStatus
    currency: str
    is_demo: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class BalanceRead(BaseModel):
    account_id: int
    available_minor: int
    pending_minor: int
    held_minor: int
    simulated_minor: int
    currency: str
    is_demo: bool
    is_real_money: bool
    label: str
    disclaimer: str
    as_of: datetime


class MovementRead(BaseModel):
    id: int
    movement_type: MovementType
    direction: MovementDirection
    amount_minor: int
    currency: str
    status: str
    description: str
    is_demo: bool
    created_at: datetime

    model_config = {"from_attributes": True}
