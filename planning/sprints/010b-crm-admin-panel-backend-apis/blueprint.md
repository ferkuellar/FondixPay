# Phase 10B Blueprint

## Runtime Design

- Extend `User` with persisted role defaulting to `USER`.
- Resolve CRM permissions server-side in `backend/app/modules/admin/permissions.py`.
- Require bearer auth plus explicit permission for every admin route.
- Redact user, payment, receipt, provider-reference, and audit metadata responses before serialization.
- Reuse existing audit writer for privileged admin views and controlled writes.

## Modules

- Read-mostly dashboard/users/payments/receipts/audit events.
- Support tickets with status update and notes.
- Manual review cases with create/update event trail.
- Card and Prontipagos reconciliation placeholders returning `not_implemented`.
