# Sprint 086 — Blueprint

## New Files

```
backend/app/modules/tekae/
├── __init__.py
├── config.py          # TekaeConfig from env vars; validates on startup if TEKAE_ENABLED
├── client.py          # HTTP client: cipher_data(), generate_token_ciphered()
├── service.py         # create_session(): orchestrates 2-step flow, builds portal URL
└── routes.py          # POST /api/payments/tekae/session
```

## config.py

```python
from pydantic_settings import BaseSettings

class TekaeConfig(BaseSettings):
    TEKAE_ENABLED: bool = False
    TEKAE_BASE_URL: str = ""
    TEKAE_RESPONSIVE_BASE_URL: str = ""
    TEKAE_BEARER: str = ""
    TEKAE_UID: str = ""
    TEKAE_PASSWORD: str = ""
    TEKAE_PORTAL_UID: str = ""
    TEKAE_TIMEOUT_SECONDS: int = 10

    def validate_for_runtime(self):
        if not self.TEKAE_ENABLED:
            return
        missing = [f for f in ["TEKAE_BASE_URL","TEKAE_RESPONSIVE_BASE_URL",
                                "TEKAE_BEARER","TEKAE_UID","TEKAE_PASSWORD","TEKAE_PORTAL_UID"]
                   if not getattr(self, f)]
        if missing:
            raise RuntimeError(f"Tekae enabled but missing env vars: {missing}")
```

## client.py

Two functions, no retry logic in this sprint:

```python
async def cipher_data(config, user_email, menu, categoria, carrier, blockview) -> dict:
    # POST {TEKAE_BASE_URL}/tokens/cipherData
    # Returns {"data": "...", "uid": "..."}
    # Raises TekaeClientError on non-201

async def generate_token_ciphered(config, data) -> dict:
    # POST {TEKAE_BASE_URL}/tokens/generateTokenCiphered
    # Returns {"accessToken": "...", "refreshToken": "..."}
    # Raises TekaeClientError on non-201
```

Auth header on both: `Authorization: Bearer {TEKAE_BEARER}`

## service.py

```python
async def create_session(config, db, user, menu, categoria, carrier, blockview) -> dict:
    session_ref = str(uuid4())
    # 1. Write pending audit event
    # 2. cipher_data(user.email, ...)
    # 3. generate_token_ciphered(cipher_result.data)
    # 4. Build portal_url = f"{TEKAE_RESPONSIVE_BASE_URL}/user/{TEKAE_PORTAL_UID}/token/{access_token}"
    # 5. Update audit event to success (session_ref, no token)
    # 6. Return {"portalUrl": portal_url, "expiresIn": 1800, "sessionRef": session_ref}
```

`accessToken` is used only to construct `portalUrl` and is not stored.

## routes.py

```python
@router.post("/api/payments/tekae/session")
async def create_tekae_session(
    body: TekaeSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not tekae_config.TEKAE_ENABLED:
        raise HTTPException(503, "Servicio de pago no disponible. Intenta más tarde.")
    return await create_session(tekae_config, db, current_user, ...)
```

## Audit Event Schema

```python
# event_type: "tekae.session.requested" / "tekae.session.created" / "tekae.session.failed"
# actor_id: user.id
# metadata: {"session_ref": uuid, "menu": ..., "categoria": ..., "carrier": ...}
# NO token, NO portal_url, NO cipher_data in audit metadata
```

## Tests

- `test_tekae_session_disabled`: TEKAE_ENABLED=false → 503
- `test_tekae_session_unauthenticated`: no JWT → 401
- `test_tekae_session_success`: mock cipher_data + generate_token_ciphered → 200 with portalUrl
- `test_tekae_session_cipher_error`: cipher_data raises → 503
- `test_tekae_session_token_error`: generate_token_ciphered raises → 503
- `test_tekae_session_audit_on_success`: audit event written with session_ref, no token
- `test_tekae_session_audit_on_failure`: audit event written on Tekae error

## Registration

Add `tekae_router` to `backend/app/main.py` alongside other routers.

## No Database Migration Needed

All state (session_ref, audit) uses the existing `AuditEvent` table. No new models.
