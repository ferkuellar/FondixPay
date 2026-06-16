# Sprint 100 — Blueprint

## Backend Files

### backend/app/modules/auth/models.py
- Add `RefreshToken` SQLAlchemy model: `id`, `token_hash` (sha256), `user_id` FK, `issued_at`, `expires_at`, `revoked_at`, `device_hint`

### backend/alembic/versions/20260616_0016_refresh_tokens.py (new)
- Create `refresh_tokens` table

### backend/app/modules/auth/routes.py
- `POST /auth/refresh`: validate refresh token hash, check not revoked/expired, issue new access + refresh token, mark old token revoked
- `POST /auth/logout`: mark current refresh token revoked (requires valid access token)
- `GET /auth/sessions`: list non-revoked refresh tokens for current user

### backend/app/core/config.py
- `access_token_expire_minutes: int = 15` (reduce from 60 in staging/prod)
- Add `validate_security_settings` check: CORS wildcard → fail

### backend/app/core/security.py
- `create_refresh_token(user_id) -> str` — generate, hash, store in DB, return raw token
- `rotate_refresh_token(raw_token) -> (str, str)` — validate, revoke old, issue new pair

### backend/app/main.py (or middleware.py)
- Add `SecurityHeadersMiddleware` class: injects all required security headers

### backend/app/modules/tekae/routes.py
- Add per-user Tekae session rate limit (3/user/hour)

### backend/tests/test_auth_security.py (new)
- Test refresh rotation
- Test revocation
- Test CORS wildcard validation failure
- Test Tekae rate limit by user_id

## Mobile Files

### mobile/src/store/authStore.ts
- Add `refreshToken: string | null` to state
- `SecureStore.setItemAsync('fondix_pay_refresh_token', refreshToken)`
- `restoreSession`: load both tokens from SecureStore

### mobile/src/services/api.ts
- On 401: check if refreshToken available → call `POST /auth/refresh` → retry original request
- On refresh 401: invoke `onUnauthorized`

### mobile/src/services/authApi.ts
- `refreshTokens(refreshToken: string): Promise<{access_token, refresh_token}>`
