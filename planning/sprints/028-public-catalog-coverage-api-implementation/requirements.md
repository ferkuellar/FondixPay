# Sprint 028 — Public Catalog Coverage API Implementation: Requirements

## Goal

Implement the `GET /service-catalog` endpoint designed in Sprint 027, including backend FastAPI route, service layer, schemas, mapper, and tests. Update the mobile API client to consume the real endpoint.

## Context

Sprint 027 produced the API design. Sprint 028 implements it end-to-end: backend Python modules and a mobile TypeScript API client update. This replaces the client-side mock data source used since Sprint 025.

## Scope

**Backend:**
- Create `backend/app/modules/service_catalog/public_catalog_mapper.py`.
- Update `backend/app/modules/service_catalog/routes.py` — add `GET /service-catalog` route.
- Update `backend/app/modules/service_catalog/schemas.py` — add public response schema.
- Update `backend/app/modules/service_catalog/services.py` — add filtering service logic.
- Create `backend/tests/test_public_catalog_coverage_api.py`.

**Mobile:**
- Update `mobile/src/services/serviceCatalogApi.ts` — call real endpoint with `state_code` param.
- Update `mobile/src/types/index.ts` — align with backend response schema.

**Docs:**
- Update `docs/API.md` and `docs/PUBLIC_CATALOG_COVERAGE_API_DESIGN.md`.

## Out of Scope

- No auth required on this public endpoint (by design from Sprint 027).
- No Tekae live API calls. Catalog data is static/mock on the backend.
- No payment, provider, or mobile UI changes.

## Acceptance Criteria

- `GET /service-catalog?state_code=CHH` returns filtered services.
- `GET /service-catalog?state_code=MX-CHH` returns identical result (normalization).
- `GET /service-catalog?state_code=INVALID` returns 200 with empty list.
- All backend tests pass.
- `npm run typecheck` passes with 0 errors.
