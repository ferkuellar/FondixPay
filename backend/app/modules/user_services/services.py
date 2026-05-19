from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.integrations.aggregator_mock.client import AggregatorMockClient
from app.modules.service_providers.models import ServiceProvider
from app.modules.user_services import repository
from app.modules.user_services.models import UserService
from app.modules.user_services.schemas import UserServiceCreate


def create_user_service(db: Session, user_id: int, payload: UserServiceCreate) -> UserService:
    provider = db.get(ServiceProvider, payload.provider_id)
    if provider is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no disponible")
    balance = AggregatorMockClient().check_balance(provider.name, payload.reference)
    return repository.create_for_user(
        db=db,
        user_id=user_id,
        provider_id=provider.id,
        alias=payload.alias,
        reference=payload.reference,
        amount_due=balance.amount_due,
    )

