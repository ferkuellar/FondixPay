# Sprint 091 — Auth Rate Limit Hardening

## Why This Sprint Exists

Blocks B-01 and B-02 (both SEV-1). OTP is stored in a process-memory dict — a backend restart clears all pending OTPs and multi-instance deployments cannot share OTP state. There is also no rate limiting on `/auth/request-code` or `/auth/verify-code`, making brute-force OTP attacks trivial. This sprint must complete before any real user pilot.

## Blockers Closed

- B-01: OTP stored in process memory (`_otp_store: dict` in `backend/app/modules/auth/models.py`)
- B-02: No rate limiting on auth endpoints
- B-10: `POST /payments/sandbox` accessible without environment gate

## Scope

1. **OTP persistence backend:** Replace `_otp_store` in-memory dict with a durable store.
   - Preferred: Redis (`REDIS_URL` env var). Fallback if Redis unavailable: PostgreSQL `otp_tokens` table with `phone`, `otp_hash`, `expires_at`, `attempts` columns.
   - Store OTP as `bcrypt` or `sha256` hash — never plaintext.
   - TTL: 5 minutes (unchanged).
   - Decision: which backend (Redis vs. DB) must be recorded as ADR-195.

2. **OTP request rate limit:** Max 3 OTP requests per phone number per 10-minute window. Returns 429 with `Retry-After` header on breach.

3. **OTP verify rate limit + lockout:** Max 5 failed verification attempts per phone per 10-minute window. On 5th failure, account locks for 15 minutes — subsequent requests return 429 with lockout message.

4. **Sandbox endpoint gate:** `POST /payments/sandbox` must return 404 or 403 when `APP_ENV=production` or `APP_ENV=staging`. A missing `APP_ENV` defaults to "development" (safe default).

5. **Tests:** New tests for OTP persistence survival (stop/start mock), rate limit 429 responses, lockout behavior, sandbox gate.

## Out of Scope

- JWT refresh tokens (Sprint 100)
- Redis infrastructure provisioning (Terraform) — use in-process Redis mock in tests; production Redis is an ops decision
- Any mobile UI changes

## Constraint

`TEKAE_ENABLED` remains false. No payment flow changes.
