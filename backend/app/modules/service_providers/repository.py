from sqlalchemy.orm import Session

from app.modules.service_providers.models import ServiceProvider

DEFAULT_PROVIDERS = [
    {"name": "CFE", "category": "Luz"},
    {"name": "Telmex", "category": "Internet"},
    {"name": "Telcel", "category": "Telefono"},
    {"name": "Agua", "category": "Agua"},
    {"name": "Gas", "category": "Gas"},
    {"name": "Izzi", "category": "Internet / cable"},
]


def seed_default_providers(db: Session) -> None:
    for item in DEFAULT_PROVIDERS:
        exists = db.query(ServiceProvider).filter(ServiceProvider.name == item["name"]).first()
        if not exists:
            db.add(ServiceProvider(**item))
    db.commit()


def list_active(db: Session) -> list[ServiceProvider]:
    seed_default_providers(db)
    return db.query(ServiceProvider).filter(ServiceProvider.is_active.is_(True)).order_by(ServiceProvider.name).all()

