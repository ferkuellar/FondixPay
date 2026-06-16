# Sprint 100 — Builder Handoff Prompt

You are implementing Sprint 100: Security & Abuse Hardening for FONDIXPAY.

## Context

Sprint 091 added OTP rate limiting and persistence. This sprint adds the remaining security layer: JWT refresh token rotation, server-side revocation, HTTP security headers, CORS hardening, and Tekae session rate limiting. This sprint gates entry into closed beta (Sprint 101).

**Sprint 091 must be complete** (auth baseline).  
**Sprint 093 must be complete** (staging environment for validation).

## What To Build

1. **JWT refresh tokens**: Add `refresh_tokens` table via Alembic. Add `POST /auth/refresh` (returns new access + refresh token, revokes old refresh token). Add `POST /auth/logout` (revokes refresh token). Add `GET /auth/sessions`. Reduce access token TTL to 15 minutes in production.

2. **Security headers middleware**: Add a FastAPI middleware that injects on all responses: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (production only).

3. **CORS hardening**: `validate_security_settings` must reject wildcard CORS in staging/production.

4. **Tekae session rate limit**: max 3 sessions per user per hour on `POST /api/payments/tekae/session`.

5. **Vulnerability scan**: run `pip-audit` and `npm audit --production`; fix all critical/high CVEs; document any that cannot be fixed.

6. **Mobile refresh flow**: update `authStore.ts` to persist `refreshToken` in SecureStore. Update `api.ts` to attempt refresh on 401 before signing out.

## Files to Read First

- `backend/app/modules/auth/routes.py` — current login/OTP endpoints
- `backend/app/modules/auth/models.py` — current auth models (after Sprint 091)
- `backend/app/core/security.py` — `create_access_token`
- `backend/app/core/config.py` — `validate_security_settings`, `access_token_expire_minutes`
- `backend/app/core/rate_limit.py` — existing rate limiter (extend for Tekae)
- `mobile/src/store/authStore.ts` — current auth store
- `mobile/src/services/api.ts` — current `apiRequest` with 401 handler (Sprint 085)
- `backend/alembic/versions/` — find latest migration for `down_revision`

## Constraints

- Access token TTL reduction only applies when `APP_ENV=production` or `staging` — keep 60 min for development
- `TEKAE_ENABLED` remains false
- All 202+ existing backend tests must pass
- Minimum 8 new test cases
- `pip-audit` must return zero critical/high before marking complete

## Output

Report: files changed, migration name, refresh token test results, security header verification (curl output), CORS wildcard rejection confirmed, Tekae rate limit test passed, pip-audit result, npm audit result, ADR-196 text.
