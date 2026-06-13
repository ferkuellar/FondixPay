# Sprint 068 — CRM: Wire Live Data Views

## Problem

`admin/src/crm/CrmVisualApp.tsx` is the main CRM shell rendered by `App.tsx`. It has 7 internal views that use hardcoded static arrays:

- `users` const → `UsersView`
- `payments` const → `PaymentsView`
- `receipts` const → `TableView` (receipts case)
- `tickets` const → `TicketsView`
- `conversations` const → `ChatConsoleView` (4 fake rows)
- `auditLogs` const → `TableView` (audit-logs case)
- `ReconciliationView` → hardcoded KPIs ($4.2M, "Cuadrada")

Separate page components (`ChatOperationsPage.tsx`, `UsersPage.tsx`, etc.) are fully connected to real backend APIs but are dead code — not rendered by App.tsx.

## Goal

Replace every hardcoded view in CrmVisualApp with real backend data. No fake financial KPIs, no fake conversations, no fake users/payments/tickets should appear in the CRM.

## Scope

### Files to change
- `admin/src/crm/CrmVisualApp.tsx`

### Changes

1. **`chat` case** — Import `ChatOperationsPage` and render it directly. Remove `ChatConsoleView` function and `conversations` const.

2. **`UsersView`** — Replace hardcoded `users` const with `api.users({})` call via `useEffect`. Show loading state. Map `AdminUser` fields to the existing table columns.

3. **`PaymentsView`** — Replace `payments` const with `api.payments({})`. Map `AdminPayment` to table rows.

4. **`TicketsView`** — Replace `tickets` const with `api.tickets()`. Map `SupportTicket` to kanban cards.

5. **`receipts` case** — Create `ReceiptsView` function using `api.receipts({})`. Map `AdminReceipt` to table rows.

6. **`audit-logs` case** — Create `AuditLogsView` function using `api.auditEvents({})`. Map `AuditEvent` to table rows.

7. **`ReconciliationView`** — Remove hardcoded KPIs. Show honest "Pendiente de implementación — disponible con integración Tekae" card.

8. **Remove** hardcoded `const users`, `const payments`, `const receipts`, `const tickets`, `const conversations`, `const auditLogs` from module scope.

## Out of scope
- Dashboard chart data (LineMock, HourlyBars, Bar components) — separate sprint
- SearchView — already a stub, not fake data
- New endpoints or backend changes
- Mobile app changes

## Acceptance criteria
- No fake user names (Carlos Ortiz, María García) visible in production
- No fake payment amounts ($1,247.50, $249.00) visible in production
- No fake conversations ("Mi pago de Totalplay no se aplica") visible in production
- No fake reconciliation KPIs ($4.2M) visible in production
- Real users from `/admin/users` appear in Users view
- Real payments from `/admin/payments` appear in Payments view
- Real tickets from `/admin/support/tickets` appear in Tickets kanban
- Chat view renders real ChatOperationsPage with real conversations (empty state if none)
- Reconciliation shows honest "not implemented" state
- TypeScript compiles without errors
