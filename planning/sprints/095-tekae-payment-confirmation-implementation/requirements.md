# Sprint 095 — Tekae Payment Confirmation Implementation

## Why This Sprint Exists

Sprint 094 documented the Tekae confirmation contract. This sprint implements it. After this sprint, a completed Tekae payment in sandbox will produce a confirmed payment record, an audit trail, and a receipt in FONDIXPAY.

## Prerequisites

- Sprint 094 complete (contract documented, all design questions resolved)
- Sprint 093 complete (staging environment available for end-to-end test)
- Sprint 092 complete (Alembic migrations in place)

## Scope

1. **Backend webhook receiver** (if Tekae uses webhooks):
   - `POST /api/payments/tekae/webhook` — public endpoint (no auth header, verified by HMAC or Tekae-specific signature)
   - Payload validation against contract-specified schema
   - Link webhook `session_ref` to `payments` record via `tekae_events` table
   - Payment state transitions: `tekae_pending` → `tekae_confirmed` / `tekae_failed`
   - Audit events for each transition

2. **Polling fallback** (if Tekae uses polling or as belt-and-suspenders):
   - Background task: poll Tekae transaction query API for sessions in `tekae_pending` state older than 2 minutes
   - Max poll interval: 5 minutes; max attempts: 6 (30 minutes total)
   - After 30 minutes with no confirmation → mark `tekae_timeout`

3. **DB schema additions** (via Alembic migration):
   - `payments.tekae_state` column: enum or varchar, nullable initially
   - `tekae_events` table: `id`, `session_ref`, `event_type`, `payload` (jsonb), `received_at`

4. **Receipt generation on `tekae_confirmed`:**
   - When payment transitions to `tekae_confirmed`, generate a receipt record
   - Receipt must include: payment date, amount, service, Tekae reference, FONDIXPAY session_ref

5. **Mobile payment status polling:**
   - After `TekaeSessionScreen` returns from browser, mobile should poll `GET /api/payments/{session_ref}/status` for up to 5 minutes
   - Show: "Verificando tu pago..." → "Pago confirmado" / "No pudimos confirmar tu pago"
   - Payment history screen must show `tekae_pending` state honestly

6. **Staging smoke test:**
   - With `TEKAE_ENABLED=true` in staging
   - Complete a sandbox Tekae payment
   - Confirm payment appears as `tekae_confirmed` in backend
   - Confirm receipt is accessible

## Out of Scope

- Production Tekae credentials (Sprint 102)
- CRM admin payment detail for Tekae states (future)
- Reconciliation report (future)

## Constraint

`TEKAE_ENABLED=true` is allowed in staging only after this sprint passes staging smoke test. It remains `false` in production until Sprint 102.
