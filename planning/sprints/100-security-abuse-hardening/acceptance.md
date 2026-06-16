# Sprint 100 — Acceptance Criteria

## JWT Refresh Rotation

- [ ] `POST /auth/refresh` endpoint exists and returns new access + refresh token pair
- [ ] Old refresh token is invalidated after rotation (cannot be reused)
- [ ] `refresh_tokens` table migration exists
- [ ] Access token TTL is 15 minutes in production (`APP_ENV=production`)
- [ ] Refresh token TTL is 30 days
- [ ] ADR-196 recorded in `planning/DECISIONS.md`

## Server-Side Revocation

- [ ] `POST /auth/logout` invalidates current refresh token in DB
- [ ] Revoked refresh token cannot be used to get new access token (401 returned)
- [ ] `GET /auth/sessions` returns list of active sessions for current user

## HTTP Security Headers

- [ ] All backend responses include `X-Content-Type-Options: nosniff`
- [ ] All backend responses include `X-Frame-Options: DENY`
- [ ] All backend responses include `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Strict-Transport-Security` header present when `APP_ENV=production`

## CORS

- [ ] `CORS_ORIGINS` wildcard (`*`) causes `validate_security_settings` to fail in production
- [ ] Staging `CORS_ORIGINS` contains no localhost entries

## Tekae Rate Limit

- [ ] 4th Tekae session request within 1 hour for same user returns 429
- [ ] Rate limit key is user_id, not IP

## Vulnerability Scan

- [ ] `pip-audit` on backend: zero critical or high severity CVEs
- [ ] `npm audit --production` on mobile: zero critical or high severity CVEs
- [ ] Any unfixable CVEs documented with justification

## Mobile Refresh Flow

- [ ] `authStore.ts` persists refresh token in SecureStore
- [ ] `api.ts` retries 401 via refresh before signing out user
- [ ] If refresh fails, user is signed out gracefully

## General

- [ ] All 202+ existing backend tests pass
- [ ] Minimum 8 new test cases: refresh token rotation, revocation, CORS validation, Tekae rate limit
