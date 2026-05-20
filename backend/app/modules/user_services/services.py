from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.request_context import RequestContext
from app.modules.audit.services import create_audit_event, hash_value
from app.modules.integrations.aggregator_mock.client import AggregatorMockClient
from app.modules.service_providers.models import ServiceProvider
from app.modules.user_services import repository
from app.modules.user_services.models import UserService
from app.modules.user_services.schemas import UserServiceCreate


def create_user_service(
    db: Session,
    user_id: int,
    payload: UserServiceCreate,
    request_context: RequestContext | None = None,
) -> UserService:
    context = request_context or RequestContext()
    provider = db.get(ServiceProvider, payload.provider_id)
    if provider is None:
        create_audit_event(
            db,
            event_type="user_service.validation_failed",
            actor_type="USER",
            actor_id=user_id,
            result="failure",
            metadata={"provider_id": payload.provider_id},
            request_id=context.request_id,
            correlation_id=context.correlation_id,
        )
        db.commit()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no disponible")
    balance = AggregatorMockClient().check_balance(provider.name, payload.reference)
    service = repository.create_for_user(
        db=db,
        user_id=user_id,
        provider_id=provider.id,
        alias=payload.alias,
        reference=payload.reference,
        amount_due=balance.amount_due,
    )
    create_audit_event(
        db,
        event_type="user_service.created",
        actor_type="USER",
        actor_id=user_id,
        entity_type="UserService",
        entity_id=service.id,
        result="success",
        metadata={"provider_id": provider.id, "reference_hash": hash_value(payload.reference)},
        request_id=context.request_id,
        correlation_id=context.correlation_id,
    )
    db.commit()
    db.refresh(service)
    return service

