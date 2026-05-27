from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.modules.service_catalog.constants import CoverageStatus
from app.modules.service_catalog.models import (
    CoverageMapSource,
    ProviderServiceCapability,
    ServiceCatalogItem,
    ServiceCategory,
    ServiceCoverageByState,
)


def list_categories(db: Session) -> list[ServiceCategory]:
    return db.query(ServiceCategory).order_by(ServiceCategory.display_order, ServiceCategory.name).all()


def get_category_by_code(db: Session, code: str) -> ServiceCategory | None:
    return db.query(ServiceCategory).filter(func.lower(ServiceCategory.code) == code.lower()).first()


def create_category(db: Session, **values) -> ServiceCategory:
    category = ServiceCategory(**values)
    db.add(category)
    db.flush()
    return category


def get_item_by_slug(db: Session, slug: str) -> ServiceCatalogItem | None:
    return db.query(ServiceCatalogItem).filter(ServiceCatalogItem.slug == slug).first()


def get_item(db: Session, item_id: int) -> ServiceCatalogItem | None:
    return (
        db.query(ServiceCatalogItem)
        .options(joinedload(ServiceCatalogItem.category), joinedload(ServiceCatalogItem.capabilities))
        .filter(ServiceCatalogItem.id == item_id)
        .first()
    )


def create_item(db: Session, **values) -> ServiceCatalogItem:
    item = ServiceCatalogItem(**values)
    db.add(item)
    db.flush()
    return item


def add_coverage(db: Session, **values) -> ServiceCoverageByState:
    coverage = ServiceCoverageByState(**values)
    db.add(coverage)
    db.flush()
    return coverage


def add_capability(db: Session, **values) -> ProviderServiceCapability:
    capability = ProviderServiceCapability(**values)
    db.add(capability)
    db.flush()
    return capability


def list_mobile_payable_services(
    db: Session,
    *,
    state_code: str | None = None,
    category: str | None = None,
    include_unavailable: bool = False,
) -> list[ServiceCatalogItem]:
    query = db.query(ServiceCatalogItem).options(joinedload(ServiceCatalogItem.category), joinedload(ServiceCatalogItem.capabilities))
    if not include_unavailable:
        query = query.filter(
            ServiceCatalogItem.visible_on_mobile.is_(True),
            ServiceCatalogItem.payable_in_mobile.is_(True),
            ServiceCatalogItem.coverage_status == CoverageStatus.AVAILABLE.value,
        )
    else:
        query = query.filter(ServiceCatalogItem.visible_on_mobile.is_(True))
    if category:
        query = query.join(ServiceCategory).filter(ServiceCategory.code == category)
    if state_code:
        query = query.join(ServiceCoverageByState).filter(ServiceCoverageByState.state_code == state_code.upper())
        if not include_unavailable:
            query = query.filter(ServiceCoverageByState.coverage_status == CoverageStatus.AVAILABLE.value)
    return query.order_by(ServiceCatalogItem.sort_order, ServiceCatalogItem.display_name).all()


def list_landing_coverage_services(db: Session, *, state_code: str | None = None) -> list[ServiceCatalogItem]:
    query = db.query(ServiceCatalogItem).options(joinedload(ServiceCatalogItem.category), joinedload(ServiceCatalogItem.coverage_states))
    query = query.filter(ServiceCatalogItem.visible_on_landing.is_(True), ServiceCatalogItem.show_in_coverage_map.is_(True))
    if state_code:
        query = query.join(ServiceCoverageByState).filter(ServiceCoverageByState.state_code == state_code.upper())
    return query.order_by(ServiceCatalogItem.sort_order, ServiceCatalogItem.display_name).all()


def list_admin_catalog(
    db: Session,
    *,
    status: str | None = None,
    category: str | None = None,
    state_code: str | None = None,
    limit: int = 100,
    offset: int = 0,
) -> list[ServiceCatalogItem]:
    query = db.query(ServiceCatalogItem).options(
        joinedload(ServiceCatalogItem.category),
        joinedload(ServiceCatalogItem.coverage_states),
        joinedload(ServiceCatalogItem.capabilities),
    )
    query = query.filter(ServiceCatalogItem.visible_on_admin.is_(True))
    if status:
        query = query.filter(ServiceCatalogItem.coverage_status == status)
    if category:
        query = query.join(ServiceCategory).filter(ServiceCategory.code == category)
    if state_code:
        query = query.join(ServiceCoverageByState).filter(ServiceCoverageByState.state_code == state_code.upper())
    return query.order_by(ServiceCatalogItem.sort_order, ServiceCatalogItem.display_name).offset(offset).limit(limit).all()


def list_coverage_by_state(db: Session, state_code: str) -> list[ServiceCoverageByState]:
    return (
        db.query(ServiceCoverageByState)
        .options(joinedload(ServiceCoverageByState.service).joinedload(ServiceCatalogItem.category))
        .filter(ServiceCoverageByState.state_code == state_code.upper())
        .order_by(ServiceCoverageByState.state_name)
        .all()
    )


def count_items(db: Session) -> int:
    return db.query(ServiceCatalogItem).count()


def create_source(db: Session, **values) -> CoverageMapSource:
    source = CoverageMapSource(**values)
    db.add(source)
    db.flush()
    return source

