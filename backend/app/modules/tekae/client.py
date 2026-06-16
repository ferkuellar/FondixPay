import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

_CIPHER_PATH = "/tokens/cipherData"
_TOKEN_PATH = "/tokens/generateTokenCiphered"


class TekaeClientError(Exception):
    def __init__(self, message: str, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


def _auth_header() -> dict[str, str]:
    return {"Authorization": f"Bearer {settings.tekae_bearer}"}


def cipher_data(
    user_email: str,
    menu: str | None,
    categoria: str | None,
    carrier: str | None,
    blockview: bool,
) -> dict:
    url = f"{settings.tekae_base_url}{_CIPHER_PATH}"
    payload = {
        "UserCustomer": user_email,
        "uid": settings.tekae_uid,
        "password": settings.tekae_password,
        "redirect": False,
        "menu": menu,
        "categoria": categoria,
        "carrier": carrier,
        "blockview": blockview,
    }
    try:
        response = httpx.post(
            url,
            json=payload,
            headers=_auth_header(),
            timeout=settings.tekae_timeout_seconds,
        )
    except httpx.TimeoutException as exc:
        raise TekaeClientError("Tekae cipherData timeout") from exc
    except httpx.RequestError as exc:
        raise TekaeClientError(f"Tekae cipherData connection error: {type(exc).__name__}") from exc

    if response.status_code != 201:
        logger.debug("Tekae cipherData error status=%s", response.status_code)
        raise TekaeClientError("Tekae cipherData failed", status_code=response.status_code)

    return response.json()


def generate_token_ciphered(data: str) -> dict:
    url = f"{settings.tekae_base_url}{_TOKEN_PATH}"
    payload = {"uid": settings.tekae_uid, "data": data}
    try:
        response = httpx.post(
            url,
            json=payload,
            headers=_auth_header(),
            timeout=settings.tekae_timeout_seconds,
        )
    except httpx.TimeoutException as exc:
        raise TekaeClientError("Tekae generateTokenCiphered timeout") from exc
    except httpx.RequestError as exc:
        raise TekaeClientError(f"Tekae generateTokenCiphered connection error: {type(exc).__name__}") from exc

    if response.status_code != 201:
        logger.debug("Tekae generateTokenCiphered error status=%s", response.status_code)
        raise TekaeClientError("Tekae generateTokenCiphered failed", status_code=response.status_code)

    return response.json()
