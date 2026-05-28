# Fraud Readiness

## Purpose

Phase 11 prepares FondixPay to identify suspicious patterns and route them to authorized humans. Fraud readiness in this phase is evidence and review only.

## Scope

Implemented scope:

- Internal `fraud_signals` model.
- Admin APIs under `/admin/fraud/signals`.
- CRM/Admin list and detail screens.
- RBAC for SUPPORT read-only, FINANCE/ADMIN/SUPER_ADMIN update, AUDITOR read-only.
- Audit events for create, review, dismiss, and escalation.

Out of scope:

- Automatic user blocking.
- Automatic refunds.
- Machine learning fraud scoring.
- Production fraud engine.
- Any change to user-facing payment state.

## Signal Catalog

| Signal ID | Description | Severity | Triggering condition | Entity | Human action | Audit event | False-positive risk |
|---|---|---|---|---|---|---|---|
| `FRAUD_FAILED_PAYMENT_ATTEMPTS` | Repeated failed card/payment attempts. | medium/high | Several failed attempts for same user/payment method/window. | User/Payment | Review payment attempts and support history. | `fraud.signal.created` | Network or provider outage. |
| `FRAUD_PAYMENT_VELOCITY` | Unusual payment velocity. | high | More payments than expected for user/time window. | User | Compare service references, amounts, and prior behavior. | `fraud.signal.created` | Family/business shared account usage. |
| `FRAUD_DUPLICATE_PAYMENT_ATTEMPT` | Duplicate payment attempts. | high | Same service/reference/amount retried in suspicious pattern. | Payment | Verify idempotency, provider state, and receipt evidence. | `fraud.signal.created` | Legitimate retry after timeout. |
| `FRAUD_REFERENCE_VALIDATION_FAILURES` | Repeated reference validation failures. | medium | Multiple invalid service references for same user/device/window. | User/ServiceReference | Review account and support context. | `fraud.signal.created` | User mistypes reference. |
| `FRAUD_AMOUNT_PROVIDER_MISMATCH` | Charged amount differs from provider amount. | urgent | Card amount, provider amount, or receipt amount mismatch. | Payment | Escalate to finance reconciliation. | `fraud.signal.escalated` | Provider rounding/import issue. |
| `FRAUD_RECEIPT_STATE_MISMATCH` | Receipt contradicts transaction state. | high | Receipt generated but provider/payment state is pending, failed, or unknown. | Receipt/Payment | Open dispute or manual review. | `fraud.signal.created` | Delayed provider status update. |
| `FRAUD_MANUAL_REVIEW_PATTERN` | Suspicious manual review activity. | medium/high | Repeated overrides or unusual queue closure patterns. | AdminAction | Manager/auditor review. | `admin.override_requested` future | Operational training issue. |
| `FRAUD_PROVIDER_PENDING_STALE` | Provider pending exceeds expected time. | medium | Provider pending older than operational threshold. | ProviderTransaction | Check status and reconciliation. | `manual_review.created` future | Provider SLA delay. |
| `FRAUD_RECONCILIATION_MISMATCH` | Reconciliation mismatch. | urgent | Card, Prontipagos, receipt, or ledger mismatch. | ReconciliationRecord | Finance investigation. | `reconciliation.mismatch_detected` future | Import/report timing. |
| `FRAUD_ACCOUNT_ANOMALY` | Account anomaly. | medium | Inconsistent account/device/session/payment behavior. | User | Review account and authentication evidence. | `fraud.signal.created` | Device change. |
| `FRAUD_CHARGEBACK_BEHAVIOR` | Repeated chargeback-prone behavior. | high | Multiple disputes/chargebacks over time. | User/DisputeCase | Finance/support review; no auto-block. | `chargeback.created` | Legitimate provider failures. |
| `FRAUD_SUPPORT_DISPUTE_PATTERN` | Repeated support disputes. | medium | Frequent duplicate charge/not-paid claims. | SupportTicket/User | Review history and evidence. | `fraud.signal.created` | Poor UX or provider instability. |
| `FRAUD_ADMIN_OVERRIDE_ACTIVITY` | Admin override activity requires scrutiny. | high | Override request/approval/rejection patterns. | AdminAction | Manager/auditor review. | `admin.override_*` future | Normal incident handling. |

## Workflow

1. A signal is created manually or by future explainable rule logic.
2. The signal remains `open` until an authorized reviewer updates it.
3. Reviewer outcomes are `reviewed`, `dismissed`, or `escalated`.
4. Resolution text is required for non-open outcomes.
5. Fraud signals do not mutate payments, receipts, ledger entries, users, or provider state.

## Evidence And Retention Assumptions

Signals may link to `user_id`, `payment_id`, `transaction_id`, entity type/id, reason, and safe metadata. Metadata must exclude PAN, CVV, secrets, raw provider payloads, OTPs, and unnecessary PII.

Retention is not finalized. Until a legal retention policy exists, keep signals as operational evidence and avoid destructive deletion.

## Open Questions

- Final velocity thresholds and time windows.
- Retention period for fraud signals and related evidence.
- Whether dedicated review queues should merge fraud, disputes, support, and reconciliation into one workflow.
