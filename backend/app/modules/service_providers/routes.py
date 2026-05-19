from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.service_providers.models import ServiceCategory
from app.modules.service_providers.schemas import ServiceProviderRead
from app.modules.service_providers.services import get_service_provider, list_service_providers, list_service_providers_by_category

router = APIRouter()


@router.get("", response_model=list[ServiceProviderRead])
def list_providers(db: Session = Depends(get_db)):
    return list_service_providers(db)


@router.get("/category/{category}", response_model=list[ServiceProviderRead])
def list_providers_by_category(category: ServiceCategory, db: Session = Depends(get_db)):
    return list_service_providers_by_category(db, category)


@router.get("/{provider_id}", response_model=ServiceProviderRead)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    return get_service_provider(db, provider_id)
