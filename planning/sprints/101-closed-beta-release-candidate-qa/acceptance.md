# Sprint 101 — Acceptance Criteria

## Beta Execution

- [ ] Minimum 5 invited users completed a full end-to-end flow without support intervention
- [ ] All completed flows included: OTP login, service selection, Tekae payment (sandbox), confirmation, receipt
- [ ] Beta user feedback collected and triaged

## QA Checklist

- [ ] All mobile screens navigable without crash on iOS (real device or TestFlight) and Android (Play internal testing)
- [ ] OTP flow: request, verify, resend, rate limit — all work as expected
- [ ] Service list: at least 3 services visible for MX-CMX (or user's state)
- [ ] Tekae session: browser opens, payment completes, confirmation detected within 5 minutes
- [ ] Receipt: generated and accessible in payment history after confirmation
- [ ] Payment history: shows all payment states (pending, confirmed, failed) with correct UI
- [ ] Sign out / sign in: session correctly restored
- [ ] CRM: admin sees all beta user payments, receipts, audit logs

## Load Test

- [ ] 50 concurrent OTP requests: p95 < 2 seconds
- [ ] Zero 500 errors under 50 concurrent OTP load
- [ ] 20 concurrent Tekae session requests: p95 < 5 seconds

## Security Regression

- [ ] OTP brute-force: 6th attempt returns 429 with lockout (staging test)
- [ ] JWT refresh rotation: confirmed working (refresh → new token → old invalid)
- [ ] Tekae rate limit: 4th session/hour returns 429 (staging test)
- [ ] No sensitive values (OTP, JWT, portalUrl, Tekae credentials) in any log or Sentry event

## Rollback Drill

- [ ] TEKAE_ENABLED=false applied in staging while session in progress
- [ ] Mobile shows graceful error, no crash, no data loss
- [ ] TEKAE_ENABLED=true restored; next session works

## Bug Status

- [ ] Zero open SEV-1 bugs
- [ ] Zero open SEV-2 bugs
- [ ] All SEV-3 bugs logged in issue tracker for post-launch follow-up

## Go/No-Go

- [ ] Product owner sign-off: documented in sprint completion notes with date
- [ ] Security sign-off: documented in sprint completion notes with date
- [ ] Legal sign-off: documented in sprint completion notes with date (confirms legal pages live)
- [ ] All three obtained before Sprint 102 begins
