# CRM Admin Panel Architecture

## Executive Summary

FondixPay requires a CRM Admin Panel before commercial production. Card charging, Prontipagos service execution, proof of payment, support, manual review, reconciliation, ledger evidence, and audit evidence are separate operational facts. A mobile app alone cannot investigate payment ambiguity, missing receipts, provider mismatch, user claims, or privileged configuration safely.

Phase 10A defines the architecture and security contract for that internal system. It does not implement admin APIs, admin authentication, a web frontend, database roles, provider reconciliation, or production money movement.

## Design Goals

- Operate user support with minimum necessary data.
- Keep card processor and Prontipagos reconciliation separate.
- Route ambiguous payment states into manual review.
- Make admin actions auditable and reviewable.
- Require explicit RBAC and permissions before every admin endpoint.
- Protect sensitive card, user, provider, audit, and configuration data.
- Provide read visibility for payments, receipts, proof, movements, ledger entries, and provider references.
- Investigate by `payment_id`, `receipt_id`, `correlation_id`, and approved provider references.
- Support operations without exposing PAN, CVV, secrets, tokens, or raw provider payloads.

## Non-Goals

- No implementation in this phase.
- No real CRM frontend or admin API endpoint.
- No production admin login.
- No destructive financial action from admin.
- No PAN/CVV, secrets, raw card tokens, or raw provider payload exposure.
- No real provider integration, reconciliation job, chargeback workflow, or production release.

## Admin Panel Users

| Role | Primary responsibility |
|---|---|
| `SUPPORT` | Investigate assigned user/payment/receipt issues with limited data and support tickets. |
| `FINANCE` | Review payments, receipts, ledger evidence, reconciliation, and manual review facts read-only. |
| `ADMIN` | Operate catalog/support workflows and safe operational management. |
| `AUDITOR` | Read audit, ledger, payment, receipt, and reconciliation evidence without mutation. |
| `SUPER_ADMIN` | Manage critical role/config controls under strict audit and future MFA. |

Optional future roles: `COMPLIANCE`, `RISK_ANALYST`, `OPERATIONS_MANAGER`.

## Core Modules

### 1. Dashboard Operativo

- KPIs for succeeded, failed, pending, timeout, receipt pending, receipt unavailable, manual review backlog, and provider health.
- Filters by environment, provider leg, time window, service provider, and state.
- No dashboard tile should imply production readiness or provider confirmation without mapped evidence.

### 2. Usuarios

- Search by masked phone/email when available, `user_id`, safe support reference, and related payment references.
- Minimal user detail, saved services, payments, receipts, ticket links, and restrictions.
- Data minimization by role.

### 3. Pagos

- List and detail views.
- Card processor state and Prontipagos state shown separately.
- Fee breakdown, payment recovery state, attempt trail, receipt state, provider reference, and `correlation_id`.
- No raw provider payload or destructive state override.

### 4. Recibos / Proof of Payment

- Generated, pending, unavailable, future voided proof.
- Fee breakdown and safe references.
- Receipt/proof view history where audit policy allows.
- Mock/sandbox/productive certainty must remain explicit.

### 5. Movimientos / Ledger View

- Read-only ledger accounts, entries, movement projections, and correlation links.
- Corrections require future controlled financial workflows and compensating records, not admin edit/delete.

### 6. Card Processor Reconciliation

- Card charge status, processor safe reference, authorization/capture/decline/timeout facts.
- Future chargeback/dispute visibility without direct destructive action in initial CRM.
- Separate reconciliation leg from Prontipagos.

### 7. Prontipagos Reconciliation

- Provider reference, service payment status, amount mismatch, timeout, receipt missing, duplicate provider references.
- Explicit service-provider confirmation evidence and status check history when implemented.

### 8. Manual Review Queue

- Ambiguous cases, card success plus Prontipagos failed, Prontipagos pending, receipt unavailable, duplicate suspected, and amount mismatch.
- Assignment, notes, escalation, decision evidence, and audit trail.

### 9. Support Tickets

- Create/update support tickets associated with user, payment, receipt, proof, and manual review case.
- Internal notes, assignment, status, priority, safe user communication log.

### 10. Audit Logs

- Read auth, payment, receipt, provider, notification, and admin audit events by permitted roles.
- Audit views themselves emit future admin audit events.

### 11. Catalog / Service Providers

- View normalized providers and service catalog.
- Admin-authorized operational changes only after 10B+ permission/tests.

### 12. Settings / Configuration

- `SUPER_ADMIN` only for critical configuration visibility/change paths.
- No secrets displayed.
- Every future config change audited and preferably approval-gated for sensitive production switches.

## RBAC Matrix

`allow` means future endpoint and frontend affordance may exist only after backend permission enforcement. `limited` means redacted or assigned-case scope.

| Module | Action | SUPPORT | FINANCE | ADMIN | AUDITOR | SUPER_ADMIN |
|---|---|---|---|---|---|---|
| Dashboard | `view_dashboard` | allow | allow | allow | allow | allow |
| Users | `view_user` | limited | allow | allow | allow | allow |
| Users | `view_user_sensitive_limited` | limited | limited | limited | limited | limited |
| Payments | `view_payment` | limited | allow | allow | allow | allow |
| Receipts | `view_receipt` | limited | allow | allow | allow | allow |
| Ledger | `view_ledger` | deny | allow | limited | allow | allow |
| Audit Logs | `view_audit_logs` | deny | limited | limited | allow | allow |
| Reconciliation | `view_reconciliation` | limited | allow | allow | allow | allow |
| Manual Review | `open_manual_review` | allow | allow | allow | deny | allow |
| Manual Review | `resolve_manual_review` | deny | allow | allow | deny | allow |
| Support Tickets | `create_support_ticket` | allow | allow | allow | deny | allow |
| Support Tickets | `update_support_ticket` | allow | allow | allow | deny | allow |
| Catalog | `manage_catalog` | deny | deny | allow | deny | allow |
| Roles | `manage_roles` | deny | deny | deny | deny | allow |
| Settings | `manage_config` | deny | deny | deny | deny | allow |
| Export | `export_data` | deny | controlled | controlled | controlled | controlled |
| References | `view_provider_references` | limited | allow | allow | allow | allow |

Every 10B endpoint must bind required role and named permission before route creation.

## Data Redaction Rules

| Data | Rule |
|---|---|
| PAN | Never visible; should not be stored by FondixPay. |
| CVV | Never stored or visible. |
| Card token / vault token | Never displayed in CRM. |
| Card brand/last4 | May be visible when needed to `SUPPORT`, `FINANCE`, `ADMIN`, `AUDITOR`, `SUPER_ADMIN`. |
| Provider raw payload | Hidden; use mapped fields, hashes, and redacted evidence. |
| Provider reference | Visible to `FINANCE`, `ADMIN`, `AUDITOR`, `SUPER_ADMIN`; `SUPPORT` only with limited assigned-case use. |
| Email/phone | Mask by default; unmasking policy must be permissioned and audited if ever approved. |
| Audit metadata | Role-dependent redacted view; no secrets or raw sensitive payloads. |
| Secrets/config credentials | Never visible in CRM responses. |

## Admin Authentication

- Prefer a separate admin authentication and authorization boundary or an explicit role-based extension that cannot be confused with end-user mobile auth.
- Future admin MFA is mandatory before production.
- Strong admin session expiration, refresh/revocation, device/session inventory, and logout audit are required.
- Future IP/device trust and risk controls should be evaluated for privileged roles.
- Rate limit admin login, search, export, and mutation endpoints.
- Shared admin accounts are prohibited.
- Admin login/session events must be auditable.

## Manual Review Workflow

States:

- `open`
- `assigned`
- `investigating`
- `waiting_provider`
- `waiting_user`
- `resolved`
- `escalated`
- `closed`

Case types:

- `card_success_prontipagos_failed`
- `prontipagos_pending`
- `receipt_unavailable`
- `duplicate_attempt`
- `amount_mismatch`
- `chargeback_suspected`
- `user_claims_not_paid`
- `provider_timeout`

Required rules:

- Case creation preserves state evidence and safe references.
- Assignment and resolution are audited.
- A manual review decision cannot rewrite ledger history or bypass provider confirmation rules.
- Resolution stores safe notes, evidence type, actor, permission, and next user-facing action.

## Reconciliation Workflow

1. Reconcile card processor charge records against internal card/payment attempt evidence.
2. Reconcile Prontipagos service-payment records against provider transactions, receipts, and internal payment state separately.
3. Run at least daily when real providers exist.
4. Detect missing, pending, duplicate, timeout, and amount mismatch conditions.
5. Create manual review cases for unresolved mismatches.
6. Preserve safe export/import references and reconciliation notes.
7. Emit reconciliation and admin-view audit events.

## Support Workflow

Search entry points:

- masked phone/email when available,
- `user_id`,
- `payment_id`,
- `receipt_id`,
- `correlation_id`,
- permitted `provider_reference`.

Support flow:

1. Search with minimum sufficient reference.
2. Open limited user/payment/receipt view.
3. Verify status certainty, receipt/proof state, fee breakdown, and safe references.
4. Create a ticket and attach internal safe notes.
5. Escalate pending/provider mismatch to manual review or finance.
6. Communicate only user-safe status and never expose internal secrets/provider payloads.

## Audit Events

Future admin event catalog:

- `admin.login`
- `admin.logout`
- `admin.user_viewed`
- `admin.payment_viewed`
- `admin.receipt_viewed`
- `admin.ledger_viewed`
- `admin.audit_log_viewed`
- `admin.ticket_created`
- `admin.ticket_updated`
- `admin.manual_review_opened`
- `admin.manual_review_assigned`
- `admin.manual_review_resolved`
- `admin.reconciliation_viewed`
- `admin.config_viewed`
- `admin.config_changed`
- `admin.role_changed`
- `admin.export_requested`

## Admin API Proposal

All endpoints are future/proposed. Pagination, filters, auth, permission checks, response redaction, and audit coverage are mandatory.

| Endpoint | Purpose | Required role | Permission | Sensitive fields | Audit event | Filters | Pagination | Export |
|---|---|---|---|---|---|---|---|---|
| `GET /admin/dashboard` | Operational KPI summary | ops roles | `view_dashboard` | aggregates only | `admin.dashboard_viewed` future | date/provider/state | n/a | no |
| `GET /admin/users` | User search | `SUPPORT+` | `view_user` | masked identity | `admin.user_search` future | id/phone/email/status | yes | no |
| `GET /admin/users/{id}` | User detail | `SUPPORT+` | `view_user` | masked/limited identity | `admin.user_viewed` | section flags | n/a | no |
| `GET /admin/payments` | Payment search | `SUPPORT+` | `view_payment` | card/provider redaction | `admin.payment_search` future | state/id/reference/date | yes | controlled future |
| `GET /admin/payments/{id}` | Payment detail | `SUPPORT+` | `view_payment` | mapped provider fields | `admin.payment_viewed` | include attempts safe | n/a | no |
| `GET /admin/receipts` | Receipt search | `SUPPORT+` | `view_receipt` | proof safe only | `admin.receipt_search` future | status/reference/date | yes | controlled future |
| `GET /admin/receipts/{id}` | Receipt proof detail | `SUPPORT+` | `view_receipt` | safe references | `admin.receipt_viewed` | none | n/a | no |
| `GET /admin/ledger` | Ledger read view | `FINANCE`/`AUDITOR` | `view_ledger` | financial read scope | `admin.ledger_viewed` | account/payment/correlation | yes | controlled future |
| `GET /admin/audit-events` | Audit event read | `AUDITOR`/limited admin | `view_audit_logs` | redacted metadata | `admin.audit_log_viewed` | actor/entity/event/date | yes | controlled future |
| `GET /admin/reconciliation/card` | Card reconciliation rows | finance/audit | `view_reconciliation` | safe processor refs | `admin.reconciliation_viewed` | state/date/reference | yes | controlled future |
| `GET /admin/reconciliation/prontipagos` | Prontipagos reconciliation rows | finance/audit | `view_reconciliation` | safe provider refs | `admin.reconciliation_viewed` | state/date/reference | yes | controlled future |
| `GET /admin/manual-review` | Manual queue | ops roles | `open_manual_review` or read permission | safe case evidence | `admin.manual_review_listed` future | status/type/assignee | yes | no |
| `GET /admin/manual-review/{id}` | Manual case detail | ops roles | queue read | safe evidence | `admin.manual_review_viewed` future | none | n/a | no |
| `PATCH /admin/manual-review/{id}` | Assign/update case | finance/admin | `resolve_manual_review` | resolution notes redacted | assign/resolve event | none | n/a | no |
| `GET /admin/support/tickets` | Ticket list | support/admin | ticket read | safe notes | `admin.ticket_listed` future | status/priority/assignee | yes | no |
| `POST /admin/support/tickets` | Create ticket | support/admin | `create_support_ticket` | safe note body | `admin.ticket_created` | n/a | n/a | no |
| `PATCH /admin/support/tickets/{id}` | Update ticket | support/admin | `update_support_ticket` | safe note/status | `admin.ticket_updated` | n/a | n/a | no |
| `GET /admin/catalog/service-providers` | Catalog admin view | admin | catalog read/manage | catalog only | `admin.catalog_viewed` future | status/category | yes | no |
| `PATCH /admin/catalog/service-providers/{id}` | Safe provider catalog update | admin | `manage_catalog` | no secrets | `admin.catalog_changed` future | n/a | n/a | no |

## Admin Frontend Architecture

- Use a web admin separate from the mobile Expo client.
- Recommended starting point for the future phase: React + Vite + TypeScript for a bounded internal console unless the team decides Next.js server features are needed.
- Route groups by module with role-based navigation generated from permission claims, not frontend-only trust.
- Layout should favor tables, filters, side detail panels/pages, badges, audit-safe reference blocks, and explicit redaction components.
- Use API response contracts that are already redacted; frontend utilities can further mask display but cannot be the authorization boundary.
- Reuse shared status semantics from payment, receipt proof, manual review, and reconciliation docs.

## Security Requirements

- RBAC and explicit permissions on every admin API.
- Future MFA and hardened admin session management.
- Least privilege and no shared accounts.
- Audit logging for privileged reads and mutations.
- Redaction for user, card, provider, audit, and config data.
- No PAN, CVV, secrets, or raw provider payloads.
- Rate limits and account lockout/backoff for admin auth/search/export.
- Export controls, request justification/approval policy where appropriate, and audit.
- Secure logs with redacted metadata.
- Read-only audit and ledger views.
- Manual review decisions preserve evidence and audit trail.

## Operations Metrics

- `admin_login_count`
- `failed_admin_login_count`
- `support_ticket_count`
- `manual_review_open_count`
- `manual_review_resolution_time`
- `payment_pending_count`
- `payment_failed_count`
- `receipt_unavailable_count`
- `card_reconciliation_mismatch_count`
- `prontipagos_reconciliation_mismatch_count`
- `audit_log_view_count`
- `export_request_count`

## Production Gates

Before commercial production:

- Admin auth and RBAC implemented.
- Support can investigate payment and receipt cases safely.
- Finance can view card and Prontipagos reconciliation separately.
- Auditor can read audit logs with redaction.
- Manual review queue exists.
- Redaction verified by tests and review.
- Admin actions audited.
- No PAN/CVV exposure.
- Permission tests cover admin APIs.
- Operations runbooks are ready.
## Phase 10D Implementation Status

- Support workflows: implemented for minimum internal operations with entity links, correlation references, notes, assignment, close timestamps, and required resolution notes.
- Manual review workflows: implemented for minimum operations with case types, summary, status transitions, event log, close timestamps, notes, and required resolution before resolved/closed.
- Reconciliation: card processor and Prontipagos remain separated placeholders with zero-count summary, empty items, and `production_ready=false`.
- Search/investigation: partially implemented via `/admin/search` for IDs, correlation IDs, provider references, tickets, manual review, payments, receipts, and users.
- RBAC: enforced by backend permissions and reflected in the admin frontend navigation/actions.
- Audit: admin workflow events are emitted through the existing audit writer; manual review also has a case event log.
- Production: still blocked. No real provider reconciliation, no money movement, no destructive ledger edits, no production card/Prontipagos integration, and no PAN/CVV exposure.

## Future WhatsApp Receipt Delivery Visibility

The CRM Admin Panel should eventually show WhatsApp receipt delivery status as notification evidence only.

Future CRM behavior:

- Show receipt notification attempts linked to `receipt_id`, `payment_id`, and `correlation_id`.
- Show delivery status, template name, and safe provider message id when permitted.
- Never show full phone numbers.
- Never show raw provider payloads or raw provider errors.
- SUPPORT may see limited delivery status for user assistance.
- Retry must require a future explicit permission and idempotency check.
- WhatsApp delivery failure must not change payment, receipt, proof, or ledger status.

This is future architecture only. Phase 10D.1 does not add CRM runtime behavior.
