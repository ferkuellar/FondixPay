from sqlalchemy.orm import Session

from app.modules.audit.models import AuditEvent


def create(db: Session, event: AuditEvent) -> AuditEvent:
    db.add(event)
    db.flush()
    return event


def list_by_type(db: Session, event_type: str) -> list[AuditEvent]:
    return db.query(AuditEvent).filter(AuditEvent.event_type == event_type).order_by(AuditEvent.id.asc()).all()
