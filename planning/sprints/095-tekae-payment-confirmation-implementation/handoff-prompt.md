# Sprint 095 — Builder Handoff Prompt

You are implementing Sprint 095: Tekae Payment Confirmation Implementation for FONDIXPAY.

## Context

Sprint 094 documented the Tekae payment confirmation contract. This sprint implements it. After a user completes a Tekae payment in the browser, FONDIXPAY must detect that confirmation and update the payment record.

**Sprint 094 must be complete** — read `docs/TEKAE_CONFIRMATION_CONTRACT.md` before starting.  
**Sprint 093 must be complete** — staging environment needed for smoke test.  
**Sprint 092 must be complete** — Alembic discipline must be in place.

## What To Build

1. **Webhook receiver** (or polling, per contract): `POST /api/payments/tekae/webhook`
   - Verify signature per Sprint 094 contract
   - Find the payment by `session_ref` in the webhook payload
   - Update `payments.tekae_state` to `confirmed` / `failed`
   - Create `tekae_events` record
   - On `confirmed`: generate receipt

2. **Alembic migration**: add `tekae_state` column to `payments`, create `tekae_events` table

3. **Payment status endpoint**: `GET /api/payments/{session_ref}/status`
   - Returns `{state, session_ref, updated_at}`
   - Requires auth (current user must own the session)

4. **Polling task** (if needed per contract): background task checking `tekae_pending` sessions

5. **Mobile status polling**: after `TekaeSessionScreen` browser closes, poll the status endpoint every 5 seconds for up to 5 minutes

## Files to Read First

- `docs/TEKAE_CONFIRMATION_CONTRACT.md` — the confirmed Tekae webhook/polling spec (created in Sprint 094)
- `backend/app/modules/tekae/service.py` — existing session creation with `session_ref`
- `backend/app/modules/tekae/routes.py` — existing Tekae routes
- `backend/app/modules/payments/routes.py` — existing payment routes
- `mobile/src/screens/payments/TekaeSessionScreen.tsx` — current screen implementation
- `backend/app/modules/receipts/` — existing receipt module to understand create_receipt

## Constraints

- `TEKAE_ENABLED=true` allowed ONLY in staging for smoke test; must remain `false` in dev and production
- All 202+ existing backend tests must pass after changes
- Minimum 8 new test cases for webhook + state machine
- No CRM admin changes in this sprint
- Do not hardcode production Tekae credentials

## Staging Smoke Test (Required)

After implementation, run the full end-to-end flow in staging:
1. OTP login → service → Tekae session
2. Complete sandbox payment in Tekae portal
3. Verify payment state transitions to `tekae_confirmed`
4. Verify receipt is created
5. Set `TEKAE_ENABLED=false` in staging after test

Report: files changed, migration names, test count, and staging smoke test result.
