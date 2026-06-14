# Sprint 075 — Remove Tekae-Managed Tabs from CRM

## Objective

Remove the CRM nav entries and view functions for Tickets, Revisión Manual, Señales de Fraude,
and Disputas. These workflows are administered exclusively by Tekae inside their payment gateway.
FondixPay does not duplicate Tekae's internal tooling; it only inserts an embed code to redirect
operators to the Tekae pasarela when needed.

## Background

Sprint 074 wired all four modules (ManualReview, FraudSignals, Disputes, Notifications) to live
backend endpoints. After review, the business decision was made that Tekae manages Tickets,
Revisión Manual, Señales de Fraude, and Disputas internally. FondixPay operators access those
workflows through Tekae's own portal — not through a duplicate CRM view.

Notifications remain: that module is FondixPay-owned (delivery logs, not dispute/fraud workflows).

## Scope

### Frontend changes (CrmVisualApp.tsx only)

Remove from `ModuleKey`:
- `"tickets"` (was removed earlier; double-check it's gone)
- `"manual-review"`
- `"fraud"`
- `"disputes"`

Remove from `routes`:
- `/manual-review`, `/fraud`, `/disputes`

Remove from `navGroups`:
- "Revisión manual" from Operación group
- Entire "Riesgo" group (Señales fraude + Disputas)

Remove `renderView()` cases:
- `"manual-review"`, `"fraud"`, `"disputes"`

Remove view functions:
- `ManualReviewView`, `FraudView`, `DisputesView`, `TicketsView`, `TicketCard`

Remove shared helpers used only by removed views:
- `severityBadge()`
- `KanbanCol` type
- `KANBAN_COLS` const

Update imports — remove types no longer referenced:
- `DisputeCase`, `FraudSignal`, `ManualReviewCase`

### Backend — no changes

Backend routes, models, schemas, services, and tests for manual-review, fraud signals, disputes,
and tickets remain intact. They are production infrastructure even though FondixPay CRM does not
expose them directly. Tekae uses its own interface for these workflows.

## Acceptance criteria

- [ ] `"manual-review"`, `"fraud"`, `"disputes"` no longer appear in `ModuleKey`
- [ ] Nav does not show Revisión manual, Señales fraude, or Disputas
- [ ] No "Riesgo" nav group exists
- [ ] `renderView()` has no cases for the removed keys
- [ ] View functions `ManualReviewView`, `FraudView`, `DisputesView` are deleted
- [ ] `severityBadge`, `KanbanCol`, `KANBAN_COLS` are deleted
- [ ] Imports `DisputeCase`, `FraudSignal`, `ManualReviewCase` are removed
- [ ] `npm run typecheck` passes with 0 errors
- [ ] Backend routes, models, and tests for these modules are untouched
