import re
from collections import defaultdict

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.audit.services import create_audit_event
from app.modules.service_catalog import repository
from app.modules.service_catalog.constants import (
    CapabilityStatus,
    CoverageStatus,
    PUBLIC_COVERAGE_DISCLAIMER,
    STATE_NAMES,
)
from app.modules.service_catalog.models import ServiceCatalogItem
from app.modules.service_catalog.schemas import (
    CoverageMapResponse,
    CoverageMapServiceRead,
    CoverageMapStateRead,
    ProviderServiceCapabilityRead,
    ServiceCatalogItemAdminRead,
    ServiceCatalogItemRead,
    ServiceCoverageByStateRead,
    ServicePayableValidationRead,
)
from app.modules.service_catalog.seed_data import CATEGORIES, MAP_SERVICES, NATIONAL_REFERENCE_COUNT, NATIONAL_REFERENCE_SERVICES, national_states


def slugify(value: str) -> str:
    normalized = value.lower()
    normalized = normalized.replace(".", "")
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    return normalized.strip("-")


def seed_service_catalog_from_static_data(db: Session) -> dict[str, int]:
    if repository.count_items(db) > 0:
        return {"created": 0, "skipped": repository.count_items(db)}

    categories = {}
    for category_data in CATEGORIES:
        category = repository.get_category_by_code(db, category_data["code"]) or repository.create_category(db, **category_data)
        categories[category.code] = category

    created = 0
    for index, item_data in enumerate(NATIONAL_REFERENCE_SERVICES, start=1):
        item = _create_seed_item(
            db,
            categories[item_data["category"]].id,
            display_name=item_data["name"],
            category_code=item_data["category"],
            icon_key=item_data["icon_key"],
            is_national=True,
            sort_order=index,
            source="excel_reference",
            states=national_states(),
        )
        created += 1 if item else 0

    for index, item_data in enumerate(MAP_SERVICES, start=100):
        item = _create_seed_item(
            db,
            categories[item_data["category"]].id,
            display_name=item_data["name"],
            category_code=item_data["category"],
            icon_key=_icon_for_category(item_data["category"]),
            is_national=False,
            sort_order=index,
            source="coverage_map_reference",
            states=item_data["states"],
        )
        created += 1 if item else 0

    repository.create_source(
        db,
        source_name="FondixPay coverage references",
        source_type="static_seed",
        file_path="landing/assets/coverage_map.html; FONDIXPAY_Cobertura_Por_Estado.xlsx",
        version="phase-10f",
        notes="Conservative seed. Coverage reference only; not provider confirmation.",
    )
    db.commit()
    return {"created": created, "skipped": 0}


def _create_seed_item(
    db: Session,
    category_id: int,
    *,
    display_name: str,
    category_code: str,
    icon_key: str,
    is_national: bool,
    sort_order: int,
    source: str,
    states: list[str],
) -> ServiceCatalogItem | None:
    slug = slugify(display_name)
    if repository.get_item_by_slug(db, slug):
        return None
    item = repository.create_item(
        db,
        category_id=category_id,
        display_name=display_name,
        slug=slug,
        icon_key=icon_key,
        description="Coverage reference seed. Not confirmed as payable.",
        is_national=is_national,
        coverage_status=CoverageStatus.PROVIDER_PENDING.value,
        visible_on_landing=True,
        visible_on_mobile=False,
        payable_in_mobile=False,
        visible_on_admin=True,
        show_in_coverage_map=True,
        is_mock=True,
        sort_order=sort_order,
    )
    for state_code in states:
        repository.add_coverage(
            db,
            service_catalog_item_id=item.id,
            state_code=state_code,
            state_name=STATE_NAMES.get(state_code, state_code),
            coverage_status=CoverageStatus.PROVIDER_PENDING.value,
            source=source,
            notes=f"{display_name} coverage reference for {category_code}; not payment confirmation.",
        )
    repository.add_capability(
        db,
        service_catalog_item_id=item.id,
        provider_name="prontipagos_future",
        provider_service_code=None,
        supports_reference_validation=False,
        supports_amount_lookup=False,
        supports_payment_execution=False,
        supports_receipt=False,
        currency="MXN",
        status=CapabilityStatus.TO_CONFIRM.value,
        notes="Seeded reference only. Provider capability is not confirmed.",
    )
    return item


def _icon_for_category(category: str) -> str:
    return {
        "electricity": "electricity",
        "telecom": "internet",
        "mobile_topup_or_bill": "phone",
        "gas": "gas",
        "water": "water",
        "government": "other",
        "streaming_or_subscription_future": "other",
    }.get(category, "other")


def ensure_seeded(db: Session) -> None:
    if repository.count_items(db) == 0:
        seed_service_catalog_from_static_data(db)


def list_categories(db: Session):
    ensure_seeded(db)
    return repository.list_categories(db)


def list_mobile_services(
    db: Session,
    *,
    state_code: str | None = None,
    category: str | None = None,
    include_unavailable: bool = False,
) -> list[ServiceCatalogItemRead]:
    ensure_seeded(db)
    items = repository.list_mobile_payable_services(
        db,
        state_code=state_code,
        category=category,
        include_unavailable=include_unavailable,
    )
    return [serialize_public_item(item) for item in items]


def get_service_catalog_item(db: Session, item_id: int) -> ServiceCatalogItem:
    ensure_seeded(db)
    item = repository.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    return item


def validate_service_is_payable(db: Session, service_id: int, state_code: str | None = None) -> ServicePayableValidationRead:
    item = get_service_catalog_item(db, service_id)
    reasons: list[str] = []
    if not item.payable_in_mobile:
        reasons.append("payable_in_mobile is false")
    if item.coverage_status != CoverageStatus.AVAILABLE.value:
        reasons.append(f"coverage_status is {item.coverage_status}")
    if state_code:
        state_status = next((coverage.coverage_status for coverage in item.coverage_states if coverage.state_code == state_code.upper()), None)
        if state_status != CoverageStatus.AVAILABLE.value:
            reasons.append(f"state coverage is {state_status or 'missing'}")
    confirmed_capabilities = [
        capability
        for capability in item.capabilities
        if capability.status == CapabilityStatus.CONFIRMED.value
        and capability.supports_payment_execution
        and capability.supports_receipt
    ]
    if not confirmed_capabilities:
        reasons.append("provider capability is not confirmed for payment execution and receipt")
    return ServicePayableValidationRead(service_id=item.id, state_code=state_code, payable=len(reasons) == 0, reasons=reasons)


def serialize_public_item(item: ServiceCatalogItem) -> ServiceCatalogItemRead:
    return ServiceCatalogItemRead(
        id=item.id,
        display_name=item.display_name,
        slug=item.slug,
        category=item.category.code,
        icon_key=item.icon_key,
        description=item.description,
        is_national=item.is_national,
        coverage_status=item.coverage_status,
        visible_on_mobile=item.visible_on_mobile,
        payable_in_mobile=item.payable_in_mobile,
        reference_only=not item.payable_in_mobile,
        disclaimer=PUBLIC_COVERAGE_DISCLAIMER,
    )


def serialize_admin_item(item: ServiceCatalogItem) -> ServiceCatalogItemAdminRead:
    public = serialize_public_item(item).model_dump()
    return ServiceCatalogItemAdminRead(
        **public,
        visible_on_landing=item.visible_on_landing,
        visible_on_admin=item.visible_on_admin,
        show_in_coverage_map=item.show_in_coverage_map,
        is_mock=item.is_mock,
        coverage_states=[
            ServiceCoverageByStateRead.model_validate(coverage, from_attributes=True) for coverage in item.coverage_states
        ],
        provider_capabilities=[
            ProviderServiceCapabilityRead.model_validate(capability, from_attributes=True)
            for capability in item.capabilities
        ],
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


def build_coverage_map(db: Session, state_code: str | None = None) -> CoverageMapResponse:
    ensure_seeded(db)
    coverage_rows = []
    if state_code:
        coverage_rows = repository.list_coverage_by_state(db, state_code)
    else:
        for code in STATE_NAMES:
            coverage_rows.extend(repository.list_coverage_by_state(db, code))

    grouped: dict[str, list[CoverageMapServiceRead]] = defaultdict(list)
    payable_grouped: dict[str, list[CoverageMapServiceRead]] = defaultdict(list)
    for coverage in coverage_rows:
        service = coverage.service
        if not service.visible_on_landing or not service.show_in_coverage_map:
            continue
        item = CoverageMapServiceRead(
            id=service.id,
            display_name=service.display_name,
            slug=service.slug,
            category=service.category.code,
            coverage_status=coverage.coverage_status,
            payable_in_mobile=service.payable_in_mobile,
            reference_only=not service.payable_in_mobile,
        )
        grouped[coverage.state_code].append(item)
        if validate_service_is_payable(db, service.id, coverage.state_code).payable:
            payable_grouped[coverage.state_code].append(item)

    states = [
        CoverageMapStateRead(
            state_code=code,
            state_name=STATE_NAMES[code],
            reference_services=grouped.get(code, []),
            payable_services=payable_grouped.get(code, []),
            disclaimer=PUBLIC_COVERAGE_DISCLAIMER,
        )
        for code in STATE_NAMES
        if not state_code or code == state_code.upper()
    ]
    return CoverageMapResponse(
        states=states,
        national_reference_count=NATIONAL_REFERENCE_COUNT,
        disclaimer=PUBLIC_COVERAGE_DISCLAIMER,
    )


def audit_catalog_event(db: Session, *, event_type: str, actor_id: int | str | None = None, entity_id: int | str | None = None, metadata: dict | None = None) -> None:
    create_audit_event(
        db,
        event_type=event_type,
        actor_type="ADMIN" if actor_id else "SYSTEM",
        actor_id=actor_id,
        entity_type="ServiceCatalogItem" if entity_id else "ServiceCatalog",
        entity_id=entity_id,
        metadata=metadata,
    )

