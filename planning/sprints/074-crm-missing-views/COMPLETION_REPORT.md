# Sprint 074 — Completion Report

**Date:** 2026-06-13
**Status:** DONE

## What changed

### Frontend — CrmVisualApp.tsx
- **`ModuleKey`** expanded with `"manual-review" | "fraud" | "disputes" | "notifications"`
- **`routes`** updated with 4 new hash paths: `/manual-review`, `/fraud`, `/disputes`, `/notifications`
- **`navGroups`** updated:
  - "Operación" group: added `Revisión manual` (eye icon) and `Notificaciones` (bell icon) between Tickets and Bot de Landing
  - New **"Riesgo"** group added between Operación and Finanzas: `Señales fraude` (fraud icon) + `Disputas` (disputes icon)
- **`renderView()`** wired all 4 new cases
- **Imports**: Added `AdminNotificationDelivery`, `DisputeCase`, `FraudSignal`, `ManualReviewCase` from `../types/admin`

### New view functions

#### `ManualReviewView`
- Fetches `GET /admin/manual-review` → `ManualReviewCase[]`
- Mini-stat bar: Total / Abiertos / Urgentes / Resueltos
- Status segmented filter: Todos / Abierto / Asignado / Investigando / Escalado / Resuelto
- Severity segmented filter: Todos / Urgent / High / Medium / Low
- Table: ID, tipo (case_type), severidad (badge), estado, pago, resumen, creado

#### `FraudView`
- Fetches `GET /admin/fraud/signals` → `FraudSignal[]`
- Mini-stat bar: Total / Abiertas / Escaladas / Descartadas
- Status + severity filters
- Table: ID, tipo señal, severidad, estado, entidad (entity_type/entity_id), razón, creado

#### `DisputesView`
- Fetches `GET /admin/disputes` → `DisputeCase[]`
- Mini-stat bar: Total / Abiertas / En revisión / Ganadas
- Status filter + type filter (Todos/Dispute/Chargeback)
- Table: ID, tipo (dispute/contracargo badge), estado, pago, monto, resumen, abierta
- "Contracargo" renders with danger badge to distinguish from regular disputes

#### `NotificationsView`
- Fetches `GET /admin/notifications/deliveries` → `AdminNotificationDelivery[]`
- Mini-stat bar: Total / Entregadas / Fallidas / Pendientes
- Dynamic channel filter (derived from loaded data) + status filter
- Table: ID, canal (ChannelChip), tipo, plantilla, destinatario (masked), estado, enviado

### Shared helper added
- `severityBadge(severity)`: renders `urgent` as danger, `high` as pending, others as default crm-badge

## Validation

- `npm run typecheck` — 0 errores

## Acceptance criteria

- [x] `ManualReviewView` loads cases from `/admin/manual-review`
- [x] `FraudView` loads signals from `/admin/fraud/signals`
- [x] `DisputesView` loads disputes from `/admin/disputes`
- [x] `NotificationsView` loads deliveries from `/admin/notifications/deliveries`
- [x] All 4 modules visible in nav and navigable via hash routes
- [x] `npm run typecheck` passes with 0 errors

## No backend changes
All APIs were already implemented and tested in Phase 11 sprints. No permissions, migrations,
routes, or schemas were modified.
