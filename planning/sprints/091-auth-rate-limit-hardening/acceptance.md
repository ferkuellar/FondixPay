# Sprint 091 — Acceptance Criteria

## B-01: OTP Persistence

- [ ] `backend/app/modules/auth/models.py` has no `_otp_store` dict
- [ ] OTP is stored as a hash, not plaintext, in the chosen backend
- [ ] OTP lookup works after a simulated process restart (test: save OTP, clear module state, retrieve OTP from store)
- [ ] OTP TTL of 5 minutes enforced in the persistence layer
- [ ] ADR-195 recorded in `planning/DECISIONS.md`

## B-02: Auth Rate Limiting

- [ ] 4th OTP request for same phone within 10 minutes returns HTTP 429
- [ ] 429 response includes `Retry-After` header and Spanish message
- [ ] 6th OTP verify attempt (after 5 failures) returns HTTP 429 with lockout message
- [ ] Lockout lasts 15 minutes; verify returns 429 during lockout even for correct OTP
- [ ] Rate limit resets after window expires (11th minute allows new request)

## B-10: Sandbox Gate

- [ ] `POST /payments/sandbox` with `APP_ENV=production` returns 403 or 404
- [ ] `POST /payments/sandbox` with `APP_ENV=staging` returns 403 or 404
- [ ] `POST /payments/sandbox` with `APP_ENV=development` (default) still works

## General

- [ ] All 202+ existing backend tests still pass
- [ ] New auth rate limit tests: minimum 8 new test cases
- [ ] TypeScript mobile: 0 errors (no mobile changes expected)
- [ ] `TEKAE_ENABLED` remains false
