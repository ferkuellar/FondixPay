from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.service_providers import repository
from app.modules.service_providers.models import ServiceCategory, ServiceProvider


def list_service_providers(db: Session) -> list[ServiceProvider]:
    repository.seed_default_providers(db)
    return repository.list_active(db)


def get_service_provider(db: Session, provider_id: int) -> ServiceProvider:
    repository.seed_default_providers(db)
    provider = repository.get_active_by_id(db, provider_id)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    return provider


def list_service_providers_by_category(db: Session, category: ServiceCategory) -> list[ServiceProvider]:
    repository.seed_default_providers(db)
    return repository.list_active_by_category(db, category.value)
