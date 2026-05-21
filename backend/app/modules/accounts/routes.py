from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.accounts.schemas import AccountRead, BalanceRead, MovementRead
from app.modules.accounts.services import get_demo_balance, get_or_create_demo_account, list_demo_movements
from app.modules.users.models import User

router = APIRouter()


@router.get("", response_model=AccountRead)
def get_account(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_or_create_demo_account(db, current_user.id, get_request_context(request))


@router.get("/balance", response_model=BalanceRead)
def get_balance(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_demo_balance(db, current_user.id, get_request_context(request))


@router.get("/movements", response_model=list[MovementRead])
def get_movements(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_demo_movements(db, current_user.id, get_request_context(request))
