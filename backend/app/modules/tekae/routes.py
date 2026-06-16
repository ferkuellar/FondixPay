from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.tekae.service import TekaeSessionError, create_session
from app.modules.users.models import User

router = APIRouter()


class TekaeSessionRequest(BaseModel):
    menu: str | None = None
    categoria: str | None = None
    carrier: str | None = None
    blockview: bool = False


class TekaeSessionResponse(BaseModel):
    portalUrl: str
    expiresIn: int
    sessionRef: str


@router.post(
    "/payments/tekae/session",
    response_model=TekaeSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Iniciar sesión Tekae SSO",
    tags=["tekae"],
)
def start_tekae_session(
    body: TekaeSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    if not settings.tekae_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Servicio de pago no disponible. Intenta más tarde.",
        )
    try:
        return create_session(
            db,
            current_user,
            menu=body.menu,
            categoria=body.categoria,
            carrier=body.carrier,
            blockview=body.blockview,
        )
    except TekaeSessionError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
