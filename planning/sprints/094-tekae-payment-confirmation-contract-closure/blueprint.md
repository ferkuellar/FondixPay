# Sprint 094 — Blueprint

This sprint produces documents, not code. The following files must be created or updated.

## Files to Create

### docs/TEKAE_CONFIRMATION_CONTRACT.md
Template structure:
```markdown
# Tekae Payment Confirmation Contract

## Mechanism: Webhook / Polling / Both

### Webhook (if applicable)
- Endpoint FONDIXPAY must expose: POST /api/payments/tekae/webhook
- Tekae sends: [payload schema here]
- Signature verification: [HMAC key, header name, algorithm]
- Retry behavior: [how many times, interval]

### Polling (if applicable)
- Tekae API endpoint: GET /transactions/{ref}
- Request headers: same Bearer auth as session endpoints
- Response fields: [schema here]
- Polling interval and max attempts recommended: [here]

## Payment States
| State | Tekae value | FONDIXPAY internal state | User message (ES) |
|-------|-------------|--------------------------|-------------------|
| ...   | ...         | ...                      | ...               |

## Receipt Trigger
Receipt is generated when: [confirmed state reached via webhook/poll]
Fields from Tekae for receipt: [list]

## Identifiers
- session_ref (FONDIXPAY UUID) maps to Tekae field: [field name]
- Additional Tekae reference to persist: [field]

## Reconciliation
Tekae settlement mechanism: [describe]
```

## Files to Update

### planning/TEKAE_OPEN_QUESTIONS.md
- Move Q-004 through Q-012 from Open to Resolved section
- Add Q-CPC-001 through Q-CPC-004 in Resolved section with answers

### planning/DECISIONS.md
- Add ADRs for:
  - Webhook vs. polling (or both) choice
  - Payment state machine transitions
  - Receipt generation trigger

## Design Document (inline in docs/ or planning/)

Payment state machine table:
```
tekae_pending   → [webhook received / poll returns success] → tekae_confirmed
tekae_pending   → [webhook failure / poll returns failure]  → tekae_failed
tekae_pending   → [TTL 30min + no event]                   → tekae_timeout
tekae_timeout   → [manual operator review]                  → tekae_confirmed / tekae_failed
```

DB schema additions (for Sprint 095 implementation):
- `payments.tekae_state` varchar
- `payments.tekae_event_ref` varchar nullable
- `tekae_events` table: id, session_ref, event_type, payload (jsonb), received_at
