from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.receipts.repository import list_for_user
from app.modules.receipts.schemas import ReceiptRead
from app.modules.users.models import User

router = APIRouter()


@router.get("", response_model=list[ReceiptRead])
def list_receipts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_for_user(db, current_user.id)

