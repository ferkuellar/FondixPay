from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.service_providers.repository import list_active
from app.modules.service_providers.schemas import ServiceProviderRead

router = APIRouter()


@router.get("", response_model=list[ServiceProviderRead])
def list_providers(db: Session = Depends(get_db)):
    return list_active(db)

