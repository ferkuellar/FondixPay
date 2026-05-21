from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.request_context import get_request_context
from app.core.security import get_current_user
from app.modules.audit.services import create_audit_event
from app.modules.receipts.repository import list_for_user
from app.modules.receipts.schemas import ReceiptProofRead, ReceiptRead
from app.modules.receipts.services import build_receipt_proof
from app.modules.users.models import User

router = APIRouter()


@router.get("", response_model=list[ReceiptRead])
def list_receipts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_for_user(db, current_user.id)


@router.get("/{receipt_id}", response_model=ReceiptProofRead)
def get_receipt_detail(
    receipt_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    proof = build_receipt_proof(db, receipt_id, current_user.id)
    context = get_request_context(request)
    create_audit_event(
        db,
        event_type="receipt.viewed",
        actor_type="USER",
        actor_id=current_user.id,
        entity_type="Receipt",
        entity_id=receipt_id,
        metadata={"proof_status": proof.proof_status},
        request_id=context.request_id,
        correlation_id=proof.correlation_id,
    )
    db.commit()
    return proof

