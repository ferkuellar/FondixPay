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
