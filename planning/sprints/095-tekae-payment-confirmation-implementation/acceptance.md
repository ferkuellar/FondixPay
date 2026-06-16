# Sprint 095 — Acceptance Criteria

## Backend

- [ ] `POST /api/payments/tekae/webhook` endpoint exists (if webhook mechanism)
- [ ] Webhook signature verification implemented per contract
- [ ] Webhook payload validation rejects malformed events (400)
- [ ] Payment state transitions correctly: pending → confirmed, pending → failed, pending → timeout
- [ ] `tekae_events` table migration exists and stores all received events
- [ ] Receipt record created on `tekae_confirmed` state transition
- [ ] Audit events written for each payment state transition
- [ ] Polling background task handles `tekae_pending` sessions (if applicable)
- [ ] `GET /api/payments/{session_ref}/status` endpoint returns current state

## Mobile

- [ ] After Tekae browser closes, `TekaeSessionScreen` polls payment status
- [ ] Shows "Verificando tu pago..." during polling
- [ ] Shows success state when `tekae_confirmed`
- [ ] Shows failure state when `tekae_failed` or `tekae_timeout`
- [ ] Payment history screen shows `tekae_pending` state honestly (not as success)

## Staging Smoke Test

- [ ] `TEKAE_ENABLED=true` activated in staging with sandbox credentials
- [ ] End-to-end sandbox payment: OTP login → service selection → Tekae session → browser payment → confirmation detected
- [ ] Receipt accessible after confirmation
- [ ] `TEKAE_ENABLED` remains `false` in production

## Tests

- [ ] Webhook receiver: minimum 5 test cases (valid event, invalid signature, malformed payload, confirmed transition, failed transition)
- [ ] Status polling endpoint: 3 test cases (pending, confirmed, timeout)
- [ ] All 202+ existing backend tests still pass

## Documentation

- [ ] `docs/TEKAE_CONFIRMATION_CONTRACT.md` updated with any deviations found during implementation
