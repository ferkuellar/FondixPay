# Sprint 089 — CRM Producción Polish — Completion Report

Date: 2026-06-15
Status: COMPLETE

## Changes

### Export CSV — Users / Payments / Receipts / AuditLogs
`admin/src/crm/CrmVisualApp.tsx`
- Added `downloadCsv(filename, headers, rows)` utility: UTF-8 BOM blob, triggers browser download
- `UsersView`: Exportar CSV → `usuarios-<ts>.csv` (columns: Teléfono, Nombre, Rol, Estado, Pagos, Registrado) — exports current filtered view
- `PaymentsView`: Exportar CSV → `pagos-<ts>.csv` (columns: ID, Servicio, Referencia, Total, Estado, Creado) — exports current status filter
- `ReceiptsView`: Exportar → `recibos-<ts>.csv` (Folio, Pago ID, Monto, Estado, Creado) — all loaded receipts
- `AuditLogsView`: Exportar → `audit-logs-<ts>.csv` (Tiempo, Actor, Acción, Entidad, Resultado) — all loaded events
- All values are double-quote escaped; commas in amounts (from `formatMoney`) are safe

### Topbar search — ⌘K wired
- Added `searchRef` to topbar `<input>` in `CrmVisualApp`
- Global `keydown` listener: `⌘K` / `Ctrl+K` → `searchRef.current.focus()`
- `onKeyDown` on the input: `Enter` → `window.location.hash = "/search"` + blur

### Token expiry warning
- Added `jwtExpiry(token)`: decodes JWT payload via `atob` (no library needed), returns Unix exp timestamp
- Added `formatExpiry(secs)`: formats as "Sesión: Xh Ym" / "Sesión: X min" / "Sesión expirada"
- `useEffect` on `token` change: `setInterval` every 30s updates `tokenSecsLeft`
- Sidebar user block: `CRM Admin` replaced by live countdown (orange when <15 min)
- Banner at `<15 min` remaining: orange, "Sesión expira en X min — guarda tu trabajo." + Salir button
- Banner at `0 s` (expired): red, "Sesión expirada. Inicia sesión nuevamente." + Salir button

## Validation
- TypeScript: 0 errors
- No backend changes, no new endpoints, no migration
- `downloadCsv` is client-side only — no network request
