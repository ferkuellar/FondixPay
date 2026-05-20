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
