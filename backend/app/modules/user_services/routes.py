from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.user_services import repository
from app.modules.user_services.schemas import UserServiceCreate, UserServiceRead
from app.modules.user_services.services import create_user_service

router = APIRouter()


@router.get("", response_model=list[UserServiceRead])
def list_services(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return repository.list_for_user(db, current_user.id)


@router.post("", response_model=UserServiceRead, status_code=status.HTTP_201_CREATED)
def add_service(
    payload: UserServiceCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_user_service(db, current_user.id, payload, get_request_context(request))


@router.get("/{service_id}", response_model=UserServiceRead)
def get_service(service_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = repository.get_for_user(db, service_id, current_user.id)
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    return service

