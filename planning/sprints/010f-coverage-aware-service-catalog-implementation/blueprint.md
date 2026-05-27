# Phase 10F Blueprint - Coverage-Aware Service Catalog Implementation

## Backend

- New module: `backend/app/modules/service_catalog/`.
- Models:
  - `ServiceCategory`
  - `ServiceCatalogItem`
  - `ServiceCoverageByState`
  - `ProviderServiceCapability`
  - `CoverageMapSource`
- Public routes:
  - `GET /service-catalog`
  - `GET /service-catalog/{service_id}`
  - `GET /service-catalog/{service_id}/payable`
  - `GET /service-categories`
  - `GET /coverage-map`
  - `GET /coverage-map/states/{state_code}`
- Admin routes:
  - `GET /admin/service-catalog`
  - `GET /admin/service-catalog/{service_id}`
  - `PATCH /admin/service-catalog/{service_id}`
  - `POST /admin/service-catalog/seed`

## Seed Strategy

Seed data is reference-only:

- `coverage_status=provider_pending`
- `payable_in_mobile=false`
- `visible_on_mobile=false`
- `visible_on_admin=true`
- `show_in_coverage_map=true`
- provider capability `status=to_confirm`
- no payment execution support
- no receipt support

## Mobile

`AddServiceScreen` uses service catalog store/API and renders only services returned by `/service-catalog`. Because no seed service is payable, the screen shows an empty state until provider capability is confirmed.

Existing saved demo services remain local mock data for internal validation.

## Validation

- Backend compile.
- Backend pytest.
- Mobile typecheck.

