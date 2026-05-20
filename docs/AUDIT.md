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
