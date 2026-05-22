# Permissions

Current state: the user-facing owner-scope model remains active and Phase 10B adds server-side RBAC for implemented `/admin/*` backend routes.

| Role | Intended Access |
| --- | --- |
| USER | Can view and manage only their own services, payments, receipts, notifications, and profile |
| SUPPORT | Can consult cases and minimum necessary user/payment data for support |
| FINANCE | Can review payments, receipts, reconciliation, and financial reports |
| ADMIN | Can administer catalogs, users, and operational configuration within defined limits |
| AUDITOR | Read-only access to events, audit logs, and traceability evidence |
| SUPER_ADMIN | Controls critical configuration and privileged administrative actions |

## Rules

- USER must never access another user's services, payments, receipts, or notifications.
- SUPPORT should see only the minimum data required for an assigned case.
- FINANCE should not modify user identity or security settings.
- ADMIN mutations must be auditable.
- AUDITOR is read-only.
- SUPER_ADMIN actions require strict audit logging and may require future approval workflows.

## Pending

- Dedicated hardened admin authentication and MFA.
- Export permissions and controls.
- CRM frontend route visibility.

## CRM Admin Panel Permissions

Phase 10A defines the CRM/Admin contract before runtime implementation. No admin endpoint may be added without a defined role, permission, redacted response contract, audit policy, and permission tests.

### CRM Roles

- `SUPPORT`: limited user/payment/receipt investigation and ticket operations.
- `FINANCE`: payment, receipt, reconciliation, ledger read-only, and manual-review evidence.
- `ADMIN`: safe operational catalog/support management.
- `AUDITOR`: read-only audit, ledger, payment, receipt, and reconciliation evidence.
- `SUPER_ADMIN`: critical role/configuration controls under strict audit and future MFA.

### Permission Families

| Module | Permissions |
|---|---|
| Dashboard | `view_dashboard` |
| Users | `view_user`, `view_user_sensitive_limited` |
| Payments/Receipts | `view_payment`, `view_receipt`, `view_provider_references` |
| Ledger/Audit | `view_ledger`, `view_audit_logs` |
| Reconciliation | `view_reconciliation` |
| Manual Review | `open_manual_review`, `resolve_manual_review` |
| Support Tickets | `create_support_ticket`, `update_support_ticket` |
| Catalog/Config | `manage_catalog`, `manage_roles`, `manage_config` |
| Export | `export_data` |

### Phase 10B Runtime Permission Map

| Runtime permission | SUPPORT | FINANCE | ADMIN | AUDITOR | SUPER_ADMIN |
|---|---|---|---|---|---|
| `admin.dashboard.view` | yes | yes | yes | yes | yes |
| `admin.users.list`, `admin.users.view` | yes | yes | yes | yes | yes |
| `admin.payments.list`, `admin.payments.view` | yes | yes | yes | yes | yes |
| `admin.receipts.list`, `admin.receipts.view` | yes | yes | yes | yes | yes |
| `admin.audit.list` | no | no | yes | yes | yes |
| `admin.reconciliation.card.view`, `admin.reconciliation.prontipagos.view` | no | yes | yes | yes | yes |
| `admin.manual_review.list`, `admin.manual_review.view` | yes | yes | yes | yes | yes |
| `admin.manual_review.update` | no | yes | yes | no | yes |
| `admin.support_tickets.list` | yes | yes | yes | yes | yes |
| `admin.support_tickets.create`, `admin.support_tickets.update` | yes | no | yes | no | yes |

Every implemented admin endpoint binds one runtime permission through the FastAPI dependency layer. A normal `USER` role receives `403` even with a valid bearer token.

### Allowed And Prohibited Actions

- `SUPPORT` can use limited user/payment/receipt views and support tickets; it cannot mutate ledger or resolve financial review.
- `FINANCE` can read reconciliation and ledger evidence and resolve permitted manual-review cases; it cannot edit ledger destructively.
- `ADMIN` can manage approved catalog/support operations; it cannot bypass RBAC or expose secrets.
- `AUDITOR` is read-only.
- `SUPER_ADMIN` controls roles/configuration only through audited, permissioned, future hardened sessions.

### Redaction Rules

- PAN and CVV are never visible.
- Card tokens, secrets, OTPs, session tokens, and raw provider payloads are never exposed.
- Phone/email are masked by default.
- Provider references are limited for `SUPPORT` and available only where permissioned.
- Audit metadata is redacted and role-dependent.
