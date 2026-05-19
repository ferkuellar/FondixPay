from sqlalchemy.orm import Session

from app.modules.users.models import User


def get_by_phone(db: Session, phone: str) -> User | None:
    return db.query(User).filter(User.phone == phone).first()


def get_or_create_by_phone(db: Session, phone: str) -> User:
    user = get_by_phone(db, phone)
    if user:
        return user
    user = User(phone=phone)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

