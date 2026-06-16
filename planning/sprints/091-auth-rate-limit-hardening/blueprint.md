# Sprint 091 — Blueprint

## Files to Change

### backend/app/modules/auth/models.py
- Remove `_otp_store: dict[str, tuple[str, datetime]] = {}` module-level dict
- Remove `save_otp()`, `get_otp()`, `delete_otp()` functions that use the dict
- Add new `OtpStore` abstraction (either Redis client or SQLAlchemy model)
- Hash OTP value before storage; compare via hash on verify

### backend/app/modules/auth/routes.py
- Apply rate limit decorator/middleware to `POST /auth/request-code`: 3 req/phone/10min
- Apply rate limit + lockout to `POST /auth/verify-code`: 5 attempts/phone/10min
- Return structured 429 response with `Retry-After` and `message` in Spanish

### backend/app/modules/payments/routes.py (line ~1)
- Add env gate: if `settings.app_env in ("production", "staging")`, sandbox endpoint returns 403

### backend/app/core/config.py
- Add `REDIS_URL: str = ""` setting (empty = use DB OTP backend)
- Add `app_env: str = "development"` setting (sourced from `APP_ENV`)

### backend/app/core/rate_limit.py
- Extend to support auth-specific rate limiting with phone-based keys (not IP)
- Separate bucket TTLs for OTP request vs. verify paths

### If OTP backend = PostgreSQL:
### backend/app/modules/auth/ (new file: otp_store.py)
- `OtpToken` SQLAlchemy model: `phone`, `otp_hash`, `expires_at`, `attempts`, `locked_until`
- Alembic migration for `otp_tokens` table

### backend/tests/test_auth_rate_limit.py (new file)
- Test OTP request rate limit (3 req → 429 on 4th)
- Test OTP verify lockout (5 wrong → locked)
- Test OTP hash — plaintext not stored
- Test sandbox endpoint returns 403 in production env
- Test OTP verify returns success after correct hash comparison

## Architecture Decision Required

Before implementation: record ADR-195 (OTP persistence backend: Redis vs. PostgreSQL). If Redis, document that `REDIS_URL` must be set in staging/production.

## Deployment Note

If choosing Redis: `REDIS_URL` must be added to all environment variable documentation. Ops must provision Redis before staging deploy.
