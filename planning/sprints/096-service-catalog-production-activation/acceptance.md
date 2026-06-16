# Sprint 096 — Acceptance Criteria

## Production Catalog

- [ ] No demo/placeholder service entries are `is_active=true` in production
- [ ] All production services have: name, category, coverageMode, tekae_categoria, tekae_carrier
- [ ] All STATE services have at least one valid `MX-*` code in `coverageStates`
- [ ] Catalog data is loaded via migration or seeding script (not hardcoded in app code)

## Catalog Validation

- [ ] `GET /admin/catalog/validate` endpoint exists (SUPER_ADMIN only)
- [ ] Returns JSON report: pass/fail per service, list of validation errors
- [ ] Rejects services with missing required fields or invalid MX-* codes

## CRM Catalog Management

- [ ] New `CatalogView` accessible at `#/catalog` in CRM admin
- [ ] Lists all services (active + inactive) with toggle
- [ ] Add service form: name, category, coverage, Tekae params — saves to backend
- [ ] Disable/enable toggle works without deleting historical references
- [ ] TypeScript: 0 errors after CRM changes

## Coverage Smoke Test

- [ ] `GET /api/services?state=MX-CMX` returns at least 1 service
- [ ] `GET /api/services?state=MX-NLE` returns at least 1 service
- [ ] NATIONAL services appear in all 32 state queries
- [ ] Manual check: no test/demo service names visible to unauthenticated API caller

## General

- [ ] All 202+ backend tests pass
- [ ] `TEKAE_ENABLED` remains false until Sprint 102
