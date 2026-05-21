# CRM RBAC Matrix

## Roles

| Role | Scope |
|---|---|
| `SUPPORT` | Limited case investigation and ticket handling. |
| `FINANCE` | Payment, receipt, reconciliation, ledger, and manual-review evidence read/decision scope. |
| `ADMIN` | Operational catalog and support management with safe payment visibility. |
| `AUDITOR` | Read-only evidence access for audit, ledger, reconciliation, payment, and receipt history. |
| `SUPER_ADMIN` | Critical roles/configuration under strict audit and future MFA. |

## Permission Catalog

| Permission | Meaning |
|---|---|
| `view_dashboard` | Read operational KPI summary. |
| `view_user` | Read allowed user profile/support context. |
| `view_user_sensitive_limited` | Read approved masked or limited identity fields only. |
| `view_payment` | Read payment, attempt, and status evidence. |
| `view_receipt` | Read receipt/proof evidence. |
| `view_ledger` | Read ledger/movement evidence. |
| `view_audit_logs` | Read redacted audit events. |
| `view_reconciliation` | Read reconciliation records by provider leg. |
| `open_manual_review` | Create or open review cases. |
| `resolve_manual_review` | Assign, resolve, escalate, or close review cases. |
| `create_support_ticket` | Create support tickets. |
| `update_support_ticket` | Update safe ticket status and notes. |
| `manage_catalog` | Mutate approved service-provider catalog fields. |
| `manage_roles` | Manage future role assignment and permission grants. |
| `manage_config` | View/change safe critical configuration paths. |
| `export_data` | Request controlled export where allowed. |
| `view_provider_references` | Read approved provider references. |

## Module Matrix

| Module / Action | SUPPORT | FINANCE | ADMIN | AUDITOR | SUPER_ADMIN |
|---|---|---|---|---|---|
| Dashboard read | yes | yes | yes | yes | yes |
| User search/detail | limited | yes | yes | yes | yes |
| User sensitive identity | masked only | masked only | masked only | masked only | masked only |
| Payment search/detail | limited | yes | yes | yes | yes |
| Receipt/proof search/detail | limited | yes | yes | yes | yes |
| Provider reference search | assigned-case limited | yes | yes | yes | yes |
| Ledger/movements view | no | read-only | limited read-only | read-only | read-only |
| Audit log view | no | limited read-only | limited read-only | read-only | read-only |
| Reconciliation card view | limited summary | read-only | read-only | read-only | read-only |
| Reconciliation Prontipagos view | limited summary | read-only | read-only | read-only | read-only |
| Manual review open | yes | yes | yes | no | yes |
| Manual review resolve | no | yes | yes | no | yes |
| Support ticket create/update | yes | yes | yes | no | yes |
| Catalog manage | no | no | yes | no | yes |
| Role manage | no | no | no | no | yes |
| Config manage | no | no | no | no | yes |
| Controlled export | no | policy-gated | policy-gated | policy-gated | policy-gated |

## Data Visibility

| Field Class | SUPPORT | FINANCE | ADMIN | AUDITOR | SUPER_ADMIN |
|---|---|---|---|---|---|
| User phone/email | masked | masked by default | masked by default | masked | masked by default |
| User services | safe detail | safe detail | safe detail | safe detail | safe detail |
| Payment amount/fee/total | yes | yes | yes | yes | yes |
| Ledger entries | no | yes read-only | limited read-only | yes read-only | yes read-only |
| Card brand/last4 | yes if needed | yes | yes | yes | yes |
| PAN/CVV | never | never | never | never | never |
| Card token | never | never | never | never | never |
| Provider reference | limited | yes | yes | yes | yes |
| Raw provider payload | never | never | never | never | never |
| Secrets/config credentials | never | never | never | never | never |
| Redacted audit metadata | no | limited | limited | yes | yes |

## Prohibited Actions

- No role may view PAN or CVV.
- No role may expose provider secrets, card tokens, OTPs, session tokens, or raw provider payloads.
- No CRM role may edit or delete ledger entries destructively.
- `SUPPORT` may not change payment financial state or resolve finance review.
- `FINANCE` may not manage user security identity or critical configuration.
- `AUDITOR` may not create tickets, change cases, change catalog, or mutate config.
- `ADMIN` may not grant roles or bypass audit policy.
- `SUPER_ADMIN` still cannot bypass audit trail or redaction rules.

## Audit Requirements

- Privileged read actions on user, payment, receipt, ledger, audit, reconciliation, config, and export surfaces create admin audit events according to policy.
- Mutations of ticket, catalog, manual review, role, or configuration always create audit events with actor, role, permission, entity, result, request data, and safe before/after when applicable.
- Permission denial should be observable without leaking protected data.

## Example Scenarios

### Support investigates missing receipt

`SUPPORT` searches by `receipt_id` or `correlation_id`, sees limited payment/receipt proof state, safe fee breakdown, and limited provider reference if assigned. `SUPPORT` creates a ticket and escalates to manual review if provider status is ambiguous.

### Finance reviews mismatch

`FINANCE` reads card reconciliation and Prontipagos reconciliation separately, opens the payment/ledger evidence, resolves or escalates a manual review case, and cannot rewrite ledger entries.

### Auditor reviews production incident

`AUDITOR` reads redacted audit events, ledger evidence, reconciliation result, and payment/receipt status timeline. `AUDITOR` cannot update tickets or case state.

### Super admin changes catalog-critical configuration

`SUPER_ADMIN` passes future MFA/session controls, uses explicit permission, triggers audit event with safe before/after, and still cannot view secrets in the response.
