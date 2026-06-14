# Sprint 075 — Completion Report

**Date:** 2026-06-13
**Status:** DONE

## What changed

### Frontend — CrmVisualApp.tsx

**`ModuleKey`** — removed `"manual-review" | "fraud" | "disputes"` (tickets had already been
absent from the type).

**`routes`** — removed `/manual-review`, `/fraud`, `/disputes` entries.

**`navGroups`** — removed:
- `"Revisión manual"` entry from the "Operación" group
- Entire `"Riesgo"` group (contained `"Señales fraude"` and `"Disputas"`)

**`renderView()`** — removed `case "manual-review"`, `case "fraud"`, `case "disputes"`.

**View functions deleted:**
- `ManualReviewView` — fetched `/admin/manual-review`; status/severity filters; 4-stat bar
- `FraudView` — fetched `/admin/fraud/signals`; status/severity filters; 4-stat bar
- `DisputesView` — fetched `/admin/disputes`; status/type filters; danger badge for chargebacks
- `TicketCard`, `TicketsView` — kanban-style ticket board
- `severityBadge()` helper — rendered urgent/high/medium/low severity pills

**Types/consts deleted:**
- `KanbanCol` type
- `KANBAN_COLS` const

**Imports** — removed `DisputeCase`, `FraudSignal`, `ManualReviewCase` from `../types/admin`

### Backend — no changes

All backend routes, models, schemas, services, RBAC permissions, and tests for manual-review,
fraud signals, disputes, and tickets remain untouched. Tekae administers these workflows
internally; backend infrastructure is preserved for future reconciliation or audit access.

## Validation

- `npm run typecheck` — 0 errores

## Acceptance criteria

- [x] `"manual-review"`, `"fraud"`, `"disputes"` removed from `ModuleKey`
- [x] Nav does not show Revisión manual, Señales fraude, or Disputas
- [x] No "Riesgo" nav group exists
- [x] `renderView()` has no cases for the removed keys
- [x] View functions `ManualReviewView`, `FraudView`, `DisputesView` deleted
- [x] `severityBadge`, `KanbanCol`, `KANBAN_COLS` deleted
- [x] Imports `DisputeCase`, `FraudSignal`, `ManualReviewCase` removed
- [x] `npm run typecheck` — 0 errors
- [x] Backend routes, models, and tests untouched

## Decision boundary

- Frontend-only change. No backend routes, models, migrations, permissions, or tests changed.
- Notifications (CRM-owned delivery logs) remain in the nav — not affected by this sprint.
- Tekae pasarela redirect code/embed is deferred to a future Tekae integration sprint.
