from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.modules.service_providers.models import ServiceProvider
from app.modules.service_providers.seed import DEFAULT_PROVIDERS


def seed_default_providers(db: Session) -> None:
    ensure_catalog_columns(db)
    for item in DEFAULT_PROVIDERS:
        exists = db.query(ServiceProvider).filter(ServiceProvider.name == item["name"]).first()
        legacy_exists = db.query(ServiceProvider).filter(ServiceProvider.display_name == item["display_name"]).first()
        if exists:
            for key, value in item.items():
                setattr(exists, key, value)
        elif legacy_exists:
            for key, value in item.items():
                setattr(legacy_exists, key, value)
        else:
            db.add(ServiceProvider(**item))
    db.commit()


def list_active(db: Session) -> list[ServiceProvider]:
    return db.query(ServiceProvider).filter(ServiceProvider.is_active.is_(True)).order_by(ServiceProvider.sort_order).all()


def get_active_by_id(db: Session, provider_id: int) -> ServiceProvider | None:
    return db.query(ServiceProvider).filter(ServiceProvider.id == provider_id, ServiceProvider.is_active.is_(True)).first()


def list_active_by_category(db: Session, category: str) -> list[ServiceProvider]:
    return (
        db.query(ServiceProvider)
        .filter(ServiceProvider.category == category, ServiceProvider.is_active.is_(True))
        .order_by(ServiceProvider.sort_order)
        .all()
    )


def ensure_catalog_columns(db: Session) -> None:
    inspector = inspect(db.bind)
    existing_columns = {column["name"] for column in inspector.get_columns("service_providers")}
    datetime_type = "TIMESTAMP" if db.bind.dialect.name == "postgresql" else "DATETIME"
    statements = {
        "display_name": "ALTER TABLE service_providers ADD COLUMN display_name VARCHAR(120)",
        "icon_key": "ALTER TABLE service_providers ADD COLUMN icon_key VARCHAR(40) DEFAULT 'other'",
        "integration_type": "ALTER TABLE service_providers ADD COLUMN integration_type VARCHAR(20) DEFAULT 'MOCK'",
        "sort_order": "ALTER TABLE service_providers ADD COLUMN sort_order INTEGER DEFAULT 100",
        "created_at": f"ALTER TABLE service_providers ADD COLUMN created_at {datetime_type}",
        "updated_at": f"ALTER TABLE service_providers ADD COLUMN updated_at {datetime_type}",
    }
    for column_name, statement in statements.items():
        if column_name not in existing_columns:
            db.execute(text(statement))
    db.execute(text("UPDATE service_providers SET display_name = name WHERE display_name IS NULL"))
    db.execute(text("UPDATE service_providers SET icon_key = 'other' WHERE icon_key IS NULL"))
    db.execute(text("UPDATE service_providers SET integration_type = 'MOCK' WHERE integration_type IS NULL"))
    db.execute(text("UPDATE service_providers SET sort_order = 100 WHERE sort_order IS NULL"))
    db.commit()
