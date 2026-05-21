from sqlalchemy.orm import Session

from app.core.request_context import RequestContext
from app.modules.accounts import repository
from app.modules.accounts.models import Account, BalanceSnapshot, Movement, MovementDirection, MovementType
from app.modules.accounts.schemas import BalanceRead, DEMO_BALANCE_DISCLAIMER, DEMO_BALANCE_LABEL
from app.modules.audit.services import create_audit_event

DEMO_CURRENCY = "MXN"
DEMO_SEED_MINOR = 250000


def get_or_create_demo_account(db: Session, user_id: int, context: RequestContext | None = None) -> Account:
    account = repository.get_for_user(db, user_id)
    if account is not None:
        return account

    account = repository.create_account(db, Account(user_id=user_id, currency=DEMO_CURRENCY, is_demo=True))
    snapshot = repository.create_snapshot(
        db,
        BalanceSnapshot(
            account=account,
            available_minor=DEMO_SEED_MINOR,
            pending_minor=0,
            held_minor=0,
            simulated_minor=DEMO_SEED_MINOR,
            currency=DEMO_CURRENCY,
            source="demo_seed",
            is_demo=True,
            is_real_money=False,
        ),
    )
    movement = repository.create_movement(
        db,
        Movement(
            account=account,
            movement_type=MovementType.DEMO_CREDIT,
            direction=MovementDirection.CREDIT,
            amount_minor=DEMO_SEED_MINOR,
            currency=DEMO_CURRENCY,
            description="Crédito demo inicial para validar saldo y movimientos.",
            is_demo=True,
        ),
    )
    _audit_created_demo_account(db, user_id, account, snapshot, movement, context)
    db.commit()
    db.refresh(account)
    return account


def get_demo_balance(db: Session, user_id: int, context: RequestContext | None = None) -> BalanceRead:
    account = get_or_create_demo_account(db, user_id, context)
    snapshot = repository.get_latest_snapshot(db, account.id)
    if snapshot is None:
        raise RuntimeError("Demo account missing balance snapshot")

    create_audit_event(
        db,
        event_type="balance.viewed",
        actor_type="USER",
        actor_id=user_id,
        entity_type="account",
        entity_id=account.id,
        metadata={"is_demo": True, "currency": snapshot.currency},
        **_context_kwargs(context),
    )
    db.commit()
    return BalanceRead(
        account_id=account.id,
        available_minor=snapshot.available_minor,
        pending_minor=snapshot.pending_minor,
        held_minor=snapshot.held_minor,
        simulated_minor=snapshot.simulated_minor,
        currency=snapshot.currency,
        is_demo=snapshot.is_demo,
        is_real_money=snapshot.is_real_money,
        label=DEMO_BALANCE_LABEL,
        disclaimer=DEMO_BALANCE_DISCLAIMER,
        as_of=snapshot.as_of,
    )


def list_demo_movements(db: Session, user_id: int, context: RequestContext | None = None) -> list[Movement]:
    account = get_or_create_demo_account(db, user_id, context)
    return repository.list_movements(db, account.id)


def _audit_created_demo_account(
    db: Session,
    user_id: int,
    account: Account,
    snapshot: BalanceSnapshot,
    movement: Movement,
    context: RequestContext | None,
) -> None:
    create_audit_event(
        db,
        event_type="account.created",
        actor_type="SYSTEM",
        actor_id=user_id,
        entity_type="account",
        entity_id=account.id,
        metadata={"is_demo": True, "currency": account.currency},
        **_context_kwargs(context),
    )
    create_audit_event(
        db,
        event_type="balance.snapshot_created",
        actor_type="SYSTEM",
        actor_id=user_id,
        entity_type="balance_snapshot",
        entity_id=snapshot.id,
        metadata={"account_id": account.id, "is_demo": True, "source": snapshot.source},
        **_context_kwargs(context),
    )
    create_audit_event(
        db,
        event_type="movement.created",
        actor_type="SYSTEM",
        actor_id=user_id,
        entity_type="movement",
        entity_id=movement.id,
        metadata={"account_id": account.id, "movement_type": movement.movement_type.value, "is_demo": True},
        **_context_kwargs(context),
    )


def _context_kwargs(context: RequestContext | None) -> dict[str, str | None]:
    if context is None:
        return {}
    return {
        "request_id": context.request_id,
        "correlation_id": context.correlation_id,
        "ip_address": context.ip_address,
        "user_agent": context.user_agent,
    }
