from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.users.schemas import UserRead

router = APIRouter()


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user

