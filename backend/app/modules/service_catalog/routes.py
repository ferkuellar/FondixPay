from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.admin.dependencies import require_admin_permission
from app.modules.service_catalog import repository, services
from app.modules.service_catalog.constants import PUBLIC_COVERAGE_DISCLAIMER
from app.modules.service_catalog.schemas import (
    AdminServiceCatalogListResponse,
    CoverageMapResponse,
    CoverageMapStateRead,
    ServiceCatalogItemAdminRead,
    ServiceCatalogItemRead,
    ServiceCatalogListResponse,
    ServiceCatalogPatch,
    ServiceCategoryRead,
    ServicePayableValidationRead,
)
from app.modules.users.models import User

router = APIRouter()
coverage_router = APIRouter()
admin_router = APIRouter()


@router.get("", response_model=ServiceCatalogListResponse)
def list_service_catalog(
    state_code: str | None = None,
    category: str | None = None,
    include_unavailable: bool = False,
    db: Session = Depends(get_db),
) -> ServiceCatalogListResponse:
    items = services.list_mobile_services(
        db,
        state_code=state_code,
        category=category,
        include_unavailable=include_unavailable,
    )
    return ServiceCatalogListResponse(
        services=items,
        count=len(items),
        reference_only=False,
        payment_availability_not_guaranteed=False,
    )


@router.get("/{service_id}", response_model=ServiceCatalogItemRead)
def get_service_catalog_item(service_id: int, db: Session = Depends(get_db)) -> ServiceCatalogItemRead:
    item = services.get_service_catalog_item(db, service_id)
    validation = services.validate_service_is_payable(db, service_id)
    if not validation.payable or not services.is_public_catalog_item_available(item):
        # Public/mobile detail is intentionally strict: unpayable services are not selectable.
        from fastapi import HTTPException

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no disponible para pago")
    return services.serialize_public_item(item)


@router.get("/{service_id}/payable", response_model=ServicePayableValidationRead)
def validate_service_payable(
    service_id: int,
    state_code: str | None = None,
    db: Session = Depends(get_db),
) -> ServicePayableValidationRead:
    return services.validate_service_is_payable(db, service_id, state_code)


@coverage_router.get("/service-categories", response_model=list[ServiceCategoryRead])
def list_service_categories(db: Session = Depends(get_db)) -> list[ServiceCategoryRead]:
    return [ServiceCategoryRead.model_validate(category, from_attributes=True) for category in services.list_categories(db)]


@coverage_router.get("/coverage-map", response_model=CoverageMapResponse)
def get_coverage_map(request: Request, db: Session = Depends(get_db)) -> CoverageMapResponse:
    result = services.build_coverage_map(db)
    services.audit_catalog_event(
        db,
        event_type="coverage_map.viewed",
        metadata={"path": str(request.url.path), "reference_only": True},
    )
    db.commit()
    return result


@coverage_router.get("/coverage-map/states/{state_code}", response_model=CoverageMapStateRead)
def get_coverage_map_state(state_code: str, request: Request, db: Session = Depends(get_db)) -> CoverageMapStateRead:
    result = services.build_coverage_map(db, state_code=state_code)
    services.audit_catalog_event(
        db,
        event_type="coverage_map.state_selected",
        metadata={"state_code": state_code.upper(), "path": str(request.url.path), "reference_only": True},
    )
    db.commit()
    if not result.states:
        from fastapi import HTTPException

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    return result.states[0]


@admin_router.get("", response_model=AdminServiceCatalogListResponse)
def list_admin_service_catalog(
    request: Request,
    catalog_status: str | None = Query(default=None, alias="status"),
    category: str | None = None,
    state_code: str | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_admin_permission("admin.catalog.view")),
    db: Session = Depends(get_db),
) -> AdminServiceCatalogListResponse:
    services.ensure_seeded(db)
    items = repository.list_admin_catalog(
        db,
        status=catalog_status,
        category=category,
        state_code=state_code,
        limit=limit,
        offset=offset,
    )
    services.audit_catalog_event(
        db,
        event_type="service_catalog.viewed",
        actor_id=current_user.id,
        metadata={"path": str(request.url.path), "status": catalog_status, "category": category, "state_code": state_code},
    )
    db.commit()
    serialized = [services.serialize_admin_item(item) for item in items]
    return AdminServiceCatalogListResponse(services=serialized, count=len(serialized))


@admin_router.get("/{service_id}", response_model=ServiceCatalogItemAdminRead)
def get_admin_service_catalog_item(
    service_id: int,
    current_user: User = Depends(require_admin_permission("admin.catalog.view")),
    db: Session = Depends(get_db),
) -> ServiceCatalogItemAdminRead:
    item = services.get_service_catalog_item(db, service_id)
    services.audit_catalog_event(db, event_type="service_catalog.viewed", actor_id=current_user.id, entity_id=item.id)
    db.commit()
    return services.serialize_admin_item(item)


@admin_router.patch("/{service_id}", response_model=ServiceCatalogItemAdminRead)
def patch_admin_service_catalog_item(
    service_id: int,
    payload: ServiceCatalogPatch,
    current_user: User = Depends(require_admin_permission("admin.catalog.manage")),
    db: Session = Depends(get_db),
) -> ServiceCatalogItemAdminRead:
    item = services.get_service_catalog_item(db, service_id)
    before = {
        "coverage_status": item.coverage_status,
        "visible_on_landing": item.visible_on_landing,
        "visible_on_mobile": item.visible_on_mobile,
        "payable_in_mobile": item.payable_in_mobile,
    }
    values = payload.model_dump(exclude_unset=True)
    requested_payable = values.get("payable_in_mobile")
    if requested_payable is True and not services.validate_service_is_payable(db, service_id).payable:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede marcar como pagable sin coverage_status available y provider capability confirmed.",
        )
    for field in ("visible_on_landing", "visible_on_mobile", "coverage_status"):
        if field in values:
            setattr(item, field, values[field])
    if requested_payable is False:
        item.payable_in_mobile = False
    db.add(item)
    db.flush()
    after = {
        "coverage_status": item.coverage_status,
        "visible_on_landing": item.visible_on_landing,
        "visible_on_mobile": item.visible_on_mobile,
        "payable_in_mobile": item.payable_in_mobile,
    }
    event_type = "service_catalog.coverage_changed"
    if before["visible_on_mobile"] != after["visible_on_mobile"] or before["visible_on_landing"] != after["visible_on_landing"]:
        event_type = "service_catalog.visibility_changed"
    if before["payable_in_mobile"] and not after["payable_in_mobile"]:
        event_type = "service_catalog.item_disabled"
    services.audit_catalog_event(
        db,
        event_type=event_type,
        actor_id=current_user.id,
        entity_id=item.id,
        metadata={"before": before, "after": after, "notes": values.get("notes")},
    )
    db.commit()
    db.refresh(item)
    return services.serialize_admin_item(item)


@admin_router.post("/seed", status_code=status.HTTP_201_CREATED)
def seed_admin_service_catalog(
    current_user: User = Depends(require_admin_permission("admin.catalog.manage")),
    db: Session = Depends(get_db),
) -> dict[str, int | str]:
    result = services.seed_service_catalog_from_static_data(db)
    services.audit_catalog_event(db, event_type="service_catalog.seeded", actor_id=current_user.id, metadata=result)
    db.commit()
    return {"status": "ok", **result, "disclaimer": PUBLIC_COVERAGE_DISCLAIMER}
