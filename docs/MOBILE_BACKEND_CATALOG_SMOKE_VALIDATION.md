# Mobile Backend Catalog Smoke Validation

Status: Sprint 030 documentation-only smoke validation. No runtime behavior is changed by this document.

## Purpose

Sprint 030 validates that the mobile Add Service discovery path can consume backend-backed `GET /service-catalog` data instead of depending exclusively on the local/demo catalog fallback.

Validated chain:

```txt
backend /service-catalog
-> mobile serviceCatalogApi
-> serviceCatalogStore
-> serviceCoverageFilter
-> AddServiceScreen
```

This validation does not activate Tekae, real provider payments, payment execution, GPS behavior, new endpoints, database changes, migrations, dependency changes, or UI redesign.

## Source Files Inspected

- `backend/app/modules/service_catalog/routes.py`
- `backend/app/modules/service_catalog/services.py`
- `backend/app/modules/service_catalog/public_catalog_mapper.py`
- `backend/tests/test_public_catalog_coverage_api.py`
- `mobile/src/types/index.ts`
- `mobile/src/services/serviceCatalogApi.ts`
- `mobile/src/store/serviceCatalogStore.ts`
- `mobile/src/utils/serviceCoverageFilter.ts`
- `mobile/src/screens/services/AddServiceScreen.tsx`
- `docs/API.md`
- `docs/PUBLIC_CATALOG_COVERAGE_API_DESIGN.md`
- `docs/ENVIRONMENT.md`
- `docs/ENVIRONMENTS.md`
- `planning/STATE.md`
- `planning/DECISIONS.md`
- `planning/RISKS.md`
- `planning/QUESTIONS.md`

## Backend Contract

`GET /service-catalog` is the existing public/mobile catalog endpoint.

The endpoint returns mobile-safe service catalog items and includes the public `coverage` object:

```json
{
  "coverage": {
    "mode": "NATIONAL",
    "states": [],
    "label": "Disponible a nivel nacional"
  }
}
```

Public coverage behavior:

- National services return `coverage.mode = "NATIONAL"` and `coverage.states = []`.
- State-specific services return `coverage.mode = "STATE"` and canonical `MX-*` values in `coverage.states`.
- Legacy short state input such as `CHH` may be accepted, but public output is canonical `MX-*`.
- `MX-ALL` is not emitted in public `coverage.states`.
- Unknown, disabled, inactive, rejected, unavailable, not-user-facing, or unconfirmed-capability services are not exposed as available mobile results.
- Tekae `menu`, `categoria`, `carrier`, provider IDs, provider service codes, raw payloads, UID/password/token material, production URLs, commercial terms, workbook rows, NDA/manual contents, and confidential provider metadata are not part of the public response.

## Mobile Consumption Path

`mobile/src/services/serviceCatalogApi.ts` calls:

```txt
GET /service-catalog
GET /service-catalog?state_code={stateCode}
GET /service-catalog?state_code={stateCode}&category={category}
```

The mapper preserves `item.coverage` and also maps optional compatibility fields:

- `coverage` is preserved as the backend-backed public coverage source.
- `coverageMode` uses `item.coverage?.mode` before legacy `coverage_mode`.
- `coverageStates` uses `item.coverage?.states` before legacy `coverage_states`.

`mobile/src/store/serviceCatalogStore.ts` can hold backend-backed catalog items returned by the API. If the backend returns services, the store uses those services and sets `isUsingDemoFallback = false`.

The local/demo fallback remains available only when the backend returns no services in internal demo mode or the backend request fails in internal demo mode.

`mobile/src/utils/serviceCoverageFilter.ts` hides non-user-facing services first. For remaining items, it prioritizes backend-backed `service.coverage` when present and valid, then falls back to `coverageMode` / `coverageStates` for local/demo metadata.

`mobile/src/screens/services/AddServiceScreen.tsx` renders the filtered services from the store and keeps safe demo/future-coverage copy.

## Smoke Cases

### Case 1 - Backend National Service

Backend input shape:

```json
{
  "coverage": {
    "mode": "NATIONAL",
    "states": []
  }
}
```

Expected mobile behavior:

- Visible for selected `MX-CHH`.
- Visible for selected `MX-COA`.
- Visible for any valid selected Mexican state.
- Does not require `MX-ALL` in public response.

### Case 2 - Backend State Service

Backend input shape:

```json
{
  "coverage": {
    "mode": "STATE",
    "states": ["MX-CHH"]
  }
}
```

Expected mobile behavior:

- Visible for selected `MX-CHH`.
- Hidden for selected `MX-COA`.
- Hidden for any selected state not included in `coverage.states`.

### Case 3 - Backend Incomplete Coverage

Backend input shape:

```json
{
  "coverage": null
}
```

or:

```json
{
  "coverage": {
    "mode": "STATE",
    "states": []
  }
}
```

Expected mobile behavior:

- Use compatibility fallback fields when valid local/demo metadata is available.
- Do not treat unknown or ambiguous coverage as national by default.
- Do not expose ambiguous unavailable services as available.

### Case 4 - Hidden Services

Backend service state:

- inactive
- rejected
- unavailable
- unknown
- disabled
- not-user-facing
- not payable in mobile
- unconfirmed provider capability

Expected mobile behavior:

- Hidden before coverage is evaluated.
- Not rendered as selectable in Add Service.
- Not used to imply production availability.

### Case 5 - Backend Unavailable / Demo Fallback

Backend condition:

- Request fails.
- Backend unavailable in DEV.
- Backend returns an empty service list while internal demo mode is enabled.

Expected mobile behavior:

- App does not crash.
- Local/demo fallback remains available in internal demo mode.
- UI continues to communicate demo/future-coverage status.
- Backend-backed coverage validation remains pending until a reachable DEV/STAGING backend is configured.

## Manual DEV Smoke Checklist

Prerequisites:

- Backend is running locally or DEV API is reachable.
- Mobile environment points to the backend through `EXPO_PUBLIC_API_URL`.
- Tekae remains disabled.
- No real money/provider credentials are used.

Suggested local commands:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

```powershell
cd mobile
$env:EXPO_PUBLIC_API_URL="http://127.0.0.1:8000"
npm start
```

Manual steps:

1. Confirm `GET http://127.0.0.1:8000/service-catalog` responds.
2. Confirm at least one response item includes public `coverage`.
3. Confirm mobile has a selected state such as `MX-CHH`.
4. Open Add Service.
5. Confirm services render from backend data when backend returns payable services.
6. Stop or misconfigure backend in DEV/internal demo mode.
7. Confirm local/demo fallback remains available and the app does not crash.

Current note: the conservative seeded backend catalog may return no mobile-payable services until DEV/STAGING has approved payable test catalog data. In that case, backend-backed rendering cannot be fully proven manually without approved synthetic/dev payable data, but the API, mapper, store, filter, and fallback path remain documented and covered by backend tests plus mobile typecheck.

## Manual STAGING Smoke Checklist

Prerequisites:

- Dedicated STAGING backend exists.
- Dedicated STAGING database exists.
- Mobile staging build/profile points only to the staging API through `EXPO_PUBLIC_API_URL`.
- STAGING catalog contains approved test/sandbox payable services with public `coverage`.
- No production users, real money, production Tekae credentials, or production catalog data are used.

Manual steps:

1. Set mobile staging `EXPO_PUBLIC_API_URL` to the staging API base URL.
2. Confirm `GET {STAGING_API_URL}/service-catalog?state_code=MX-CHH` returns mobile-safe services.
3. Confirm national services return `coverage.mode = "NATIONAL"` and `coverage.states = []`.
4. Confirm state services return `coverage.mode = "STATE"` and canonical `MX-*` states.
5. Confirm no `MX-ALL`, short codes, provider internals, tokens, production URLs, or commercial terms appear in public responses.
6. Open Add Service in the staging mobile build.
7. Select or persist `MX-CHH`; confirm matching national and state services render.
8. Select or persist `MX-COA`; confirm `MX-CHH`-only services are hidden.
9. Confirm inactive/rejected/unavailable/not-user-facing services do not render.
10. Confirm fallback behavior remains available for DEV/internal demo only and is not mistaken for production coverage.

## Threshold To Remove Local/Demo Fallback

The local/demo catalog fallback may only be removed in a future approved sprint when all of the following are true:

- DEV backend `/service-catalog` is stable.
- STAGING backend `/service-catalog` is stable.
- Mobile successfully fetches backend catalog using environment config.
- Public `coverage` contract is present for all user-facing services.
- National services are manually validated in mobile.
- State-specific services are manually validated in mobile.
- Hidden services are manually validated as hidden in mobile.
- Backend tests pass.
- Mobile TypeScript passes.
- STAGING uses approved test/sandbox catalog data only.
- Product owner approves removing the demo fallback.
- Rollback path exists to restore demo/internal fallback if backend catalog availability regresses.

Until this threshold is met, the local/demo fallback remains intentionally available for development and internal validation.

## Sprint 030 Decision Boundary

- No Tekae runtime was activated.
- No Tekae SSO was implemented.
- No token generation was added.
- No provider calls were added.
- No real Tekae catalog, NDA, manual, credential, token, URL, commercial term, or raw provider data was copied.
- No payment behavior was changed.
- No GPS/location behavior was changed.
- No endpoint was created.
- No database schema or migration was changed.
- No dependency was added.
- No mobile UI redesign was performed.
- No local/demo fallback was removed.

## Validation Commands

Required validation after Sprint 030 documentation updates:

```powershell
git status --short
git diff --name-only
git diff --check
npm --prefix mobile run typecheck
```

From `backend`:

```powershell
python -m pytest
```
