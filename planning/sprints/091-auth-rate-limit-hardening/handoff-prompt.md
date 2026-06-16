# Sprint 091 — Builder Handoff Prompt

You are implementing Sprint 091: Auth Rate Limit Hardening for FONDIXPAY.

## Context

FONDIXPAY is a FastAPI/React Native mobile payments app (Expo 56, Python 3.11, PostgreSQL). The active sprint closes two SEV-1 production blockers:

**B-01:** OTP is currently stored in `_otp_store: dict[str, tuple[str, datetime]] = {}` in `backend/app/modules/auth/models.py`. This is a process-memory-only dict. A backend restart wipes all pending OTPs. Multi-instance deployments cannot share OTP state. Replace it with durable storage.

**B-02:** `POST /auth/request-code` and `POST /auth/verify-code` have zero rate limiting. An attacker can request OTPs indefinitely and brute-force the 6-digit code (1M possibilities, fixed TTL 5min). Add rate limiting and lockout.

**B-10:** `POST /payments/sandbox` is accessible in all environments. Gate it behind `APP_ENV` check.

## What To Build

1. Replace `_otp_store` dict with either:
   - Redis: use `REDIS_URL` env var; use `fakeredis` in tests
   - PostgreSQL: new `otp_tokens` table via Alembic migration; columns: `phone`, `otp_hash`, `expires_at`, `attempts`, `locked_until`
   - Record the decision as ADR-195 in `planning/DECISIONS.md`
   - Hash the OTP before storage (sha256 or bcrypt)

2. Add auth-specific rate limiting (phone-based, not IP-based):
   - OTP request: 3 requests per phone per 10 minutes → 429
   - OTP verify: 5 wrong attempts per phone per 10 minutes → 429 + 15-minute lockout

3. Gate sandbox endpoint: `POST /payments/sandbox` returns 403 when `settings.app_env in ("production", "staging")`

## Files to Read First

- `backend/app/modules/auth/models.py` — current `_otp_store` implementation
- `backend/app/modules/auth/routes.py` — OTP request/verify routes
- `backend/app/modules/payments/routes.py` — sandbox endpoint
- `backend/app/core/config.py` — Settings class
- `backend/app/core/rate_limit.py` — existing rate limiter (chatbot only)
- `backend/tests/test_auth.py` — existing auth test suite

## Constraints

- `TEKAE_ENABLED` must remain false after this sprint
- All 202 existing tests must still pass
- Add minimum 8 new test cases
- No mobile code changes in this sprint
- Do not implement JWT refresh tokens (that is Sprint 100)
- Do not add Redis as a Terraform resource (ops decision, document the env var only)

## Output

Report: files changed, test results (pass count), acceptance criteria met, and ADR-195 text.
