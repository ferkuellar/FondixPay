# Tekae Catalog Coverage Normalization Design

Status: Sprint 021 canonical design. Documentation and planning only; no parser, import job, normalized output file, endpoint, migration, mobile behavior, backend runtime behavior, Tekae runtime activation, provider call, payment logic, `.env`, infrastructure, workflow, deployment, or production data import is implemented by this file.

## Purpose

Define how Tekae catalog rows will eventually become normalized FONDIXPAY service catalog records that can be filtered by state, national coverage, and future geolocation rules.

FONDIXPAY remains a service/payment platform that embeds approved provider capabilities. FONDIXPAY is not a fintech, bank, wallet, card processor, acquirer, SPEI processor, tokenization service, or banking core.

## Current Status

Sprint 020 defined state-based MVP service coverage, the target `MX-*` Mexico state taxonomy, `MX-ALL` / `NATIONAL` nationwide service handling, future GPS state detection, manual state fallback, and privacy rules.

Current implementation context:

- Backend `/service-catalog` exists and accepts optional `state_code`.
- Current stored state coverage uses short 3-letter codes such as `CHH`, `COA`, and `NLE`.
- Sprint 020 target design uses canonical `MX-*` state codes and `MX-ALL` for national coverage.
- Mobile Add Service can consume `/service-catalog`, but no GPS/manual state selector drives runtime filtering yet.
- Tekae runtime remains disabled and no Tekae launch is authorized by this design.

## Source Catalog Inspection

A read-only workbook was available outside the repository at `C:\Users\ferna\OneDrive\Escritorio\FondixPayDocs\fondixpay_tekae_catalog_normalized.xlsx`. It must not be copied into the repository or committed unless a future policy explicitly approves that.

Inspected metadata only:

| Sheet | Rows | Columns | Notes |
|---|---:|---:|---|
| `Summary` | 22 | 2 | Workbook summary. |
| `Normalized_Catalog` | 257 | 23 | Candidate normalized catalog rows. |
| `Region_Codes` | 34 | 4 | Region/state code reference. |
| `Coverage_Rules` | 8 | 3 | Coverage decision notes. |
| `Review_Queue` | 35 | 27 | Rows needing review/enrichment. |

`Normalized_Catalog` headers found:

- `product_id`
- `source_sheet`
- `source_row`
- `tekae_product_number`
- `raw_category`
- `normalized_category`
- `provider_name`
- `provider_slug`
- `application_mode`
- `amounts_raw`
- `payment_type`
- `coverage_scope`
- `coverage_code`
- `allowed_state_codes`
- `is_national`
- `review_status`
- `requires_balance_inquiry`
- `allows_partial_payment`
- `stock_based`
- `pin_type`
- `redemption_place`
- `raw_notes`
- `normalization_notes`

`Review_Queue` includes the same catalog fields plus `action_owner`, `validation_result`, `approved_coverage_code`, and `review_comment`.

## Non-Goals

Sprint 021 does not:

- Implement catalog parser scripts.
- Create normalized catalog JSON/CSV output.
- Import production catalog data.
- Create backend models, migrations, endpoints, webhooks, or import services.
- Modify mobile service filtering, GPS, geolocation, or UI runtime behavior.
- Activate Tekae or call provider APIs.
- Modify payment logic, provider adapters, receipts, ledger, or reconciliation.
- Modify `.env`, secrets, Terraform, workflows, deployment, DNS, domains, or Vercel behavior.

## Source Catalog Assumptions

The workbook appears to be a pre-normalized planning artifact, not an approved production import source. Future implementation must confirm:

- Official Tekae source file and version.
- Stable Tekae identifier columns.
- Whether `tekae_product_number` is globally stable and unique.
- Whether state coverage is provided by Tekae or assigned by FONDIXPAY.
- Whether workbook coverage codes already use approved `MX-*` / `MX-ALL` values.
- Whether review queue rows are blocked from user-facing exposure until approved.

## Internal Service Model Proposal

Future normalized entity: `ServiceCatalogItem`.

| Field | Purpose |
|---|---|
| `serviceId` | Internal immutable identifier. |
| `canonicalSlug` | Stable FONDIXPAY slug for URLs/search/import idempotency. |
| `displayName` | Reviewed user-facing service name. |
| `shortName` | Compact user-facing label. |
| `providerName` | Human-readable provider/merchant name. |
| `providerCode` | Internal provider/merchant code if approved. |
| `category` | FONDIXPAY primary category. |
| `subcategory` | Optional internal subcategory. |
| `serviceType` | Internal type such as bill payment, top-up, entertainment, or voucher. |
| `sourceProvider` | Source provider, initially `TEKAE` for Tekae-backed rows. |
| `sourceProviderServiceId` | Stable provider service identifier, such as approved Tekae product id. |
| `tekaeMenuId` | Tekae `menu` mapping metadata. |
| `tekaeCategoriaId` | Tekae `categoria` mapping metadata. |
| `tekaeCarrierId` | Tekae `carrier` mapping metadata. |
| `coverageMode` | `NATIONAL`, `STATE`, `CITY_FUTURE`, `DISABLED`, or `UNKNOWN_REVIEW_REQUIRED`. |
| `coverageStates` | Array of canonical `MX-*` state codes, or `MX-ALL` only for approved national convention. |
| `coverageCities` | Reserved for future city/municipality filtering; empty/null for MVP. |
| `isNational` | Derived flag when `coverageMode=NATIONAL` or `coverageStates` includes `MX-ALL`. |
| `isActive` | User-facing availability gate. |
| `sortOrder` | Controlled ordering within category/search results. |
| `logoAssetKey` | Optional reviewed logo/icon mapping. |
| `searchKeywords` | Reviewed synonyms and search terms. |
| `environment` | Catalog environment such as DEV, STAGING, or PROD. |
| `sourceCatalogVersion` | Source catalog version or import batch identifier. |
| `lastCatalogSyncAt` | Last approved sync/import timestamp. |
| `createdAt` | Record creation timestamp. |
| `updatedAt` | Record update timestamp. |

Provider-specific values must be metadata. Mobile and business logic should consume FONDIXPAY fields such as `category`, `displayName`, `coverageMode`, and `coverageStates`, not raw Tekae structure.

## Tekae Mapping Rules

Tekae personalization/navigation fields remain provider metadata:

- `menu`
- `categoria`
- `carrier`
- `redirect`
- `blockview`

Known Tekae `menu` examples from readiness docs:

| Tekae menu | Meaning |
|---|---|
| null | Home |
| `1` | Tiempo Aire |
| `2` | Pago de Servicios |
| `3` | Entretenimiento |

Mapping rules:

- FONDIXPAY category is not automatically Tekae `menu`.
- Tekae `categoria` is not automatically FONDIXPAY subcategory.
- Tekae `carrier` is not automatically provider display name.
- Raw Tekae fields must be preserved for provider launch/session construction when approved.
- Raw Tekae fields must not become primary user-facing taxonomy without product review.
- Every imported Tekae row must either map to one internal category or be marked review-required.
- A service can be visible in a state only if coverage is approved and the service is active/payable for the environment.
- Future Tekae launch must validate service coverage and provider mapping before creating a provider session.

## Coverage Rules

### National Services

A service is national when:

- `coverageMode=NATIONAL`, or
- `coverageStates` contains `MX-ALL` after the convention is approved.

National services must appear for every Mexican state unless disabled or inactive. National services must be included in service results alongside state-specific matches.

### State Services

A state service uses `coverageMode=STATE` and must include at least one valid canonical `MX-*` state code in `coverageStates`.

A state service appears only when the selected/detected state matches one of its `coverageStates` values.

### Unknown Coverage

If a catalog item lacks reliable coverage data, set `coverageMode=UNKNOWN_REVIEW_REQUIRED`.

Unknown coverage must not be treated as national by default. Unknown coverage must not appear in user-facing service lists unless an explicit future approval changes that rule.

### Disabled Services

A service is hidden when:

- `coverageMode=DISABLED`, or
- `isActive=false`, or
- provider capability/payability is not approved for the environment.

### Future City Coverage

`CITY_FUTURE` is reserved for future city/municipality coverage. MVP implementation must not depend on city-level filtering.

### State Code Compatibility

Sprint 021 keeps the Sprint 020 target taxonomy: canonical `MX-*` state codes and `MX-ALL` for national coverage. Current backend state coverage uses short codes such as `CHH`. Future implementation must deliberately map, accept, or migrate this difference; Sprint 021 does not change runtime state codes.

## Internal Taxonomy Proposal

Initial FONDIXPAY categories should be independent of raw Tekae structure:

| Category | Use |
|---|---|
| Utilities | Electricity, water, gas, home services, and similar household bills. |
| Telecom | Airtime, internet, mobile, fixed-line, and carrier-related payments. |
| Entertainment | Streaming, games, vouchers, subscriptions, and entertainment products. |
| Government | Government fees or public-service payments if approved. |
| Education | School, tuition, and education-related services if approved. |
| Mobility | Toll, transport, parking, or mobility-related services if approved. |
| Financial services | Only if product/legal approval confirms the wording fits FONDIXPAY boundaries. |
| Other | Temporary bucket for reviewed items that do not fit a stable category. |

User-facing taxonomy must remain FONDIXPAY-owned. Provider identifiers and raw categories are operational metadata.

## Environment Behavior

| Environment | Catalog behavior |
|---|---|
| DEV | May use fixtures, workbook-derived test samples if approved, mock state selectors, and review queue examples. Tekae remains disabled. |
| STAGING | Validates mapping against sandbox/test catalog data only after readiness approval. Must test national, state-specific, unknown, disabled, and unsupported-state behavior. |
| PROD | Uses only approved normalized production catalog data after release gates. No raw workbook import, provider runtime, or production exposure without approval. |

## Data Privacy And Security

- Catalog files must not contain provider credentials, tokens, passwords, access URLs, or secrets.
- Raw Tekae identifiers may be stored as provider metadata, but must not leak into normal mobile UI labels.
- Raw provider payloads and unsupported notes must be reviewed before any user-facing copy is derived from them.
- Catalog import logs must redact file paths, raw rows, provider payloads, and any sensitive operational data.
- GPS/location privacy rules from Sprint 020 still apply: state code is enough by default, raw coordinates must not be logged, persisted, sent to Tekae, or exposed in support/CRM.
- Production import source and catalog versioning must be auditable before PROD exposure.
- Sprint 026 adds that the real Tekae catalog, manuals, NDA, provider identifiers, credentials, tokens, sensitive URLs, screenshots with real provider data, and raw catalog rows are confidential external references and must not be copied into the repository. Only derived non-sensitive normalization rules and sanitized examples may be documented.

## Future Parser And Import Plan

Future implementation artifacts are proposed/not implemented:

- `scripts/inspect_tekae_catalog.py` for safe sheet/header/schema inspection.
- `scripts/normalize_tekae_catalog.py` for deterministic normalization after approval.
- `samples/normalized/tekae_catalog_sample.normalized.json` for non-sensitive sample output only if approved.
- Backend catalog import service for validated imports.
- Backend normalized catalog model/migration.
- Backend service filtering endpoint or compatible `/service-catalog` evolution.
- Mobile state-aware service filtering integration.

Future parser/import behavior should:

- Validate workbook/schema before reading rows for import.
- Reject missing required identifiers.
- Generate deterministic `canonicalSlug` values.
- Preserve provider mapping metadata.
- Route unknown coverage/category rows to review queue.
- Produce import reports without secrets or raw sensitive provider payloads.
- Require explicit STAGING validation before PROD import approval.

## Future API Implications

All API details here are proposed/not implemented.

Potential future API surface:

| API | Purpose |
|---|---|
| `GET /api/catalog/services?state=MX-CHH` | Return active normalized services for state plus national services. |
| `GET /api/catalog/services/{serviceId}` | Return one approved normalized service record. |
| `POST /api/admin/catalog/imports/tekae` | Admin-only catalog import after schema validation. |
| `GET /api/admin/catalog/imports` | Admin-only import history and validation status. |
| `GET /api/admin/catalog/review-queue` | Admin-only review queue for unknown coverage/category/mapping rows. |
| `PATCH /api/admin/catalog/items/{serviceId}` | Admin-only correction for category, coverage, logo, or active state. |

Compatibility note: current implemented endpoint is `GET /service-catalog?state_code=CHH`. Future implementation must decide whether to normalize that endpoint, add an `/api/catalog/services` facade, or accept both existing short codes and canonical `MX-*` during migration.

## Validation Plan

### Catalog Structure Validation

- Required columns exist.
- Required identifiers are not empty.
- `canonicalSlug` is unique.
- Provider mapping key is unique unless an explicit many-to-one mapping is approved.
- `coverageMode` is a valid enum.
- `coverageStates` values are valid `MX-*` or `MX-ALL` codes.
- National services use consistent `NATIONAL` / `MX-ALL` representation.
- Review queue rows remain blocked until approved.

### Mapping Validation

- Every Tekae row maps to exactly one internal category or is marked review-required.
- Every Tekae `menu`/`categoria`/`carrier` reference is preserved in provider metadata when available.
- No credential, token, access URL, password, or secret appears in catalog data.
- No raw unsupported provider field becomes user-facing copy without review.

### Coverage Validation

- For each state, national services are included.
- For each state, state-specific services appear only when matching.
- Unknown coverage services are not exposed by default.
- Disabled/inactive services are excluded.
- Existing short-code and target `MX-*` compatibility is tested before runtime migration.

### QA Validation Samples

- `MX-CHH`
- `MX-COA`
- `MX-NLE`
- `MX-CMX`
- `MX-JAL`
- `MX-ALL` / `NATIONAL`
- Unsupported state behavior.
- National service visibility in every selected state.

## Open Questions

- Is the workbook the official Tekae catalog source or a FONDIXPAY-normalized planning artifact?
- What are the official Tekae catalog columns and stable identifiers?
- Is `tekae_product_number` globally stable and unique?
- Does Tekae provide explicit state coverage per service?
- Who owns manual coverage assignment when Tekae coverage is missing?
- Is `MX-ALL` the approved stored representation for national services, or should `NATIONAL` be canonical with `MX-ALL` as an API convenience?
- What internal categories should FONDIXPAY expose to users at launch?
- Should FONDIXPAY store logo/icon mapping per service?
- How often will the Tekae catalog be refreshed?
- What is the source of truth for catalog versioning?
- What validation threshold is required before exposing normalized services in STAGING?
- Should future APIs expose only `MX-*` codes or accept current short codes during migration?

## Future Implementation Acceptance Criteria

A future implementation sprint is ready only when:

- Official catalog source and ownership are approved.
- Stable provider identifier strategy is approved.
- Internal taxonomy is approved.
- `MX-*` / short-code compatibility strategy is approved.
- `MX-ALL` / `NATIONAL` storage convention is approved.
- Unknown coverage review queue ownership is approved.
- Parser/import validation rules are implemented and tested.
- STAGING fixtures validate national, state, unknown, disabled, and unsupported-state behavior.
- No raw Tekae identifiers leak into primary mobile UI taxonomy.
- No provider credential, token, access URL, or secret is present in catalog artifacts.
- Tekae runtime remains blocked unless a separate approved sprint enables it.

## Sprint 027 Public API Projection Follow-Up

`docs/PUBLIC_CATALOG_COVERAGE_API_DESIGN.md` extends this normalization design with the future public/mobile API projection.

Sprint 027 decisions:

- Public national coverage is `coverage.mode = "NATIONAL"` with `coverage.states = []`.
- `MX-ALL` remains internal/import compatibility only and must not be user-selectable.
- Public state coverage is `coverage.mode = "STATE"` with canonical `MX-*` codes.
- Public API responses must not expose Tekae `menu`, `categoria`, `carrier`, provider IDs, `sourceProviderServiceId`, raw provider payloads, source row IDs, credentials, token material, production URLs, commercial terms, or NDA/confidential material.
- Legacy short codes such as `CHH` may be accepted temporarily by future backend compatibility logic, but public responses must emit canonical `MX-*` only.
- Unknown, disabled, inactive, rejected, and not-user-facing services must not be exposed as available.
