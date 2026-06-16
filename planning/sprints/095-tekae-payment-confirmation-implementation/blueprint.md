# Sprint 095 — Blueprint

## Backend Files

### backend/app/modules/tekae/webhook.py (new)
- `POST /api/payments/tekae/webhook` route
- Signature verification function (per Sprint 094 contract)
- `process_tekae_event(payload: dict)` → upsert `tekae_events`, update `payments.tekae_state`

### backend/app/modules/tekae/states.py (new)
- `TekaeState` enum: `pending`, `confirmed`, `failed`, `timeout`
- `transition_payment(session_ref, new_state)` — updates payment, writes audit event, triggers receipt on `confirmed`

### backend/alembic/versions/20260616_0014_tekae_payment_states.py (new)
- Add `tekae_state varchar(32)` to `payments`
- Add `tekae_event_ref varchar` nullable to `payments`
- Create `tekae_events` table

### backend/app/modules/payments/routes.py
- Add `GET /payments/{session_ref}/status` → returns `{state, session_ref, updated_at}`

### backend/app/modules/tekae/polling.py (new, if polling needed)
- Background `asyncio` task registered on app startup
- Polls Tekae for sessions in `tekae_pending` older than 2 minutes, every 5 minutes
- Max 6 attempts before setting `tekae_timeout`

## Mobile Files

### mobile/src/screens/payments/TekaeSessionScreen.tsx
- After `WebBrowser.openBrowserAsync()` returns, start polling `GET /payments/{sessionRef}/status`
- Poll every 5 seconds for up to 5 minutes
- Render confirmed / failed / timeout state views

### mobile/src/types/ (update existing types)
- Add `TekaePaymentStatus` type: `{ state: "pending" | "confirmed" | "failed" | "timeout", sessionRef: string, updatedAt: string }`

## Receipt Integration

- In `states.py`, on `tekae_confirmed`: call existing `create_receipt(payment_id, ...)` function (from existing receipt module)
- Receipt must include Tekae session_ref and event_ref

## Staging Test Checklist

1. Set `TEKAE_ENABLED=true` in staging `.env`
2. Run `alembic upgrade head` to apply new migrations
3. Mobile: open app pointed at staging API
4. Complete OTP login, select service, initiate Tekae session
5. Complete sandbox payment in Tekae portal
6. Verify: webhook received (or poll found confirmed), payment state = `tekae_confirmed`, receipt created
7. Set `TEKAE_ENABLED=false` in staging after smoke test
