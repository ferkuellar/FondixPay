# Sprint 070 — Dashboard Honest State

## Problem

`DashboardView` in `CrmVisualApp.tsx` has 4 fake/misleading data sources:

1. `SparklineMini` — hardcoded SVG sparkline on the "Total pagos" KPI implying real trend data.
2. `LineMock` — fake 30-day TPV line chart with invented data points.
3. Hardcoded "Volumen por categoría" — fake $38.4M CFE, $22.8M Internet bars.
4. `HourlyBars` — deterministic fake hourly traffic bars (no relation to real payment volume).
5. 3 hardcoded fake alerts — "Tasa de fallo CoDi > 5%", "Cola de soporte sobre SLA", "Pico de tráfico CFE" — none of these correspond to real system state.

These components exist alongside the real KPI grid (users, payments, tickets — all wired to the backend). The fake chart data below the KPIs undermines trust in the real data above them.

## Goal

Remove all fake/hardcoded chart data from DashboardView. Replace with:
- Honest "analytics pending" placeholder for chart areas (TPV trend, volume by category, hourly traffic).
- Real operational alerts derived from the existing `DashboardSummary` data that is already returned by `GET /admin/dashboard`.

## Scope

### Files to change
- `admin/src/crm/CrmVisualApp.tsx`

### Changes

1. Remove `SparklineMini` component usage from the "Total pagos" KPI card.
2. Replace the `<LineMock />` TPV card with an analytics-pending placeholder.
3. Replace the hardcoded volume-by-category bar chart with a placeholder.
4. Replace `<HourlyBars />` hourly traffic card with a placeholder.
5. Replace the 3 hardcoded fake alerts with a real alert list derived from `DashboardSummary`:
   - `payments_failed_count > 0` → warn about failed payments
   - `manual_review_open_count > 0` → notify open manual review cases
   - `support_tickets_open_count > 0` → notify open support tickets
   - `card_reconciliation_status !== "ok"` → note reconciliation status
   - All zero / nominal → show "No hay alertas activas"
6. Delete dead helper functions: `LineMock`, `HourlyBars`, `SparklineMini`.
7. Keep `Alert` and `Bar` helper functions (generic utility, reusable when real chart data lands).

## Out of scope
- New backend endpoints for chart/analytics data
- Real payment trend APIs
- Any mobile or backend change
- Dashboard KPI grid changes (already correct)

## Acceptance criteria
- [ ] No fake SVG sparkline on any KPI card
- [ ] No fake $38.4M / $22.8M volume bars
- [ ] No fake CoDi / SLA / CFE alerts
- [ ] No fake hourly traffic bars
- [ ] Alerts section shows real counts from `DashboardSummary`
- [ ] Alerts section shows "No hay alertas" when all counts are nominal
- [ ] Chart placeholder cards clearly state analytics are pending
- [ ] `npm run typecheck` passes with 0 errors
