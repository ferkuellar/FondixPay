import logging
from uuid import uuid4

from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.audit.services import create_audit_event
from app.modules.tekae.client import TekaeClientError, cipher_data, generate_token_ciphered
from app.modules.users.models import User

logger = logging.getLogger(__name__)

_TOKEN_TTL_SECONDS = 1800


class TekaeSessionError(Exception):
    pass


def create_session(
    db: Session,
    user: User,
    menu: str | None = None,
    categoria: str | None = None,
    carrier: str | None = None,
    blockview: bool = False,
) -> dict:
    session_ref = str(uuid4())
    user_email = user.email if hasattr(user, "email") and user.email else f"user_{user.id}@fondixpay.internal"

    create_audit_event(
        db,
        event_type="tekae.session.requested",
        actor_type="USER",
        actor_id=user.id,
        metadata={"session_ref": session_ref, "menu": menu, "categoria": categoria, "carrier": carrier},
    )

    try:
        cipher_result = cipher_data(
            user_email=user_email,
            menu=menu,
            categoria=categoria,
            carrier=carrier,
            blockview=blockview,
        )
        token_result = generate_token_ciphered(data=cipher_result["data"])
    except TekaeClientError as exc:
        create_audit_event(
            db,
            event_type="tekae.session.failed",
            actor_type="USER",
            actor_id=user.id,
            result="failure",
            metadata={"session_ref": session_ref, "error": str(exc)},
        )
        raise TekaeSessionError("No se pudo iniciar la sesión con el proveedor de pagos.") from exc

    access_token = token_result["accessToken"]
    portal_url = (
        f"{settings.tekae_responsive_base_url}/user/{settings.tekae_portal_uid}/token/{access_token}"
    )

    create_audit_event(
        db,
        event_type="tekae.session.created",
        actor_type="USER",
        actor_id=user.id,
        result="success",
        metadata={"session_ref": session_ref},
    )

    return {"portalUrl": portal_url, "expiresIn": _TOKEN_TTL_SECONDS, "sessionRef": session_ref}
