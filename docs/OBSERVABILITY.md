# Observability Contract

**Status:** Contract documented. Implementation pending.
**Last updated:** 2026-06-02

---

## Purpose

This document defines the categories of events FONDIXPAY must produce to operate safely. It is a contract, not an implementation — code that produces these events does not exist yet.

No real money flow may go live without this contract implemented.

---

## Event Taxonomy

Events are classified into four categories:

| Category | Prefix | Description |
|---|---|---|
| App events | `app.*` | Mobile lifecycle and user action events |
| Payment events | `payment.*` | All payment flow state transitions |
| Integration events | `integration.*` | Provider interactions and failures |
| Support events | `support.*` | Events that trigger or inform support actions |

---

## App Events

| Event | Trigger | Required Fields |
|---|---|---|
| `app.launched` | App opens | `session_id`, `app_version`, `platform` |
| `app.screen_viewed` | Navigation to any screen | `screen_name`, `session_id` |
| `app.error_boundary_triggered` | AppErrorBoundary catches | `error_category`, `screen_name`, `session_id` |
| `app.session_started` | Successful OTP login | `user_id` (hashed), `session_id` |
| `app.session_ended` | Logout or expiry | `session_id`, `reason` |

**Rules:**
- No PII in event fields (no phone numbers, names, card data).
- `user_id` must be a non-reversible reference (internal ID only).
- Events must not include raw OTP codes, tokens, or provider secrets.

---

## Payment Events

| Event | Trigger | Required Fields |
|---|---|---|
| `payment.initiated` | User taps "Confirmar pago" | `session_id`, `service_id`, `amount_minor`, `currency` |
| `payment.provider_requested` | Request sent to Tekae | `session_id`, `idempotency_key`, `provider` |
| `payment.provider_succeeded` | Tekae returns success | `session_id`, `tekae_reference_id`, `amount_minor` |
| `payment.provider_failed` | Tekae returns failure | `session_id`, `error_category`, `is_retriable` |
| `payment.provider_timeout` | Tekae did not respond in time | `session_id`, `timeout_ms`, `is_retriable` |
| `payment.pending_resolved` | Pending payment status confirmed | `session_id`, `resolution`, `tekae_reference_id` |
| `payment.duplicate_blocked` | Idempotency key match detected | `session_id`, `original_payment_id` |
| `payment.receipt_generated` | Receipt created after success | `session_id`, `payment_id` |

**Rules:**
- `amount_minor` is in centavos (integer). Never log decimal amounts.
- `tekae_reference_id` is the Tekae-assigned ID. FONDIXPAY must not generate or invent this.
- No card data, PAN, CVV, or cardholder name in any payment event.
- `error_category` uses the taxonomy defined below, not raw Tekae error codes.

---

## Integration Events

These events are backend-only and must not reach the mobile app in raw form.

| Event | Trigger | Required Fields |
|---|---|---|
| `integration.tekae_request` | Backend sends to Tekae | `request_id`, `endpoint_category`, `idempotency_key` |
| `integration.tekae_response` | Backend receives from Tekae | `request_id`, `http_status`, `latency_ms`, `result_category` |
| `integration.tekae_webhook_received` | Webhook arrives at backend | `webhook_id`, `event_type`, `signature_verified` |
| `integration.tekae_webhook_processed` | Webhook handled | `webhook_id`, `payment_id`, `new_status` |
| `integration.tekae_webhook_rejected` | Signature invalid or malformed | `webhook_id`, `rejection_reason` |
| `integration.provider_disabled` | Request attempted while `TEKAE_ENABLED=false` | `session_id`, `attempted_action` |

**Rules:**
- `signature_verified` must be logged as `true` or `false` — never process a webhook without logging this.
- Raw Tekae request/response bodies must not be logged. Log categorized fields only.
- `integration.provider_disabled` should alert the on-call engineer if it occurs in production.

---

## Support Events

Support events are produced when FONDIXPAY cannot resolve a situation automatically and a human must act.

| Event | Trigger | Required Fields |
|---|---|---|
| `support.payment_failed_user_notified` | User shown payment failure screen | `session_id`, `recovery_id`, `error_category` |
| `support.payment_pending_user_notified` | User shown pending screen | `session_id`, `recovery_id` |
| `support.tekae_unavailable_shown` | User sees "Servicio en preparación" | `session_id` |
| `support.contact_attempted` | User taps support link | `session_id`, `recovery_id`, `channel` |
| `support.ticket_created` | Support ticket opened (future) | `ticket_id`, `user_id`, `recovery_id` |

---

## Error Categories

All errors shown to users or logged must use one of these categories. Raw provider error codes must be translated before reaching the user or event log.

| Category | Meaning |
|---|---|
| `network_unreachable` | Mobile or backend cannot reach provider |
| `provider_timeout` | Provider did not respond within SLA |
| `provider_rejected` | Provider declined the transaction |
| `provider_unavailable` | Provider returned 5xx or service error |
| `provider_disabled` | Feature flag prevents provider call |
| `payment_duplicate` | Idempotency key detected duplicate |
| `authentication_failed` | OTP or session invalid |
| `validation_error` | Input validation failure |
| `unknown` | Error not mapped to a category |

**Rule:** Error category `unknown` must trigger a review within 24 hours. Unknown errors indicate a mapping gap.

---

## User-Facing Error Messages

Users must never see:

- Raw HTTP status codes.
- Provider error codes or names.
- Stack traces.
- Internal correlation IDs (these go to the support screen, not inline).
- "Tekae" as a name unless explicitly approved by product.

Approved user-facing messages:

| Situation | Message |
|---|---|
| Tekae disabled | "Servicio en preparación. Muy pronto podrás pagar desde FONDIXPAY." |
| Payment failed | "No pudimos completar tu pago. Intenta de nuevo o contacta a soporte." |
| Payment pending | "Tu pago está en proceso. Te avisaremos cuando se confirme." |
| Network error | "No pudimos conectar. Revisa tu conexión e intenta de nuevo." |
| Generic failure | "Algo salió mal. Intenta de nuevo en unos momentos." |

---

## Implementation Priority

1. Payment events (`payment.*`) — required before Tekae goes live.
2. Integration events (`integration.*`) — required before Tekae goes live.
3. Support events (`support.*`) — required before Tekae goes live.
4. App events (`app.*`) — recommended; not strictly blocking.

---

## Related Documents

- `docs/AUDIT.md` — audit event contract
- `docs/SUPPORT_RUNBOOK.md` — support runbook
- `docs/integrations/TEKAE_RUNBOOK.md` — Tekae operational runbook
- `docs/PRODUCTION_READINESS.md` — production gate checklist
