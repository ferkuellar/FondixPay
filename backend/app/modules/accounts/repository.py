from sqlalchemy.orm import Session

from app.modules.accounts.models import Account, BalanceSnapshot, Movement


def get_for_user(db: Session, user_id: int) -> Account | None:
    return db.query(Account).filter(Account.user_id == user_id).first()


def create_account(db: Session, account: Account) -> Account:
    db.add(account)
    db.flush()
    return account


def create_snapshot(db: Session, snapshot: BalanceSnapshot) -> BalanceSnapshot:
    db.add(snapshot)
    db.flush()
    return snapshot


def get_latest_snapshot(db: Session, account_id: int) -> BalanceSnapshot | None:
    return (
        db.query(BalanceSnapshot)
        .filter(BalanceSnapshot.account_id == account_id)
        .order_by(BalanceSnapshot.as_of.desc(), BalanceSnapshot.id.desc())
        .first()
    )


def create_movement(db: Session, movement: Movement) -> Movement:
    db.add(movement)
    db.flush()
    return movement


def list_movements(db: Session, account_id: int) -> list[Movement]:
    return db.query(Movement).filter(Movement.account_id == account_id).order_by(Movement.created_at.desc()).all()
