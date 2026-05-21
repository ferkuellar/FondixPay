# Card Processor Sandbox Design

Updated: 2026-05-20

## Executive Summary

FondixPay is card-only for user-facing service payments. The user pays with a debit or credit card through a future approved card processor. FondixPay then executes the service-payment leg through Prontipagos as a separate service-payment aggregator when that flow is designed and approved.

Phase 8A defines the sandbox architecture, security boundary, API contracts, error taxonomy, audit strategy, reconciliation seams, and implementation backlog for the card processor leg. It does not select a final provider, move money, connect production credentials, capture real card data, or integrate Prontipagos.

## Design Goals

- Tokenize real cards through a processor-approved flow.
- Reduce PCI scope by keeping PAN and CVV out of FondixPay backend systems by default.
- Prepare a controlled sandbox integration path before production work.
- Handle card declines, auth challenges, timeouts, processor outages, duplicates, and fraud signals.
- Reuse ledger, audit, idempotency, recovery, and correlation rules already established for payments.
- Keep card charge/auth separate from service payment execution through Prontipagos.
- Prepare reconciliation between internal state, card processor records, and later Prontipagos records.

## Non-Goals

- No production integration.
- No real card charge.
- No provider implementation or production selection.
- No Prontipagos integration.
- No storage of raw card number or CVV.
- No real 3DS/auth challenge implementation in this phase.

## Separation of Concerns

### User Card Payment

```text
User -> Mobile -> Card Processor Tokenization -> FondixPay Backend -> Card Processor Charge/Auth
```

### Service Payment Execution

```text
FondixPay Backend -> Prontipagos -> Service Provider
```

Prontipagos must not be assumed to be the card processor. A successful card authorization or capture and a successful service-payment execution are different facts with different provider references, failure modes, audit trails, reconciliation inputs, and support runbooks.

## Candidate Processor Evaluation Criteria

The processor comparison must cover:

- Mexico support and legal/commercial availability.
- Debit and credit card support.
- Tokenization method and provider vault behavior.
- Mobile SDK, hosted fields, or hosted checkout support.
- Sandbox quality and documented test vectors.
- 3DS/auth challenge support.
- Webhooks, status lookup, and replay behavior.
- Idempotency support.
- Refund and void support.
- Chargeback tooling and dispute evidence.
- Fees and settlement timing.
- API documentation quality.
- PCI implications.
- Support quality and incident escalation.

No provider is selected in Phase 8A without approved research, security review, and commercial/API evidence.

## Architecture Options

### Option A - Provider Hosted Checkout / Hosted Fields

Pros:

- Strong default boundary for PAN/CVV isolation.
- Lower backend exposure when the provider owns sensitive input handling.
- Can accelerate compliance review if the provider documents the flow clearly.

Cons:

- UX and navigation control may be constrained.
- Mobile embedding and return handling can vary by provider.
- Saved-card and auth-challenge behavior may need provider-specific design.

Security and UX posture: preferred when mobile integration and payment recovery affordances remain acceptable.

### Option B - Mobile SDK Tokenization

Pros:

- Native-feeling card capture and tokenization UX.
- Processor can return token/payment method references without backend receiving raw card data.
- May provide auth-challenge primitives and device signals.

Cons:

- Expo/React Native compatibility and native build requirements must be validated.
- SDK logging, telemetry, and lifecycle must be reviewed.
- Provider changes can increase mobile release coupling.

Security and UX posture: preferred when the SDK is supported, tokenized, testable, and production review accepts the native dependency path.

### Option C - Backend Direct Card Capture

Pros:

- Maximum transport and request control.

Cons:

- Expands PCI scope materially.
- Exposes backend, logs, observability, tests, and support paths to card-data risk.
- Requires explicit compliance design, secure handling, and provider approval before even considering implementation.

Security and UX posture: not recommended for FondixPay unless a future PCI-approved architecture explicitly requires it.

Recommendation: prefer provider hosted fields/checkout or mobile SDK tokenization. By default the backend receives only provider tokens, safe metadata, and state references.

## Sandbox Flow

1. User selects a saved/demo card path.
2. Mobile requests a tokenization session or invokes the processor-approved tokenization UI/SDK.
3. Processor returns a `card_token`, `payment_method_token`, or equivalent safe reference.
4. Backend creates an internal `PaymentIntent`.
5. Backend creates a `CardPaymentAttempt`.
6. Future sandbox adapter charges or authorizes the card with processor idempotency.
7. Backend records audit events and card attempt state.
8. If card charge succeeds, later service-payment execution may proceed through Prontipagos sandbox only under approved rules.
9. If card charge fails, recovery state and safe error mapping apply.
10. If charge is pending or auth-required, the flow stays pending/auth challenge until processor evidence resolves it.

## Card Payment State Machine

Proposed card states:

- `card_tokenization_started`
- `card_tokenized`
- `card_tokenization_failed`
- `card_charge_created`
- `card_charge_submitted`
- `card_charge_authorized`
- `card_charge_captured`
- `card_charge_declined`
- `card_charge_failed`
- `card_charge_pending`
- `card_charge_timeout`
- `card_charge_duplicate_blocked`
- `card_charge_refunded_future`
- `card_charge_voided_future`

| Internal State | User-Facing Status |
|---|---|
| `card_tokenized` | Tarjeta validada |
| `card_charge_created`, `card_charge_submitted` | Procesando cargo |
| `card_charge_authorized`, `card_charge_captured` | Cargo autorizado |
| `card_charge_declined`, `card_charge_failed` | Pago no completado |
| auth challenge required | Requiere autenticacion |
| `card_charge_pending`, `card_charge_timeout` | Pendiente de confirmacion |
| `card_charge_duplicate_blocked` | No se realizo cargo |

Auth-required is a future processor outcome that must not be collapsed into success.

## Error Mapping

| Code | Safe User Message | Retry Allowed | Change Card | Support | Audit Event | Internal Status |
|---|---|---|---|---|---|---|
| `card_declined` | Tu banco no autorizo el cargo. | maybe | yes | maybe | `card.charge_declined` | `card_charge_declined` |
| `insufficient_funds` | No hay fondos disponibles para completar el cargo. | maybe | yes | no | `card.charge_declined` | `card_charge_declined` |
| `expired_card` | La tarjeta vencio. Usa otra tarjeta. | no | yes | no | `card.charge_failed` | `card_charge_failed` |
| `invalid_cvv` | No pudimos validar la tarjeta. Reintenta desde el flujo seguro. | maybe | maybe | no | `card.charge_failed` | `card_charge_failed` |
| `invalid_card_number` | No pudimos tokenizar la tarjeta. | maybe | yes | no | `card.tokenization_failed` | `card_tokenization_failed` |
| `processor_timeout` | Estamos verificando el resultado del cargo. | no immediate | no | yes | `card.charge_timeout` | `card_charge_timeout` |
| `processor_unavailable` | El procesador no esta disponible por ahora. | later | maybe | maybe | `card.processor_error` | `card_charge_failed` |
| `auth_required` | Tu banco requiere autenticacion adicional. | challenge | no | maybe | `card.processor_error` | `card_charge_pending` |
| `fraud_suspected` | No pudimos completar el cargo. | no | maybe | yes | `card.processor_error` | `card_charge_failed` |
| `duplicate_charge` | Ya estamos procesando este cargo. | same key only | no | maybe | `card.charge_duplicate_blocked` | `card_charge_duplicate_blocked` |
| `unknown_error` | No pudimos completar el cargo. | controlled | maybe | yes | `card.processor_error` | `card_charge_failed` |

Provider raw codes must map into this taxonomy before reaching mobile or support UI.

## Idempotency Strategy

- Each card charge attempt receives an `idempotency_key`.
- Internal uniqueness scope is user + payment intent + operation.
- Same key and same operation returns the existing known result/current state.
- Same key with conflicting amount, card method, or intent is rejected and audited.
- Duplicate tap must not create a second processor submission.
- Future processor adapter must pass the provider idempotency header or key when supported.
- Timeout recovery reuses current correlation context and checks processor status before a new submission.

## Audit Events

Required card events:

- `card.tokenization_started`
- `card.tokenization_succeeded`
- `card.tokenization_failed`
- `card.payment_method_added`
- `card.payment_method_selected`
- `card.charge_created`
- `card.charge_submitted`
- `card.charge_authorized`
- `card.charge_captured`
- `card.charge_declined`
- `card.charge_failed`
- `card.charge_timeout`
- `card.charge_duplicate_blocked`
- `card.charge_refund_requested_future`
- `card.webhook_received_future`
- `card.processor_error`

All metadata must be safe: no PAN, no CVV, no secrets, no raw provider payload by default.

## Data Model Proposal

Future entities:

- `card_payment_methods`
- `card_payment_attempts`
- `card_processor_transactions`
- `card_processor_events`
- `card_charge_reconciliation_records`

Important safe fields:

- `provider_name`
- `provider_customer_id`
- `provider_payment_method_token`
- `brand`
- `last4`
- `exp_month`
- `exp_year`
- `status`
- `is_default`
- `is_mock`
- `tokenized_at`
- `deleted_at`

Never persist:

- full PAN
- CVV
- raw card number

## API Proposal

All endpoints below are future/proposed.

| Endpoint | Purpose | Auth / Role | Conceptual Request | Conceptual Response | Idempotency | Audit | Security Notes |
|---|---|---|---|---|---|---|---|
| `POST /card/tokenization-session` | Create provider tokenization handoff/session. | yes / `USER` | intent context and client capability | public/session token and expiry | yes if provider session creation is stateful | `card.tokenization_started` | Never return secret processor keys. |
| `POST /card/payment-methods` | Attach safe processor tokenized card. | yes / `USER` | provider token + safe card metadata | card method ID/status | attach key recommended | `card.payment_method_added` | Reject PAN/CVV payloads. |
| `GET /card/payment-methods` | List own safe card methods. | yes / `USER` | none | safe method summaries | n/a | optional selection/view policy | Owner-scoped safe fields only. |
| `PATCH /card/payment-methods/{id}/default` | Select default card. | yes / `USER` | method ID/default flag | safe method summary | controlled duplicate | `card.payment_method_selected` | Ownership required. |
| `DELETE /card/payment-methods/{id}` | Soft delete/detach card reference. | yes / `USER` | none | deletion/detach status | controlled duplicate | card method removal event future | Provider detach rules required. |
| `POST /card/charges` | Submit future sandbox charge/auth. | yes / `USER` | payment intent, card method, amount snapshot, idempotency key | charge/attempt status | required | charge event sequence | Processor payloads redacted. |
| `GET /card/charges/{id}` | Read charge state. | yes / owner; future support/finance | none | safe charge status | n/a | optional view policy | Never expose raw provider payload. |
| `POST /card/webhooks/{provider}` | Receive future processor events. | signature plus provider policy | signed event | accepted/replayed status | webhook event identity | `card.webhook_received_future` | Verify signature/replay. |
| `GET /admin/card/reconciliation` | Read reconciliation summary. | yes / future `FINANCE`, `ADMIN`, `AUDITOR` | filters | safe reconciliation rows | n/a | admin audit policy | RBAC and redaction required. |

## Webhook Strategy

Future processor webhooks require:

- signature verification before trust,
- replay protection and idempotent event storage,
- provider event IDs and received timestamps,
- redaction/hashing of payload material,
- mapping to internal card state,
- audit event on receipt and processing result,
- manual review path for unknown or conflicting states.

## Reconciliation Strategy

Future reconciliation must detect:

- card charge success vs internal payment mismatch,
- card charge success while Prontipagos service execution failed,
- service payment success without approved card charge, which is SEV-1 and should not happen,
- amount mismatch,
- duplicate card charge,
- refund/void evidence in future phases,
- daily processor report mismatches.

Card reconciliation and Prontipagos reconciliation share correlation identifiers but remain distinct reconciliation legs.

## Security / PCI Notes

- FondixPay does not store PAN or CVV.
- Tokenization is mandatory for real cards.
- Prefer hosted fields, hosted checkout, mobile SDK tokenization, or equivalent approved provider UI.
- Secrets come from environment/secret management, not source control.
- Webhook signing and replay controls are required.
- Logs and audit records must be redacted.
- Raw provider payloads are hashed/redacted by default.
- Apply least privilege to mobile, backend, admin, finance, support, and audit views.
- Expo Secure Store must not persist PAN/CVV.
- Card tokens live in backend only when provider terms and threat model allow it.
- Admin/support surfaces never display PAN/CVV.

## Sandbox Environment Variables

Proposed names only:

```text
CARD_PROCESSOR_PROVIDER
CARD_PROCESSOR_ENV=sandbox
CARD_PROCESSOR_PUBLIC_KEY
CARD_PROCESSOR_SECRET_KEY
CARD_PROCESSOR_WEBHOOK_SECRET
CARD_PROCESSOR_API_BASE_URL
CARD_PROCESSOR_TIMEOUT_SECONDS
```

`.env.example` may contain placeholders only. Real sandbox or production secrets must use approved secret storage.

## Testing Strategy

Future sandbox tests:

- tokenization success,
- tokenization failure,
- charge success,
- charge declined,
- expired card,
- invalid CVV,
- processor timeout,
- duplicate idempotency result,
- webhook valid signature,
- webhook invalid signature,
- owner cannot access another user's card methods,
- no PAN/CVV persisted,
- required audit events created.

## Production Gates

Before production:

- processor selected and reviewed,
- contract/API reviewed,
- tokenization implemented,
- PCI scope reviewed,
- sandbox tests passed,
- webhooks implemented,
- idempotency implemented,
- audit events implemented,
- recovery paths implemented,
- admin/support safe metadata view ready,
- chargeback process documented,
- no secrets in repo,
- security review completed.

Commercial production remains blocked after Phase 8A.

## Interaction with Prontipagos

- Card charge success or approved authorization is the prerequisite for Prontipagos service-payment execution.
- If card processing fails, is pending, times out, or remains unknown, Prontipagos is not called.
- If the card leg succeeds but Prontipagos fails, times out, or remains ambiguous, FondixPay enters recovery/manual review rather than claiming paid success.
- Card and Prontipagos flows require separate reconciliation evidence and future support/admin tooling.
