# Service Coverage + Geolocation Design

Status: Sprint 020 canonical design. Documentation and planning only; no runtime geolocation, service filtering, endpoint, migration, provider call, Tekae activation, or payment behavior is implemented by this file.

Last updated: 2026-06-05

## Purpose

This document defines how FONDIXPAY should normalize, tag, filter, and display services based on a user's state/location. It extends the existing coverage-aware service catalog with a geolocation and manual-state selection model.

Business goal: users should see only services available for their selected or detected state, plus national services. Example: a user in Torreon should see services available for Coahuila/Torreon coverage rules; a user in Chihuahua should see Chihuahua services; national services should appear across Mexico.

## MVP Boundary

MVP filtering is state-based.

- GPS may help infer a state.
- Manual state selection is required as fallback.
- City/municipality granularity is future only.
- National services are first-class coverage records.
- Mobile must not hardcode coverage rules.
- Existing runtime behavior remains unchanged until a later implementation sprint.

## Non-Goals

Sprint 020 does not:

- Install Expo Location.
- Implement GPS permission prompts.
- Implement reverse geocoding.
- Implement runtime service filtering changes.
- Create backend endpoints.
- Create database migrations.
- Change mock services.
- Change payment logic.
- Activate Tekae.
- Call providers.
- Modify `.env` files, secrets, infrastructure, workflows, deployments, webhooks, or provider adapters.

## Current Implementation Context

Existing catalog foundation:

- Backend `service_catalog` module stores categories, catalog items, state coverage, provider capabilities, and source metadata.
- Current `service_coverage_by_state.state_code` uses short codes such as `CHH`, `COA`, and `NLE`.
- Public/mobile `/service-catalog` accepts optional `state_code` and returns only mobile-payable services by default.
- `/coverage-map` and `/coverage-map/states/{state_code}` expose reference-only coverage data.
- Seeded services are conservative and not production-payable: `provider_pending`, `payable_in_mobile=false`, provider capability `to_confirm`.
- Mobile Add Service consumes `/service-catalog`, but currently no GPS/manual state selector drives it.
- Mobile has internal demo fallback services for mock/dev validation only.

Sprint 020 defines the target geolocation/state-selection design without changing that runtime.

## Coverage Model

Future normalized `Service` fields:

| Field | Purpose |
|---|---|
| `serviceId` | Stable internal identifier. |
| `displayName` | User-facing service name. |
| `providerName` | Operating provider/biller or aggregator-facing provider name. |
| `category` | Internal service category such as electricity, water, gas, telecom, government. |
| `tekaeMenuId` | Optional Tekae menu mapping when approved. |
| `tekaeCategoriaId` | Optional Tekae categoria mapping when approved. |
| `tekaeCarrierId` | Optional Tekae carrier mapping when approved. |
| `coverageMode` | `NATIONAL`, `STATE`, `CITY_FUTURE`, or `DISABLED`. |
| `coverageStates` | Canonical state codes where service is available. |
| `coverageCities` | Future optional city/municipality coverage records. |
| `isNational` | Convenience flag derived from coverage mode or `MX-ALL`. |
| `isActive` | Operational activation flag. |
| `environment` | DEV, STAGING, PROD, or test scope. |
| `sourceCatalog` | Source of normalized data, such as Tekae, admin, static seed, or workbook. |
| `lastCatalogSyncAt` | Last confirmed sync/review timestamp. |

## Coverage Modes

| Mode | Meaning | MVP behavior |
|---|---|---|
| `NATIONAL` | Service is available across Mexico. | Show for every selected/detected Mexican state unless disabled. |
| `STATE` | Service is available only in listed states. | Show only when selected/detected state is in `coverageStates`. |
| `CITY_FUTURE` | Service requires municipality/city rules. | Do not require for MVP; can be represented as state-limited until city model is approved. |
| `DISABLED` | Service is not available for display/payment. | Hide from mobile. Admin may still inspect. |

## State Code Taxonomy

Sprint 020 target taxonomy uses ISO-like Mexico state codes. Future implementation should normalize existing short codes to these canonical codes at API boundaries and/or through a migration when approved.

| Code | State |
|---|---|
| `MX-AGU` | Aguascalientes |
| `MX-BCN` | Baja California |
| `MX-BCS` | Baja California Sur |
| `MX-CAM` | Campeche |
| `MX-CHP` | Chiapas |
| `MX-CHH` | Chihuahua |
| `MX-CMX` | Ciudad de Mexico |
| `MX-COA` | Coahuila |
| `MX-COL` | Colima |
| `MX-DUR` | Durango |
| `MX-GUA` | Guanajuato |
| `MX-GRO` | Guerrero |
| `MX-HID` | Hidalgo |
| `MX-JAL` | Jalisco |
| `MX-MEX` | Estado de Mexico |
| `MX-MIC` | Michoacan |
| `MX-MOR` | Morelos |
| `MX-NAY` | Nayarit |
| `MX-NLE` | Nuevo Leon |
| `MX-OAX` | Oaxaca |
| `MX-PUE` | Puebla |
| `MX-QUE` | Queretaro |
| `MX-ROO` | Quintana Roo |
| `MX-SLP` | San Luis Potosi |
| `MX-SIN` | Sinaloa |
| `MX-SON` | Sonora |
| `MX-TAB` | Tabasco |
| `MX-TAM` | Tamaulipas |
| `MX-TLA` | Tlaxcala |
| `MX-VER` | Veracruz |
| `MX-YUC` | Yucatan |
| `MX-ZAC` | Zacatecas |
| `MX-ALL` | National coverage |

Compatibility note: current backend code uses `AGS`, `CHH`, `COA`, `CMX`, and similar short codes. A future implementation must either expose canonical `MX-*` codes while mapping internally, or migrate stored state codes under an approved migration sprint.

## National Service Rule

A service is national if:

- `coverageMode=NATIONAL`, or
- `coverageStates` includes `MX-ALL`.

National services appear for every supported Mexican state unless disabled. National does not mean production-payable by itself. The service still requires provider capability, reference validation, amount lookup rules, payment execution support, receipt/proof handling, fee rules, audit, and operations approval before payment.

## State Service Rule

A service with `coverageMode=STATE` appears only when the selected/detected state is present in `coverageStates` and the service is active/payable for the current environment.

Unavailable local services should not be shown in the mobile payable catalog. Admin/support may inspect them with safe availability reasons.

## Unknown Location Rule

If no GPS-derived state and no manual state selection exists:

- Show a clear manual state selection prompt.
- Do not pretend coverage is known.
- Optionally show national services only if product approves that behavior for the implementation sprint.
- Do not expose disabled/unavailable local services as selectable.

Recommended copy:

```text
Selecciona tu estado para ver los servicios disponibles.
```

## Unsupported State Rule

If selected/detected state has no local services:

- Show national services.
- Show a friendly local-services empty state.
- Do not show unavailable local services.
- Do not route unsupported services to payment confirmation.

Recommended copy:

```text
Aun no tenemos servicios locales disponibles en este estado. Puedes usar los servicios nacionales habilitados.
```

## Future City Rule

City/municipality filtering is not required for MVP. It may be added later with:

- `coverageCities` records.
- Municipality/state code normalization.
- Reverse geocoding to municipality if approved.
- Manual city selector if precision is needed.
- Special handling for metro areas such as Torreon/Gomez Palacio.

Until approved, city-level expectations must be documented as future behavior and must not block state-level MVP.

## GPS Permission Flow

Trigger location permission only when useful: first app entry, first service browsing, or when the user chooses automatic location.

Permission explanation:

```text
Usamos tu ubicacion para mostrar servicios disponibles en tu estado.
```

If accepted:

1. Get GPS coordinates.
2. Resolve coordinates to canonical state code through a future approved reverse-geocoding service.
3. Persist only state code by default.
4. Use that state to request/filter service catalog.
5. Do not treat GPS as payment evidence or provider eligibility by itself.

Rules:

- Do not request precise/continuous tracking for payments.
- Do not store raw coordinates unless a future privacy/security policy explicitly approves it.
- Do not log raw coordinates.
- Do not send raw coordinates to Tekae.

## Manual Fallback Flow

If GPS permission is denied, unavailable, inaccurate, or errors:

1. Show manual state selector.
2. Let the user choose a state from the canonical taxonomy.
3. Store selected state locally and/or in backend profile only after approval.
4. Use manual selected state for browsing until the user changes it.
5. Let the user change selected state from profile/settings or service filter.

Manual selected state overrides GPS because users may pay services for another state and GPS can be denied or inaccurate.

If backend profile storage is implemented later, changes to selected state must be auditable.

## Mobile UX Proposal

Future mobile states:

| State | User experience |
|---|---|
| First browse, no state | Show manual selector and optional location-permission CTA. |
| GPS accepted | Resolve state, show selected-state label, load catalog. |
| GPS denied | Show manual selector. |
| GPS unavailable/error | Show manual selector and safe retry option. |
| Manual state selected | Show services for selected state plus national services. |
| No local services | Show national services and local empty state. |
| Catalog unavailable | Show safe error; in DEV/internal mode demo fallback may appear if labeled. |

The service list should show a compact selected-state control such as `Estado: Chihuahua` with a change action. It should not display raw coordinates.

## Backend Responsibilities

Future backend responsibilities:

- Own canonical service catalog and coverage rules.
- Normalize state codes and reject unknown codes.
- Include national services for any valid state query.
- Hide disabled/unavailable local services from mobile payable responses.
- Keep public coverage/reference data separate from mobile payable catalog.
- Keep provider mapping and Tekae menu/categoria/carrier values backend/admin controlled.
- Redact provider payloads and avoid raw location logging.
- Audit backend profile location-preference changes if implemented.
- Expose support/admin visibility into why a service is hidden or unavailable.

## Future Data Model Proposal

Future entities/fields to consider, building on current catalog tables:

- `service_catalog_items.coverage_mode` with values `NATIONAL`, `STATE`, `CITY_FUTURE`, `DISABLED`.
- `service_catalog_items.source_catalog` for `tekae`, `static_seed`, `admin`, `coverage_workbook`, or other sources.
- `service_catalog_items.last_catalog_sync_at`.
- `service_coverage_by_state.state_code` normalized to `MX-*` or mapped at API boundary.
- `service_coverage_by_city` future table for municipality/city coverage.
- `users.location_preference_state_code` or profile-level selected state if backend persistence is approved.
- `location_resolution_events` future redacted audit/diagnostic events without raw coordinates.
- `provider_service_capabilities.tekae_menu_id`.
- `provider_service_capabilities.tekae_categoria_id`.
- `provider_service_capabilities.tekae_carrier_id`.

No migration is implemented in Sprint 020.

## Future API Proposal

All APIs in this section are proposed/not implemented unless already listed as current Phase 10F endpoints. Sprint 020 does not create endpoints.

### GET `/api/catalog/services?state=MX-CHH`

Purpose: return services available for selected/detected state plus national services.

Rules:

- Include `NATIONAL` / `MX-ALL` services.
- Include state-matching services.
- Exclude disabled services.
- Exclude unavailable local services.
- Auth requirement: TBD.
- Audit requirement: TBD.
- Must not expose provider credentials, raw provider payloads, or raw location data.

Compatibility note: current implemented endpoint is `GET /service-catalog?state_code=CHH`. Future implementation should decide whether to evolve it, add an `/api/catalog/services` facade, or normalize state codes while preserving backward compatibility.

### GET `/api/catalog/states`

Purpose: return supported Mexican states, display names, canonical codes, and availability status.

### PATCH `/api/users/me/location-preference`

Purpose: persist the user's manual selected state if backend profile storage is approved.

Rules:

- Auth required.
- User-bound.
- Audit required if persisted server-side.
- Stores state code, not raw coordinates.

### POST `/api/location/resolve-state`

Purpose: resolve coordinates to state code if backend-based reverse geocoding is approved.

Rules:

- Auth requirement TBD.
- Rate limiting required.
- Do not log raw coordinates.
- Return state code only by default.
- Do not send raw coordinates to Tekae.

## Tekae Catalog Mapping Considerations

Tekae mapping stays future-only.

- FONDIXPAY category is not automatically Tekae `menu`.
- State coverage is not automatically Tekae `categoria` or `carrier`.
- Tekae `menu`, `categoria`, and `carrier` values must come from confirmed Tekae catalog/contracts or admin-approved mappings.
- Backend owns Tekae mapping and must not expose provider credentials or raw provider payloads to mobile.
- A service can appear in state coverage but still be blocked for Tekae launch if mapping or provider capability is missing.
- Tekae session creation must validate service coverage and mapping before launch when runtime is approved.

## Privacy And Security Rules

- Use location only to infer state for service availability.
- Do not track users continuously.
- Do not request precise tracking for payments.
- Store selected state by default, not raw coordinates.
- Do not log raw GPS coordinates.
- Do not send raw GPS coordinates to Tekae.
- Do not include raw coordinates in analytics, crash reports, support tickets, CRM views, audit metadata, or screenshots.
- Manual state selection must remain available.
- If backend state preference changes are stored, they must be authenticated, user-bound, and auditable.
- Public/landing coverage remains commercial/reference and must not authorize payments.

## Environment Behavior

### DEV

- Mock location allowed.
- Manual state selector allowed.
- Fake GPS/state fixtures allowed.
- Tekae disabled.
- Mock catalog/demo fallback allowed only when labeled.
- Raw coordinates should still not be logged in committed code or shared traces.

### STAGING

- Test geolocation and manual fallback.
- Use staging catalog/service fixtures or sandbox catalog mapping.
- Tekae sandbox only after readiness approval.
- Validate state coverage rules with test data.
- Validate national services across multiple state fixtures.
- Validate denied/unavailable GPS paths.

### PROD

- Real user location permission only with approved copy.
- Real service coverage data only after release gates.
- No raw coordinate logging.
- No provider credentials in mobile.
- Tekae production only after network/security/operational approval.
- Support/operations must have safe visibility into coverage availability reasons.

## Validation Plan

Future implementation validation should cover:

- All canonical state codes load in the selector.
- GPS accepted path resolves to state and loads services.
- GPS denied path shows manual selector.
- GPS unavailable/error path shows manual selector.
- Manual state overrides GPS.
- National services appear for every state.
- `STATE` services appear only for matching states.
- Unsupported states show national services plus friendly local empty state.
- Disabled services never appear in mobile payable catalog.
- Current demo fallback remains labeled in DEV/internal mode only.
- Raw coordinates are absent from logs, analytics, support data, and provider calls.
- STAGING fixtures cover at least `MX-COA`, `MX-CHH`, `MX-NLE`, `MX-CMX`, `MX-JAL`, and `MX-ALL`.
- Tekae mapping missing blocks provider launch when runtime is later approved.

## Risks

- Incorrect state detection may hide valid services or show unavailable services.
- GPS permission denial could reduce conversion if manual fallback is weak.
- Catalog coverage data may be incomplete or stale.
- Tekae catalog categories/carriers may not map cleanly to FONDIXPAY service taxonomy.
- National services could be accidentally hidden if `MX-ALL` / `NATIONAL` logic is wrong.
- Raw location data could create privacy risk if logged or over-collected.
- City-level expectations could exceed MVP state-level design.
- Environment catalog mismatch could cause STAGING results to differ from PROD.
- Current short-code implementation could drift from the Sprint 020 `MX-*` canonical taxonomy if not normalized deliberately.

## Open Questions

- What source of truth will define service coverage by state?
- Who owns Tekae catalog normalization?
- Does Tekae provide explicit state coverage per service, or must FONDIXPAY define it?
- Should unsupported states show national services only or block service browsing?
- Should users be allowed to manually override GPS state? Sprint 020 design answer: yes, but implementation approval remains future.
- Should selected state be stored locally only or in backend profile?
- What reverse geocoding provider will be used?
- What location permission copy is approved?
- Should city-level filtering be required later for metro areas like Torreon/Gomez Palacio?
- How often will catalog coverage be reviewed or synchronized?
- How will national services be tested in STAGING?
- Should future APIs expose `MX-*` codes only, or accept both `MX-*` and current short codes during migration?

## Future Implementation Acceptance Criteria

- State selector uses canonical Mexico state taxonomy.
- Manual state fallback exists and works without GPS.
- GPS permission prompt uses approved copy and is requested only when useful.
- GPS accepted path stores/uses state code only by default.
- Manual state overrides GPS until changed.
- National services appear for every state.
- State services appear only for matching states.
- Unknown/no state does not pretend coverage is known.
- Unsupported state behavior shows national services and a friendly local empty state if product approves national-only fallback.
- Raw coordinates are not logged, persisted, sent to Tekae, or exposed in support/CRM.
- DEV, STAGING, and PROD behavior follow this document and `docs/ENVIRONMENTS.md`.
- No provider launch happens without service coverage and Tekae mapping validation.
- Automated tests cover national, state, unknown, denied, unavailable, and environment fixture behavior.

## Sprint 021 Catalog Normalization Dependency

`docs/TEKAE_CATALOG_NORMALIZATION_DESIGN.md` is the canonical Sprint 021 design for turning Tekae catalog rows into normalized FONDIXPAY service records.

Future service coverage/geolocation implementation depends on that normalization layer for provider mapping, `coverageMode`, `coverageStates`, national-service handling, unknown coverage review, and state-code compatibility. Sprint 021 does not change runtime geolocation, service filtering, endpoint behavior, migrations, Tekae runtime, or payment/provider logic.
