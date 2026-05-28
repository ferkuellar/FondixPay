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

### Phase 10C Frontend Navigation

The `admin/` frontend uses the same runtime permission names to hide module navigation, detail routes, ticket writes, manual-review writes, reconciliation pages, and audit logs. This is a UX guard only: every click still depends on backend `/admin/*` authorization, and frontend dev-role rendering must never be treated as a permission grant.

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
## Phase 10D - CRM Workflow Permissions

All `/admin/*` workflow endpoints require authentication and explicit permission checks.

| Workflow | SUPPORT | FINANCE | ADMIN | AUDITOR | SUPER_ADMIN |
|---|---|---|---|---|---|
| Support ticket list/view | yes | yes | yes | yes | yes |
| Support ticket create/update/note | yes | no | yes | no | yes |
| Support ticket close | yes, with resolution | no | yes, with resolution | no | yes, with resolution |
| Manual review list/view | limited read | yes | yes | read-only | yes |
| Manual review create/update | no | yes | yes | no | yes |
| Manual review close/resolve | no | yes, with resolution | yes, with resolution | no | yes, with resolution |
| Card reconciliation | no | yes | yes | yes | yes |
| Prontipagos reconciliation | no | yes | yes | yes | yes |
| Operational search | yes, redacted | yes | yes | yes, read-only | yes |

Rules:

- SUPPORT cannot view full reconciliation.
- SUPPORT cannot resolve financial manual review cases.
- AUDITOR is read-only.
- FINANCE cannot mutate ledger, payment amounts, provider confirmations, or receipts.
- SUPER_ADMIN still cannot see PAN/CVV/secrets/tokens/raw payloads.
- No admin workflow endpoint may exist without a permission entry.

## Phase 10X.1 Chatbot Permissions

| Permission | SUPPORT | FINANCE | ADMIN | AUDITOR | SUPER_ADMIN |
|---|---|---|---|---|---|
| `admin.chatbot.view` | yes | yes | yes | yes | yes |
| `admin.chatbot.manage` | no | no | yes | no | yes |
| `admin.chatbot.settings.manage` | no | no | yes | no | yes |
| `admin.chatbot.conversations.view` | yes | yes | yes | yes | yes |
| `admin.chatbot.fallbacks.review` | yes | yes | yes | no | yes |

Rules:

- `USER` has no chatbot admin permissions.
- `SUPPORT` may review masked conversations and fallbacks but cannot change public response configuration.
- `FINANCE` may view masked chatbot context for operational risk review but cannot manage bot responses.
- `AUDITOR` is read-only and cannot review/resolve fallbacks.
- Only `ADMIN` and `SUPER_ADMIN` can manage FAQs, intents, knowledge entries, and settings.

## Phase 10X.2 Chat Operations Permissions

| Permission | SUPPORT | FINANCE | ADMIN | AUDITOR | SUPER_ADMIN |
|---|---|---|---|---|---|
| `admin.chat_ops.view` | yes | yes | yes | yes | yes |
| `admin.chat_ops.assign` | yes | no | yes | no | yes |
| `admin.chat_ops.notes.create` | yes | no | yes | no | yes |
| `admin.chat_ops.first_response` | yes | no | yes | no | yes |
| `admin.chat_ops.manage` | no | no | yes | no | yes |
| `admin.chat_ops.severity.override` | no | no | yes | no | yes |

Rules:

- `SUPPORT` maps to the support-agent role. It can view the queue, assign to self, add notes, and mark first response.
- `ADMIN` and `SUPER_ADMIN` map to manager/admin roles and can create tickets, escalate, resolve/close/reopen chat-origin tickets, and override severity.
- `FINANCE` and `AUDITOR` are read-only for Chat Operations in this phase.
- `SUPPORT` cannot downgrade `SEV-1` without manager/admin approval.
- `SEV-1` and `SEV-2` require human review and cannot be auto-closed by AI.
