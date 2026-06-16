# Sprint 096 — Service Catalog Production Activation

## Why This Sprint Exists

Blocks B-06 (SEV-2). The FONDIXPAY service catalog contains demo/test entries. Production users must see a real, curated list of supported services with valid coverage, categories, and Tekae mapping metadata. This sprint replaces demo catalog data with production-intent entries and adds CRM admin capability to manage the catalog without code deployments.

## Blockers Closed

- B-06: Service catalog is demo/test data only (SEV-2)

## Scope

1. **Production catalog import:**
   - Define the initial production service list (services available via Tekae at launch)
   - Import via Alembic data migration or admin seeding script — not hardcoded in source
   - Each service must have: `name`, `category`, `coverageMode` (NATIONAL/STATE), `coverageStates` (MX-* codes), `tekae_categoria`, `tekae_carrier`, `is_active`
   - Remove all placeholder/demo service entries

2. **Catalog integrity validation:**
   - Add `GET /admin/catalog/validate` endpoint (SUPER_ADMIN only): checks every active service has required fields, valid MX-* state codes, known category, and valid Tekae metadata
   - Returns a JSON report with pass/fail per service

3. **CRM catalog management view:**
   - In `admin/src/crm/CrmVisualApp.tsx`: new `CatalogView` under `#/catalog`
   - Lists all services with active toggle, category filter
   - Add new service form: name, category, coverage, Tekae params
   - Disable/enable service (does not delete — preserves payment history reference)
   - Exported CSV available

4. **Coverage smoke test:**
   - For each of the 32 Mexican states, at least one service must be returned by `GET /api/services?state=MX-{code}`
   - For NATIONAL services: verify they appear for all 32 states

## Out of Scope

- Tekae `menu` / `blockview` parameter construction (backend already handles this per ADR-182)
- Any new payment flows
- Pricing or fee management

## Note on Demo Data

Demo services that were used for development/QA testing may remain in a separate non-active catalog category for internal QA use, but must not be `is_active=true` in production.
