# Coverage-Aware Service Catalog

## Executive Summary

FondixPay needs a coverage-aware service catalog before real payments are enabled. The public coverage map and the approved coverage spreadsheet can communicate market coverage, but they cannot by themselves authorize a service to enter the mobile payment flow.

The mobile catalog must be stricter than the public landing layer. A service is payable only when coverage, provider mapping, reference validation, amount lookup, payment execution, receipt capability, fee model, operational support, and audit requirements are explicitly confirmed.

This phase is architecture and documentation only. It does not implement runtime catalog behavior, does not integrate Prontipagos, does not call provider APIs, does not move money, and does not change the payment flow.

## Design Goals

- Show only payable services when coverage and transactional capability are confirmed.
- Avoid impossible payments and false availability claims.
- Separate commercial coverage from transactional availability.
- Prepare a future Prontipagos service catalog mapping.
- Prepare mobile service discovery and payment eligibility rules.
- Prepare landing coverage map governance.
- Prepare CRM/Admin visibility and operational management.
- Keep the user experience simple and non-technical.
- Avoid claims that every mapped service is currently payable.

## Non-Goals

- No real Prontipagos integration.
- No provider catalog sync.
- No real payments.
- No runtime implementation.
- No mobile payment flow changes.
- No visual replacement of the existing coverage map.
- No automatic import of the Excel into production data.
- No marking services as available without provider capability confirmation.

## Existing Coverage Map Reference

The requested repository path `assets/coverage-map.html` is not present in the current workspace. The matching design-system asset was found outside the repo at:

`C:\Users\ferna\OneDrive\Escritorio\FondixPayDocs\FONDIX PAY Design System\assets\coverage-map.html`

The asset is treated as a visual and commercial reference for this design phase. It must not be treated as payment authority.

Detected characteristics:

- Uses D3.js and TopoJSON.
- Draws Mexico by state.
- Uses remote TopoJSON from `datamaps` CDN.
- Defines `NATIONAL = 38`.
- Defines local/regional services in `svcs`.
- Groups services by `TELECOMS`, `GAS`, `AGUA`, and `GOBIERNO`.
- Normalizes state names and state codes.
- Shows a tooltip by state.
- Allows click selection by state.
- Builds state detail panels.
- Uses a blue choropleth scale by local/regional service count.
- Builds a dynamic legend.

Important warning:

The map is a commercial/reference layer. It must not be considered the final source of payable services until coverage and transactional capability are validated against the provider/agregator operating contract.

## Excel Coverage Reference

The approved coverage workbook was found at:

`C:\Users\ferna\OneDrive\Escritorio\FondixPayDocs\FONDIXPAY_Cobertura_Por_Estado.xlsx`

Detected sheets:

- `Simulador por Estado`
- `Matriz Cobertura`
- `Modelo de Datos`

Detected matrix columns:

- `ID`
- `AREA`
- `TIPO`
- `SERVICIO`
- `UTILIDAD`
- 32 Mexico state codes from `AGS` through `ZAC`

Detected coverage summary:

- 82 matrix service rows.
- 32 states.
- Area groups: `ENERGIA`, `TELECOMS`, `STREAMING`, `TAE`, `GAS`, `AGUA`, `GOBIERNO`.
- Simulator references 89 unique services and 38 national services after combining national and local/regional views.

The Excel is approved as a coverage reference. It is not yet a production catalog source and must not be auto-loaded into payable mobile catalog data until Phase 10F defines ingestion, normalization, validation, and audit controls.

## Core Concepts

| Concept | Definition |
|---|---|
| Service Provider | Operating provider or biller brand, such as CFE, Telmex, IZZI, or a municipal water provider. |
| Service Category | Product grouping used for UX, routing, operations, and reporting. |
| Service Catalog Item | A normalized service shown or managed by FondixPay. |
| Coverage State | Availability status by state, service, and source. |
| Provider Capability | Confirmed provider ability to validate reference, query amount, execute payment, and return receipt. |
| National Service | Commercially present in all states; not automatically payable. |
| Local/Regional Service | Available only in selected states or municipalities. |
| Commercial Coverage | Public or commercial coverage signal used for landing and market messaging. |
| Transactional Availability | Confirmed ability to run payment flow safely. |
| Mobile Visibility | Whether a service can appear in the mobile app. |
| Landing Visibility | Whether a service can appear in public coverage. |
| Admin Visibility | Whether operations can view/manage the item. |
| Payable Service | A service allowed to enter mobile payment confirmation. |
| Reference Validation | Capability to validate user account/reference safely. |
| Amount Lookup | Capability to fetch or confirm amount due. |
| Payment Execution | Capability to execute payment through the service aggregator. |
| Receipt Capability | Capability to produce provider/internal receipt status. |

## Coverage Status

Supported statuses:

- `available`
- `unavailable`
- `coming_soon`
- `provider_pending`
- `temporarily_disabled`
- `maintenance`
- `deprecated`
- `unknown`

MVP rule:

Only `available` can be payable. `coming_soon` may appear on the landing page if approved and clearly disabled. `provider_pending`, `unknown`, `unavailable`, `maintenance`, and `deprecated` are not payable.

## Visibility Model

Proposed fields:

- `visible_on_landing`
- `visible_on_mobile`
- `visible_on_admin`
- `payable_in_mobile`
- `show_as_coming_soon`
- `show_in_coverage_map`

Rules:

- Landing can show reference coverage with disclaimer.
- Mobile must show only payable services by default in MVP.
- Admin can see all services and statuses.
- Coverage map may show commercial coverage, but not payment availability unless backed by catalog capability.
- A service must not reach `ConfirmPayment` unless `payable_in_mobile=true`.

## Provider Capability Matrix

Each service requires an explicit capability record:

| Field | Purpose |
|---|---|
| `provider_name` | Aggregator or direct provider name. |
| `provider_service_code` | Provider-side service identifier. |
| `service_name` | FondixPay normalized display name. |
| `category` | Internal category. |
| `state_code` | Coverage state code. |
| `state_name` | Coverage state name. |
| `is_national` | Whether coverage is national. |
| `is_local_regional` | Whether coverage is state/regional. |
| `supports_reference_validation` | Reference can be validated before payment. |
| `supports_amount_lookup` | Amount can be queried or confirmed. |
| `supports_payment_execution` | Provider can execute service payment. |
| `supports_receipt` | Provider can return receipt/proof status. |
| `supports_reversal_future` | Future reversal capability, if contractual. |
| `coverage_status` | Current coverage status. |
| `visible_on_landing` | Public display flag. |
| `visible_on_mobile` | Mobile display flag. |
| `payable_in_mobile` | Payment eligibility flag. |
| `visible_on_admin` | Admin visibility flag. |
| `fee_model` | Fee rule or fee model key. |
| `min_amount_minor` | Minimum amount in minor units. |
| `max_amount_minor` | Maximum amount in minor units. |
| `currency` | Currency, expected `MXN`. |
| `notes` | Operational notes. |

## Service Categories

Initial internal categories:

- `electricity`
- `telecom`
- `mobile_topup_or_bill`
- `gas`
- `water`
- `government`
- `internet`
- `streaming_or_subscription_future`
- `other`

Map alignment:

- `TELECOMS` maps to `telecom`, `internet`, or `mobile_topup_or_bill`.
- `GAS` maps to `gas`.
- `AGUA` maps to `water`.
- `GOBIERNO` maps to `government`.

## National Services Rule

The map uses `NATIONAL = 38` to represent national services.

National coverage means commercial presence across Mexico. It does not automatically mean the service is payable in FondixPay. A national service still requires provider capability, operational validation, fee rules, receipt rules, and audit requirements before `payable_in_mobile=true`.

CFE, Telmex, Telcel, and similar national services must not be marked `available` unless the provider/agregator capability is confirmed.

## Local/Regional Services Rule

Local/regional services from the map and Excel must map to state, category, and provider capability records. Municipal water and government services require stricter validation because reference formats, amount lookup, and receipt behavior can vary by municipality or state agency.

No local/regional service can enter the payment flow without confirmed reference validation, payment execution, and receipt behavior.

## Mobile UX Rules

- Mobile service lists show only `payable_in_mobile=true` for MVP.
- Unavailable services do not navigate to `ConfirmPayment`.
- Optional `coming_soon` services must have disabled CTAs.
- Copy must be plain and non-technical:
  - `Servicio no disponible por ahora`
  - `Estamos preparando este servicio`
  - `No podemos validar esta referencia todavia`
- Provider jargon and technical errors are not shown to users.

## Landing Page / Coverage Map Rules

The landing page can show coverage as a public/commercial reference. It must not imply every service on the map is currently payable.

Required disclaimer examples:

- `Cobertura referencial sujeta a disponibilidad del proveedor.`
- `Servicios disponibles para pago se habilitaran conforme a validacion operativa.`

No public CTA should say `Paga ahora` for services that are not production-enabled.

## CRM/Admin Rules

- CRM sees all services.
- CRM sees coverage status and provider capability status.
- CRM can filter by state, category, provider, and status.
- Future coverage changes require audit events.
- SUPPORT can explain availability but cannot enable services.
- ADMIN/FINANCE can review provider mappings according to RBAC.
- No secrets, provider credentials, raw payloads, PAN, CVV, or card tokens are exposed.

## Prontipagos Integration Preparation

The future implementation must separate:

- FondixPay local catalog.
- Prontipagos provider catalog.
- Provider service codes.
- Coverage by state.
- Capability by service.
- Sync state and mismatch handling.

Required future behaviors:

- Detect new provider services.
- Detect retired services.
- Detect provider code mismatch.
- Temporarily disable services safely.
- Cache provider catalog data with expiry and audit.
- Create manual review when a critical mismatch affects payment eligibility.

## Data Model Proposal

Proposed entities:

- `service_categories`
- `service_catalog_items`
- `service_coverage_by_state`
- `provider_service_capabilities`
- `service_catalog_syncs`
- `service_availability_events`
- `coverage_map_sources`

Details are documented in `docs/DATA_MODEL.md`.

## API Proposal

Future APIs:

- `GET /service-catalog`
- `GET /service-catalog/{id}`
- `GET /service-categories`
- `GET /coverage-map`
- `GET /coverage-map/states/{state_code}`
- `GET /admin/service-catalog`
- `PATCH /admin/service-catalog/{id}`
- `POST /admin/service-catalog/sync`
- `GET /admin/service-catalog/syncs`

These endpoints are proposed for Phase 10F or later and are not implemented in this phase.

## Audit Events

Future events:

- `service_catalog.viewed`
- `service_catalog.item_enabled`
- `service_catalog.item_disabled`
- `service_catalog.coverage_changed`
- `service_catalog.visibility_changed`
- `service_catalog.provider_mapping_changed`
- `service_catalog.sync_started`
- `service_catalog.sync_completed`
- `service_catalog.sync_failed`
- `coverage_map.viewed`
- `coverage_map.state_selected`

## Operational Rules

- Only authorized admin roles can change coverage.
- New services require provider capability confirmation before payment eligibility.
- Disabling a service must be immediate and audited.
- Provider catalog mismatches must create an operational review item.
- Repeated payment failures can force `temporarily_disabled`.
- Support must receive safe availability language.
- Landing map updates and mobile catalog eligibility must be governed separately.
- Coverage rollback must preserve audit history.

## Validation Strategy

- Mobile shows only payable services.
- Landing map can show reference coverage with disclaimer.
- Unavailable services cannot be paid.
- Admin sees every status.
- Support can explain unavailable services without provider jargon.
- Provider mapping is required before payment.
- Coverage changes are audited.
- No unconfirmed service is marked payable.
- Excel/map discrepancies are reported before implementation.

## Production Gates

Before real service payments:

- Confirmed service catalog.
- Confirmed Prontipagos mapping.
- Confirmed provider capability.
- Defined available services.
- Unavailable services hidden from mobile payment flow.
- Reference validation rules.
- Amount lookup rules.
- Fee rules.
- Receipt rules.
- Admin visibility and RBAC.
- Audit logs.
- Automated tests.

