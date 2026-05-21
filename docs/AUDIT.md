# Audit

## Current State

Audit logs are not implemented unless a later technical review proves otherwise. They are required before real financial operations.

## Actions That Must Be Auditable

- Login.
- OTP request.
- OTP verify.
- Service added.
- Service changed or removed.
- Payment created.
- Payment state changed.
- Receipt generated.
- Receipt viewed/downloaded if required by policy.
- Admin action.
- Support action on user/payment/service data.
- Future payment provider error.
- Future webhook received.
- Future webhook processing result.

## Conceptual Audit Event

```json
{
  "id": "audit_event_id",
  "occurred_at": "2026-05-19T00:00:00Z",
  "actor_type": "USER|ADMIN|SYSTEM|PROVIDER",
  "actor_id": "id-or-null",
  "action": "payment.created",
  "resource_type": "Payment",
  "resource_id": "payment_id",
  "request_id": "correlation_id",
  "ip_address": "optional",
  "metadata": {
    "safe": "non-sensitive context only"
  }
}
```

## Rules

- Audit events must not store raw secrets, tokens, OTP codes, card data, or unnecessary personal data.
- Financial audit events should be append-only.
- Administrative actions must include actor identity.
- Provider webhooks must preserve correlation and processing state.

## Phase 4A Auth Audit Contract

The following auth/session events must be emitted when audit logging is implemented:

- `auth.otp_requested`
- `auth.otp_verified`
- `auth.otp_failed`
- `auth.login_success`
- `auth.login_failed`
- `auth.logout`
- `auth.session_restored`
- `auth.token_invalid`

Minimum event fields:

- `event_type`
- `actor_user_id` when known
- `phone_hash` for OTP events instead of raw phone where possible
- `request_id`
- `ip_address`
- `user_agent`
- `device_id` when available
- `result`
- `reason`
- `created_at`

Phase 4A does not implement the audit log table. Real payments remain blocked until auth and financial audit events are implemented.

## Phase 4C Payment UX Audit Events

The following payment UX events must be emitted when audit logging is implemented:

- `payment.fee_disclosed`
- `payment.method_selected`
- `payment.method_added`
- `payment.confirmation_viewed`
- `payment.confirmed`
- `payment.failed`
- `payment.retry_requested`
- `payment.support_requested`
- `receipt.viewed`
- `receipt.shared`
- `receipt.downloaded`

These events must not store raw card data, OTP codes, access tokens, or unnecessary personal data. They should include safe correlation IDs, actor identity when known, payment/receipt identifiers when available, and result status.

## Phase 5A Ledger and Audit Strategy

### Audit Principles

- Audit events are append-only.
- Every financial state change emits an audit event.
- Every provider request/response emits an audit event with redacted metadata.
- Every admin/finance/auditor action emits an audit event.
- Audit events must link to `request_id` and `correlation_id`.
- Audit events must not store raw secrets, full card numbers, OTP codes, access tokens, or unredacted provider payloads.

### Event Catalog

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

### Required Fields

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
- `ip_address`
- `user_agent`
- `timestamp`

## Phase 6B Audit Status
- Implemented for the demo baseline: `account.created`, `balance.snapshot_created`, `movement.created`, and `balance.viewed`.
- Pending for later account/balance phases: account status changes, restrictions, holds, demo debit adjustments, statements, and real balance investigation events.
- Current Phase 6B events use the central audit writer with request context when invoked from the API.
- `result`

### Actor Model

- `USER`: authenticated end user.
- `ADMIN`: future administrator.
- `SUPPORT`: future support role with limited access.
- `FINANCE`: future finance/operations role.
- `AUDITOR`: read-only audit role.
- `SYSTEM`: automated internal process.
- `PROVIDER`: external provider/webhook actor.

### Correlation ID Strategy

`correlation_id` must be created at payment-intent start and reused across payment attempts, provider calls, ledger entries, receipts, notifications, support records, and reconciliation. `request_id` is unique per HTTP request or background job execution.

### Financial Audit Requirements

- Store amount fields only as integer minor units in metadata.
- Include currency.
- Record state transitions with before/after.
- Record idempotency duplicate blocking.
- Record provider status mapping decisions.
- Record reversal and dispute decisions.

### Admin Audit Requirements

- Admin audit endpoints require explicit role authorization.
- Admin reads of audit records should themselves be auditable if policy requires.
- Configuration changes require `admin.config_changed`.

### Provider Audit Requirements

- Store provider payload hashes and safe metadata, not raw sensitive payloads by default.
- Preserve provider reference separately from internal IDs.
- Webhook/polling events must include correlation and processing result.

### Example JSON

```json
{
  "event_id": "evt_123",
  "event_type": "payment.submitted_to_provider",
  "actor_type": "USER",
  "actor_id": "42",
  "entity_type": "PaymentIntent",
  "entity_id": "pi_123",
  "before": {"status": "confirmed_by_user"},
  "after": {"status": "processing"},
  "metadata": {
    "amount_minor": 120000,
    "fee_minor": 1200,
    "total_minor": 121200,
    "currency": "MXN",
    "provider_name": "prontipagos"
  },
  "request_id": "req_123",
  "correlation_id": "corr_123",
  "ip_address": null,
  "user_agent": null,
  "timestamp": "2026-05-20T00:00:00Z",
  "result": "success"
}
```

## Phase 5B Audit Implementation

Implemented audit persistence:

- Table/model: `audit_events`.
- Writer: `backend/app/modules/audit/services.py`.
- Redaction: sensitive metadata keys such as `otp`, `otp_dev`, `token`, `access_token`, `password`, `secret`, `jwt`, `pan`, `cvv`, and `card_number` are stored as `[REDACTED]`.

Implemented event types:

- `auth.otp_requested`
- `auth.otp_verified`
- `auth.login_success`
- `auth.login_failed`
- `user_service.created`
- `user_service.validation_failed`
- `payment.intent_created`
- `payment.confirmed_by_user`
- `payment.mock_submitted`
- `payment.succeeded`
- `payment.duplicate_blocked`
- `receipt.generated`

Known audit gaps:

- No provider webhooks exist yet.
- No admin/support actions exist yet.
- Logout/session restore audit coverage remains incomplete.
- DB-level immutability enforcement for audit events is pending.
- Audit read endpoints for `AUDITOR`/`ADMIN` roles are pending.

## Phase 5C Fee Transparency Audit Events

Implemented:

- `payment.fee_disclosed`: emitted when the mock payment flow records the visible amount/fee/total.
- `payment.confirmed_with_total`: emitted when the mock payment is confirmed with the total breakdown.

Contract documented but not implemented as a separate backend event:

- `payment.confirmation_viewed`: future event for a backend-backed quote/confirmation view. Current mobile confirmation is local mock state and has no backend quote endpoint.

Required metadata:

- `amount_minor`
- `fee_minor`
- `total_minor`
- `currency`
- `mock`

## Payment Method Audit Events

Future required events:

- `payment_method.add_started`
- `payment_method.add_completed`
- `payment_method.add_failed`
- `payment_method.selected`
- `payment_method.changed`
- `payment_method.removed`
- `payment_method.validation_failed`
- `payment_method.mock_selected`

Payment method audit metadata must exclude PAN, CVV, raw provider payloads, and secrets.
# Payment Method Events

The following events are required for future backend-backed payment methods:

- `payment_method.add_started`
- `payment_method.add_completed`
- `payment_method.add_failed`
- `payment_method.selected`
- `payment_method.changed`
- `payment_method.removed`
- `payment_method.mock_selected`

Phase 5E uses local mobile mock state only, so these events are documented as future/pending and do not count as durable audit logs yet.

## Phase 5F Payment Recovery Audit Events

Future recovery implementation must emit:

- `payment.created`
- `payment.validation_failed`
- `payment.processing_started`
- `payment.pending_confirmation`
- `payment.provider_timeout`
- `payment.paid`
- `payment.failed`
- `payment.duplicate_detected`
- `payment.recovery_required`
- `payment.support_required`
- `payment.retry_requested`
- `payment.retry_blocked`
- `payment.cancelled`
- `payment.reversal_requested`
- `receipt.generation_failed`
- `receipt.regeneration_requested`
- `recovery.case_created`
- `recovery.case_assigned`
- `recovery.case_resolved`

Required fields:

- actor
- entity
- before
- after
- severity
- requires_review
- request_id
- correlation_id
- safe metadata only

Recovery audit events must never store raw provider payloads, full card data, CVV, OTP codes, access tokens, or secrets.

Phase 5F mobile mock implementation status:

- `payment.failed`: future durable backend event.
- `payment.pending`: future durable backend event.
- `payment.timeout`: future durable backend event.
- `payment.retry_requested`: future durable backend event.
- `payment.duplicate_blocked`: future durable backend event.
- `payment.support_requested`: future durable backend event.
- `receipt.unavailable`: future durable backend event.

The current mobile scenario selector and support placeholder do not count as persistent audit events.

## Phase 6A Account and Balance Events

Future events:
- `account.created`
- `account.status_changed`
- `account.restricted`
- `account.suspended`
- `account.closed`
- `balance.viewed`
- `balance.snapshot_created`
- `movement.created`
- `demo_balance.credit_added`
- `demo_balance.debit_added`
- `hold.created`
- `hold.released`
- `hold.expired`
- `adjustment.created`

Required fields when applicable:
- `account_id`
- `user_id`
- `amount_minor`
- `currency`
- `before` and `after` for status changes
- `request_id`
- `correlation_id`
- `actor_id`
- `timestamp`
## Phase 7 History And Receipt Events

The following events are required for the future backend history/receipt projection:

| Event | Current status | Notes |
|---|---|---|
| `receipt.viewed` | future | Receipt list or summary viewed by user. |
| `receipt.detail_viewed` | future | Detail view with safe identifiers only. |
| `history.viewed` | future | History surface opened. |
| `history.filtered` | future | Status filter used. |
| `receipt.unavailable` | future | Receipt absent after an attempt or generation failure. |
| `receipt.generated` | implemented for backend mock success | Existing receipt generation audit path. |
| `receipt.download_requested` | future | Real download proof flow not implemented. |
| `receipt.share_requested` | future | Real share flow not implemented. |

All events must preserve actor, entity, request/correlation identifiers, safe receipt/payment references, and redacted metadata.

## Card Payment Method Audit Events

Current roadmap payment-method audit events are card-focused:

- `payment_method.card_add_started`
- `payment_method.card_tokenized`
- `payment_method.card_add_failed`
- `payment_method.card_selected`
- `payment_method.card_changed`
- `payment_method.card_removed`
- `payment_method.card_declined`
- `payment_method.card_auth_failed`
- `payment_method.card_expired`

Events must use safe card references only. Do not emit PAN or CVV in audit metadata.

## Card Processor Sandbox Audit Events

Status: future/proposed for Phase 8A unless a later implementation report marks an event implemented.

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

These events must carry safe processor references, request/correlation IDs, idempotency context where relevant, and redacted metadata only.

## Prontipagos Sandbox Audit Events

Status: future/proposed for Phase 8B.

- `prontipagos.catalog_sync_started`
- `prontipagos.catalog_sync_completed`
- `prontipagos.reference_validation_requested`
- `prontipagos.reference_validation_succeeded`
- `prontipagos.reference_validation_failed`
- `prontipagos.amount_lookup_requested`
- `prontipagos.amount_lookup_succeeded`
- `prontipagos.amount_lookup_failed`
- `prontipagos.payment_execution_requested`
- `prontipagos.payment_execution_submitted`
- `prontipagos.payment_execution_succeeded`
- `prontipagos.payment_execution_pending`
- `prontipagos.payment_execution_failed`
- `prontipagos.payment_execution_timeout`
- `prontipagos.duplicate_blocked`
- `prontipagos.status_checked`
- `prontipagos.reconciliation_started`
- `prontipagos.reconciliation_completed`
- `prontipagos.reconciliation_mismatch`

Metadata must stay redacted and retain safe provider references, payload hashes, request IDs, correlation IDs, and idempotency context.

## Phase 8C Sandbox Audit Status

Implemented for the contractual mock orchestration:

- `card.charge_submitted`
- `card.charge_authorized`
- `card.charge_declined`
- `card.charge_timeout`
- `card.charge_duplicate_blocked`
- `card.charge_failed`
- `prontipagos.payment_execution_submitted`
- `prontipagos.payment_execution_succeeded`
- `prontipagos.payment_execution_pending`
- `prontipagos.payment_execution_failed`
- `prontipagos.payment_execution_timeout`
- `prontipagos.duplicate_blocked`
- `payment.manual_review_required`
- existing `receipt.generated`

Tokenization, webhook, reconciliation, admin/manual-review UI events, and real-provider event catalogs remain pending.
