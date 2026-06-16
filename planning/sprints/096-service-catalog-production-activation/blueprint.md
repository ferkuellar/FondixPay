# Sprint 096 — Blueprint

## Backend Files

### backend/alembic/versions/20260616_0015_production_catalog_seed.py (new)
- Downgrade: delete all production catalog entries
- Upgrade: insert production-approved service list (provided by product owner before this sprint starts)
- All demo/test services: set `is_active=false` (do not delete — payment history may reference them)

### backend/app/modules/admin/catalog_routes.py (new)
- `GET /admin/catalog` — list all services (admin auth, `admin.catalog.list` permission)
- `POST /admin/catalog` — create service (SUPER_ADMIN, `admin.catalog.manage`)
- `PATCH /admin/catalog/{id}/status` — activate/deactivate
- `GET /admin/catalog/validate` — integrity validation report

### backend/app/core/permissions.py
- Add `admin.catalog.list` and `admin.catalog.manage` to SUPER_ADMIN role

### backend/app/modules/admin/schemas.py
- `CatalogServiceCreate`, `CatalogServiceUpdate`, `CatalogValidationReport`

## CRM Admin Files

### admin/src/crm/CrmVisualApp.tsx
- Add `"catalog"` to `ModuleKey` union
- Add `CatalogView` component: table with toggle column + add-service form
- Add nav item "Catálogo" visible to SUPER_ADMIN

### admin/src/api/adminClient.ts
- Add `getCatalog()`, `createService()`, `toggleServiceStatus()`, `validateCatalog()`

## Coverage Test

After seeding, run against each of 32 states:
```bash
for state in MX-CMX MX-NLE MX-JAL MX-CHH ...; do
  curl -s "staging-url/api/services?state=$state" | jq '.data | length'
done
```
All must return > 0.

## Product Input Required Before This Sprint

Product owner must provide the production service list (name, category, coverage, Tekae params) before implementation begins. Without this, the migration cannot be written.
