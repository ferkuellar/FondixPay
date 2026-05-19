# Data Model

This document captures the conceptual model. No migrations are added in Phase 1.

## Current Concepts

| Entity | Purpose | Current Notes |
| --- | --- | --- |
| User | End-user account identified by phone/session | Needs production auth hardening |
| ServiceProvider | Provider catalog such as CFE, Telmex, Telcel | Existing domain module |
| UserService | Service account/reference saved by a user | Must be user-scoped |
| Payment | Mock payment record/flow | Not real money movement |
| Receipt | Mock receipt generated after payment flow | Needs traceability before production |
| Notification | User-facing message | Delivery channels pending |

## Future Concepts

| Entity | Purpose |
| --- | --- |
| Role | Defines user permission group |
| Permission | Defines allowed action/resource |
| AuditLog | Immutable record of sensitive actions |
| LedgerAccount | Accounting account for future money movement |
| LedgerEntry | Double-entry movement record |
| PaymentProvider | Selected integration provider metadata |
| PaymentAttempt | Provider-specific attempt lifecycle |
| WebhookEvent | Received provider webhook payload and processing state |
| SupportTicket | Support case around user/payment/service |
| AdminAction | Explicit administrative operation record |

## Production Rule

Real payments require ledger, provider attempt tracking, webhook event persistence, reconciliation, and audit logs before launch.
