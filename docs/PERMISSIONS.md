# Permissions

Current state: preliminary matrix. RBAC is pending implementation unless verified in a later technical hardening phase.

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

- Backend RBAC implementation.
- Route-level permission map.
- Ownership tests.
- Audit logging for privileged actions.
