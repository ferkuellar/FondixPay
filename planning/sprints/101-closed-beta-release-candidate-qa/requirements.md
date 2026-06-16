# Sprint 101 — Closed Beta, Release Candidate & QA

## Why This Sprint Exists

This is the final gate before production launch. Sprint 101 validates the full FONDIXPAY system with real invited users in a controlled environment. Every closure sprint (091–100) must be complete before this sprint begins. If any SEV-1 or SEV-2 bug is found, it is fixed in this sprint before the Go/No-Go vote.

## Prerequisites (all must be complete)

- Sprint 091: Auth rate limit hardening
- Sprint 092: Alembic migration discipline
- Sprint 093: Staging environment
- Sprint 094: Tekae confirmation contract
- Sprint 095: Tekae confirmation implementation
- Sprint 096: Service catalog production activation
- Sprint 097: Landing legal & support closure
- Sprint 098: Mobile store readiness (at minimum internal testing track)
- Sprint 099: Observability & runbook
- Sprint 100: Security & abuse hardening

## Scope

1. **Closed beta — invited users:**
   - Invite 5–20 real users (team members, trusted testers, or early adopters)
   - Beta users must complete a real end-to-end flow: OTP login → service selection → Tekae payment (sandbox credentials) → confirmation → receipt → history
   - No support intervention allowed for tasks that are in the core user path — if a user cannot complete without help, that is a bug

2. **End-to-end QA checklist execution:**
   - All screens navigate without crash on iOS and Android
   - OTP flow: request, receive, verify, re-request (rate limit behavior)
   - Service list loads with correct coverage for user's state
   - Tekae session: opens browser, payment completes, confirmation detected, receipt generated
   - Receipt: accessible in payment history, shows correct service and date
   - Profile: payment methods (empty state), saved services
   - Support: opens `fondixpay.com/soporte` link
   - Sign out and back in: session restored correctly
   - CRM: admin can view all beta user payments, receipts, and audit logs

3. **Load test:**
   - 50 concurrent OTP requests: p95 < 2 seconds, zero 500 errors
   - 20 concurrent Tekae session requests: p95 < 5 seconds
   - Tools: `locust` or `k6`

4. **Security regression:**
   - OWASP Top 10 manual check (abbreviated checklist)
   - Confirm OTP brute-force rate limit works in staging
   - Confirm JWT refresh rotation works correctly
   - Confirm Tekae session rate limit (3/user/hour) fires correctly

5. **Rollback drill:**
   - Operator sets `TEKAE_ENABLED=false` in staging while a session is in progress
   - Verify: mobile shows graceful error ("servicio no disponible"), no crash, no data loss
   - Operator re-enables: new session works correctly

6. **Bug triage:**
   - SEV-1 bugs (crashes, data loss, auth bypass, payment data exposure): must be fixed before Go/No-Go
   - SEV-2 bugs (broken flows, wrong data, UX blockers): must be fixed before Go/No-Go
   - SEV-3 bugs (cosmetic, minor UX): logged as follow-up; do not block launch

7. **Go/No-Go vote:**
   - Product owner sign-off
   - Security sign-off (all SEV-1/SEV-2 closed)
   - Legal sign-off (legal pages approved and live)
   - All three required before Sprint 102

## Out of Scope

- New features
- Production credentials (that is Sprint 102)
- Marketing or public launch announcement
