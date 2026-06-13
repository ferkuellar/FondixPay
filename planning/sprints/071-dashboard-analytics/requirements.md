# Sprint 071 — Dashboard Analytics

**Goal:** Replace the "Analíticas pendientes" placeholder with real chart components backed by 3 new backend analytics endpoints.

## Scope

### Backend
- `GET /admin/dashboard/trend?days=N` — payment count per day for last N days (default 30); pre-fills all days with zero so result always has N entries
- `GET /admin/dashboard/category-volume` — total payments and volume per service category
- `GET /admin/dashboard/hourly` — payments per hour for today (24 entries, 0-indexed)

### Frontend
- Wire `DashboardView` to fetch all 3 endpoints in parallel via `Promise.all`
- Replace placeholder card with: SVG line chart (trend), bar chart (category volume), hourly bar chart (tráfico por hora · hoy)
- Handle empty/no-data state gracefully ("Sin actividad en este período", "Sin pagos registrados")
- Current hour highlighted in hourly chart

## Acceptance criteria
- [ ] `npm run typecheck` — 0 errors
- [ ] 13 backend tests passing for the 3 new endpoints (auth, RBAC, data shape)
- [ ] No hardcoded data in any chart
- [ ] No fake alerts, sparklines, or placeholder text
- [ ] Empty state shown when DB has no data
