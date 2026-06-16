# Sprint 100 — Security & Abuse Hardening

## Why This Sprint Exists

Sprint 091 closed the most acute auth gap (OTP rate limiting + persistence). This sprint closes the remaining SEV-2/SEV-3 security gaps: JWT has no refresh rotation or server-side revocation, HTTP security headers are missing, and various abuse vectors (Tekae session flooding, CORS misconfiguration) remain open. This sprint gates entry into closed beta (Sprint 101).

## Scope

1. **JWT refresh token rotation:**
   - Add `POST /auth/refresh` endpoint: accepts `refresh_token` (stored in `HttpOnly` cookie or passed in body), returns new `access_token` + rotated `refresh_token`
   - `refresh_tokens` table: `token_hash`, `user_id`, `issued_at`, `expires_at`, `revoked_at`, `device_hint`
   - Access token TTL reduced from 60 minutes to 15 minutes in production
   - Refresh token TTL: 30 days
   - On refresh: old refresh token invalidated immediately (rotation)
   - ADR-196 must record the model choices

2. **Server-side token revocation:**
   - `POST /auth/logout` (authenticated): marks current refresh token as revoked in `refresh_tokens` table
   - `GET /auth/sessions` (authenticated): lists active sessions (device hint, issued_at, last_used)
   - Revoked access tokens: short TTL (15 min) means they expire naturally; no need for an access token blocklist

3. **HTTP security headers (backend):**
   - Apply via FastAPI middleware on all responses:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains` (only when `APP_ENV=production`)
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: geolocation=(), microphone=(), camera=()`

4. **CORS hardening:**
   - In staging/production: only explicit allowed origins (no wildcard)
   - Remove `http://localhost:*` from staging/production `CORS_ORIGINS`
   - `validate_security_settings` must fail if `CORS_ORIGINS` includes wildcard in production

5. **Tekae session rate limiting:**
   - `POST /api/payments/tekae/session` — max 3 sessions per user per hour
   - Returns 429 with `Retry-After: 3600` on breach
   - Rate limit key: user_id (not IP, since IP can be shared)

6. **Vulnerability scan:**
   - Run `pip-audit` in backend — zero critical/high CVEs
   - Run `npm audit --production` in mobile — zero critical/high CVEs
   - Address any found vulnerabilities; document unfixable ones with rationale

7. **Mobile: refresh token support:**
   - `authStore.ts`: store refresh token in `SecureStore` alongside access token
   - `api.ts`: on 401, attempt `POST /auth/refresh` before invoking `onUnauthorized`
   - If refresh succeeds: retry original request with new access token
   - If refresh fails: invoke `onUnauthorized` (sign out)

## Out of Scope

- PCI DSS formal certification
- mTLS between services
- WAF (Web Application Firewall) — future

## Prerequisite

Sprint 091 (auth rate limit) must be complete. Sprint 093 (staging) must be complete for validation.
