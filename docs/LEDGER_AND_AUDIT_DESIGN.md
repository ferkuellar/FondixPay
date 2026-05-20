# Ledger and Audit Foundation Design

Updated: 2026-05-20

## Executive Summary

FondixPay cannot connect real payments until ledger, audit logs, idempotency, provider transaction tracking, reconciliation, and failure recovery are designed and accepted.

The current payment flow is mock/dev. It can generate a local success, a mock receipt, and local history, but it does not prove provider settlement, does not create append-only ledger entries, does not persist audit events, and does not prevent duplicate real submissions. That is acceptable for internal validation without money, but it is not acceptable for Prontipagos or any real aggregator.

This document defines the target foundation before implementation. It does not apply migrations, connect providers, move money, or change the mobile flow.

## Design Goals

- Financial traceability from user action to provider response and receipt.
- Idempotency for payment confirmation, retry, and provider submission.
- Append-only audit events for auth, user service, payment, receipt, provider, and future admin actions.
- Future reconciliation between internal records and provider reports.
- Prevention of double payment from double tap, retry, network timeout, or provider ambiguity.
- Separation between internal state, provider confirmation, and user-facing messaging.
- Preparation for Prontipagos without integrating it in this phase.
- Recovery paths for failures, reversals, timeouts, and missing receipts.

## Non-Goals

- No real provider integration.
- No real money movement.
- No wallet or stored value.
- No production Alembic migration in this phase.
- No mobile UI changes.
- No admin panel.
- No KYC.
- No provider credentials.

## Core Concepts

| Concept | Definition |
| --- | --- |
| PaymentIntent | Internal request to pay a user service for a known amount, fee, total, currency, user, and correlation ID. |
| PaymentAttempt | One attempt to execute a PaymentIntent against a provider or mock provider. Multiple attempts may exist for one intent. |
| PaymentTransaction | User-facing payment record derived from PaymentIntent, PaymentAttempt, provider status, and ledger state. |
| LedgerAccount | Accounting account for user, FondixPay, provider clearing, fees, suspense, or settlement. |
| LedgerEntry | Append-only financial entry in integer minor units. Reversals use compensating entries. |
| AuditEvent | Append-only event describing a critical action or state change with actor, entity, request, correlation, before/after, and result. |
| Receipt | User-facing proof record. It is not provider-confirmed proof until provider confirmation rules are satisfied. |
| ProviderTransaction | Provider-side transaction reference, status, amount, and payload hash/redaction metadata. |
| ReconciliationRecord | Batch or run result comparing internal payments against provider reports. |
| IdempotencyKey | Client/server key for deduplicating critical payment operations. |
| CorrelationId | Flow-level ID linking intent, attempts, ledger entries, audit events, receipt, provider calls, and support. |
| RequestId | Individual HTTP/request-level ID for tracing one request. |
| ExternalReference | User-facing or provider-facing non-primary reference. |
| ProviderReference | Provider transaction ID or folio from Prontipagos/future provider. |

## Ledger Model

Proposed conceptual entities:

- `ledger_accounts`
- `ledger_entries`
- `payment_intents`
- `payment_attempts`
- `provider_transactions`
- `reconciliation_records`
- `audit_events`

Rules:

- Ledger entries are append-only.
- No destructive update or delete is allowed on ledger entries.
- Reversals use compensating entries.
- Amounts must be stored as integer minor units, e.g. centavos.
- Currency is explicit; default is `MXN`.
- Timestamps are UTC.
- `actor_id` is included when the action has an authenticated actor.
- `correlation_id` is required across the full payment flow.
- `provider_reference` is nullable until provider acceptance/confirmation.
- Provider references are stored separately from internal IDs.
- User-facing status is derived from internal state and provider confirmation rules.

Suggested account types:

- `USER_PENDING`
- `FONDIX_FEE_REVENUE`
- `PROVIDER_CLEARING`
- `PAYMENT_SUSPENSE`
- `REVERSAL_CLEARING`

No real balance or wallet behavior is approved in this design. Accounts support traceability and settlement design, not stored-value launch.

## Payment State Machine

### PaymentIntent States

- `created`
- `awaiting_user_confirmation`
- `confirmed_by_user`
- `processing`
- `provider_pending`
- `provider_confirmed`
- `succeeded`
- `failed`
- `cancelled`
- `expired`
- `reversed`
- `disputed`

Allowed intent flow:

1. `created` -> `awaiting_user_confirmation`
2. `awaiting_user_confirmation` -> `confirmed_by_user`
3. `confirmed_by_user` -> `processing`
4. `processing` -> `provider_pending`
5. `provider_pending` -> `provider_confirmed`
6. `provider_confirmed` -> `succeeded`
7. `processing` or `provider_pending` -> `failed`
8. `succeeded` -> `reversed` or `disputed` only through explicit review/reversal flow

### PaymentAttempt States

- `created`
- `submitted_to_provider`
- `accepted_by_provider`
- `rejected_by_provider`
- `timeout`
- `failed`
- `succeeded`
- `duplicate_blocked`

Rules:

- One PaymentIntent can have multiple attempts.
- An attempt cannot be silently deleted.
- A retry creates or reuses an attempt according to idempotency rules.
- `timeout` does not mean success.
- `accepted_by_provider` does not automatically mean user-facing success.

### Receipt States

- `pending`
- `generated`
- `provider_confirmed`
- `unavailable`
- `voided`

Rules:

- `generated` can be internal/mock proof.
- `provider_confirmed` requires provider confirmation rules.
- `voided` requires audit event and, if money moved, compensating ledger entries.

## User-Facing Status

| Internal Condition | User Message |
| --- | --- |
| `processing` | Procesando |
| provider accepted but not settled | Pendiente de confirmacion |
| internal receipt pending | Comprobante en proceso |
| provider confirmed and ledger entries recorded | Pago confirmado |
| user confirmation accepted but provider still pending | Pago recibido |
| provider rejected or validation failed | No se completo |
| ambiguous timeout or mismatch | Requiere soporte |

User-facing success must not be guessed. Provider confirmation and ledger state must drive final status.

## Idempotency Strategy

Critical operations must require an idempotency key:

- Create payment intent.
- Confirm payment intent.
- Retry payment intent.
- Submit provider payment.
- Process webhook or polling confirmation.

Rules:

- `idempotency_key` is unique per user + operation + target resource within a defined duplicate window.
- Retrying the same key returns the original result or current state.
- Double tap on `PAGAR` must not create a second provider submission.
- Provider timeout must keep the intent in pending/ambiguous state until confirmed by polling, webhook, or reconciliation.
- Safe retry after timeout must use the existing correlation ID and preserve original attempt history.
- `request_id` traces one request; `correlation_id` traces the full payment flow.

Future constraints:

- Unique index on `(user_id, idempotency_key, operation)`.
- Unique provider reference per provider where provider guarantees uniqueness.
- Audit event for duplicate blocked: `payment.duplicate_blocked`.

## Audit Event Design

Required events:

Auth:

- `auth.otp_requested`
- `auth.otp_verified`
- `auth.login_success`
- `auth.login_failed`
- `auth.logout`
- `auth.token_invalid`

User Service:

- `user_service.created`
- `user_service.validated`
- `user_service.validation_failed`
- `user_service.deleted`

Payment:

- `payment.intent_created`
- `payment.fee_disclosed`
- `payment.confirmation_viewed`
- `payment.confirmed_by_user`
- `payment.submitted_to_provider`
- `payment.provider_accepted`
- `payment.provider_rejected`
- `payment.provider_timeout`
- `payment.succeeded`
- `payment.failed`
- `payment.cancelled`
- `payment.retry_requested`
- `payment.duplicate_blocked`

Receipt:

- `receipt.generated`
- `receipt.viewed`
- `receipt.shared`
- `receipt.downloaded`
- `receipt.unavailable`

Provider:

- `provider.request_sent`
- `provider.response_received`
- `provider.webhook_received`
- `provider.reconciliation_started`
- `provider.reconciliation_completed`
- `provider.reconciliation_mismatch`

Admin/Future:

- `admin.payment_reviewed`
- `admin.refund_reviewed`
- `admin.user_locked`
- `admin.config_changed`

Required fields:

- `event_id`
- `event_type`
- `actor_id`
- `actor_type`
- `entity_type`
- `entity_id`
- `before`
- `after`
- `metadata`
- `request_id`
- `correlation_id`
- `ip_address` nullable
- `user_agent` nullable
- `timestamp`
- `result`

## Prontipagos Preparation

Prontipagos is considered a future primary aggregator candidate for service payments in Mexico. This phase does not integrate it.

Future design areas:

- Service catalog sync.
- Reference validation.
- Amount lookup.
- Payment execution.
- Provider confirmation.
- Receipt/folio mapping.
- Reconciliation.
- Error code mapping.
- Timeout handling.
- Retry rules.
- Provider transaction ID mapping.
- Provider status mapping.
- Webhook or polling placeholder depending on provider capability.

Provider references must be stored separately from internal IDs. Raw provider payloads should be hashed or redacted before storage unless there is a documented operational need and security approval.

## Reconciliation Design

Future reconciliation should compare internal records and provider reports at least daily.

Inputs:

- Internal payment intents.
- Payment attempts.
- Provider transactions.
- Ledger entries.
- Receipts.
- Provider settlement/report export.

Mismatch categories:

- `internal_success_provider_missing`
- `provider_success_internal_pending`
- `amount_mismatch`
- `duplicate_provider_reference`
- `receipt_missing`

Outputs:

- `reconciliation_records`
- mismatch counts
- matched counts
- manual review queue item
- audit events for run start, completion, and mismatch

## Failure and Recovery

Required cases:

- Failed before provider submission: no provider transaction; safe user retry.
- Failed after provider submission: pending review or provider status check required.
- Provider timeout: keep pending/ambiguous; no success until confirmation.
- Duplicate payment attempt: block duplicate and return current state.
- User retry: reuse correlation context and idempotency policy.
- No receipt: payment can be provider-confirmed while receipt is `unavailable`; support path required.
- Provider says paid but internal says pending: reconciliation mismatch and manual review.
- Internal says paid but provider rejected: freeze user-facing success, create review record, and reverse/void if required.
- User claims double charge: support review must inspect provider references, ledger entries, audit events, and reconciliation records.

## Data Retention and Immutability

- Audit events are append-only.
- Ledger entries are append-only.
- Financial records should not be hard-deleted.
- Soft delete may apply only to non-financial user-facing entities when allowed.
- Retention policy must be defined before production and should cover payments, receipts, provider transactions, audit events, and reconciliation records.

## Production Gates

Real payments remain blocked until:

- Auth/session hardened.
- Backend tests passing.
- Ledger schema implemented.
- Audit logs implemented.
- Idempotency implemented.
- Provider sandbox integrated.
- Reconciliation designed.
- Error/recovery UX implemented.
- Fee disclosure implemented.
- Security review completed.
- No secrets in repo.
- CI/CD basic gate in place.
