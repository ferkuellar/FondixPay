# Sprint 096 — Builder Handoff Prompt

You are implementing Sprint 096: Service Catalog Production Activation for FONDIXPAY.

## Context

FONDIXPAY's service catalog (`services` table in PostgreSQL) contains demo/placeholder entries used during development. This sprint replaces them with real production services and adds CRM admin capability to manage the catalog without code deploys.

**Sprint 093 must be complete** (staging environment needed for validation).

**Before starting:** Product owner must provide the production service list. If not available, create a placeholder migration with clearly marked `TODO: REPLACE WITH PRODUCTION DATA` comments.

## What To Build

1. **Alembic data migration**: set all existing demo services to `is_active=false`, insert production-approved services with:
   - `name` (user-visible, Spanish)
   - `category` (Tiempo Aire, Pago de Servicios, Entretenimiento, or other defined categories)
   - `coverageMode` (NATIONAL or STATE)
   - `coverageStates` (list of `MX-*` codes if STATE)
   - `tekae_categoria` (Tekae menu parameter)
   - `tekae_carrier` (Tekae carrier parameter, nullable)
   - `is_active = true`

2. **Admin catalog endpoints** (SUPER_ADMIN only):
   - `GET /admin/catalog` — list all services
   - `POST /admin/catalog` — add service
   - `PATCH /admin/catalog/{id}/status` — toggle active/inactive
   - `GET /admin/catalog/validate` — integrity check report

3. **CRM CatalogView**: Add to `admin/src/crm/CrmVisualApp.tsx` under `#/catalog`:
   - Table with services, active toggle, category filter
   - Add service inline form

## Files to Read First

- `backend/app/modules/services/models.py` — current `Service` model schema
- `backend/app/modules/services/routes.py` — public service listing endpoint
- `backend/app/modules/admin/` — existing admin route patterns
- `admin/src/crm/CrmVisualApp.tsx` — existing CRM structure (how to add a new view)
- `admin/src/api/adminClient.ts` — existing admin API client (how to add new methods)
- `backend/alembic/versions/` — latest migration for `down_revision`

## Constraints

- `TEKAE_ENABLED` remains false in this sprint
- Do not delete historical service records (payment history references them)
- All 202+ backend tests must pass
- TypeScript: 0 errors after CRM changes

## Output

Report: migration name, service count loaded, validation endpoint result, CRM view added, and coverage smoke test results (at minimum: MX-CMX, MX-NLE, MX-JAL — each returns > 0 services).
