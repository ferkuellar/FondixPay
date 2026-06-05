# Public Catalog Coverage API Design

Status: Sprint 027 canonical design. Documentation and planning only; no endpoint, runtime behavior, database schema, migration, mobile code, backend code, payment logic, Tekae runtime, provider call, `.env`, infrastructure, workflow, deployment, or production data import is implemented by this file.

## Objective

Define the future public/mobile service catalog coverage API contract that lets the FONDIXPAY mobile app consume backend-owned coverage rules using canonical `MX-*` state codes.

This design closes the current planning gap where mobile can filter demo services locally with optional `coverageMode` and `coverageStates`, while the implemented backend public catalog still uses short `state_code` compatibility and does not expose a canonical coverage payload.

## Scope

- Public/mobile catalog response shape.
- Public coverage fields mobile may consume.
- Internal-only provider and Tekae metadata.
- Coverage behavior for `NATIONAL` and `STATE`.
- Unknown, disabled, inactive, rejected, and not-user-facing handling.
- Short-code compatibility and migration from legacy codes such as `CHH` to canonical `MX-CHH`.
- Sanitized example JSON.
- STAGING validation plan.
- Future implementation acceptance criteria.

## Out Of Scope

Sprint 027 does not:

- Implement or modify endpoints.
- Modify backend runtime code.
- Modify mobile runtime code.
- Add parser/import jobs.
- Add database columns or migrations.
- Activate Tekae runtime, SSO, token generation, provider calls, webhooks, payment sessions, payment logic, reconciliation, or receipt behavior.
- Modify `.env`, secrets, dependencies, infrastructure, workflows, deployment, domains, DNS, Vercel, or production data.
- Copy Tekae NDA, manuals, real catalog workbooks, raw catalog rows, credentials, URLs, tokens, commercial terms, or provider-internal identifiers into the repository.

## Current State

Implemented backend context:

- `GET /service-catalog` exists and accepts optional `state_code`.
- Current backend state coverage stores short codes such as `CHH`, `COA`, `NLE`, and `CMX`.
- Public `ServiceCatalogItemRead` exposes `is_national`, `coverage_status`, `visible_on_mobile`, and `payable_in_mobile`.
- Admin catalog responses include per-state coverage rows with short `state_code` values.
- The Sprint 022 normalizer already outputs canonical `MX-*` and `MX-ALL` internally for synthetic normalized rows.

Implemented mobile context:

- Mobile selected-state preference uses canonical `MX-*` codes.
- Mobile catalog mapping tolerates optional future fields such as `coverage_mode` and `coverage_states`.
- Mobile currently uses safe demo catalog metadata when the backend public catalog returns no payable services.

Design gap:

- Backend-owned public coverage fields are not yet canonical or implemented.
- Mobile should eventually stop relying on local/demo coverage metadata and consume a sanitized backend response.

## Target Public API Contract

Preferred future endpoint:

```text
GET /api/catalog/services?state=MX-CHH
```

Compatibility option:

```text
GET /service-catalog?state_code=MX-CHH
```

Sprint 027 does not choose implementation mechanics. A future runtime sprint may either add the `/api/catalog/services` facade or evolve the existing `/service-catalog` endpoint. In both cases, the public response must emit canonical `MX-*` state codes only.

Conceptual public item type:

```ts
type PublicServiceCatalogItem = {
  id: string;
  displayName: string;
  serviceType: string;
  serviceCategory: string;
  providerDisplayName: string;
  icon?: string;
  description?: string;
  isPayableInMobile: boolean;
  isReferenceOnly: boolean;
  coverage: {
    mode: 'NATIONAL' | 'STATE';
    states: string[];
    label?: string;
  };
  status: 'ACTIVE' | 'UNAVAILABLE';
};
```

Rules:

- Public `coverage.mode` is only `NATIONAL` or `STATE`.
- Public `coverage.states` contains only canonical `MX-*` codes.
- Public `coverage.states` is empty for national services.
- Public `status` is user-safe and must not expose raw internal review states.
- Public response must not expose Tekae provider metadata or confidential identifiers.

## Public Fields

| Field | Public meaning |
|---|---|
| `id` | FONDIXPAY public/internal service identifier safe for mobile selection. |
| `displayName` | Reviewed user-facing service name. |
| `serviceType` | FONDIXPAY-owned service type, such as bill payment or top-up. |
| `serviceCategory` | FONDIXPAY-owned category, independent from raw Tekae structure. |
| `providerDisplayName` | Reviewed display name for the provider/biller. |
| `icon` | Optional reviewed icon key or asset key. |
| `description` | Optional reviewed user-facing description. |
| `isPayableInMobile` | Whether the service can be selected for mobile payment in this environment. |
| `isReferenceOnly` | Whether the service is reference/display only. |
| `coverage.mode` | `NATIONAL` or `STATE`. |
| `coverage.states` | Empty for national; canonical `MX-*` list for state-specific services. |
| `coverage.label` | Optional safe display label such as `Disponible en Chihuahua`. |
| `status` | `ACTIVE` or `UNAVAILABLE` only. |

## Internal-Only Fields

The following must not leave backend/admin-controlled contexts through the public/mobile API:

- Tekae `menu`.
- Tekae `categoria`.
- Tekae `carrier`.
- Tekae provider IDs.
- `sourceProviderServiceId`.
- Raw provider payloads.
- Provider source catalog row IDs.
- Import row numbers and workbook source rows.
- `uid`, `password`, access tokens, refresh tokens, cipher/token material.
- Full launch URLs, production URLs, sensitive sandbox URLs, or private URLs.
- Commercial terms.
- NDA/confidential provider material.
- Raw provider errors.
- Internal review notes.
- Admin-only capability diagnostics unless converted into safe user copy.

## Coverage Model

### National

Public representation:

```json
{
  "coverage": {
    "mode": "NATIONAL",
    "states": [],
    "label": "Disponible a nivel nacional"
  }
}
```

Rules:

- `coverage.mode = "NATIONAL"`.
- `coverage.states = []`.
- National services appear for every valid selected Mexican state unless unavailable or disabled.
- Public API must not expose `MX-ALL` as a user-selectable state.
- `MX-ALL` remains internal/import compatibility only.

### State

Public representation:

```json
{
  "coverage": {
    "mode": "STATE",
    "states": ["MX-CHH", "MX-COA"],
    "label": "Disponible en estados seleccionados"
  }
}
```

Rules:

- `coverage.mode = "STATE"`.
- `coverage.states` must contain at least one valid canonical `MX-*` code.
- A state-specific service appears only when the selected state matches a value in `coverage.states`.
- Public responses must never emit legacy short codes such as `CHH`.

## MX-ALL / NATIONAL Decision

Decision:

- Public national services use `coverage.mode = "NATIONAL"`.
- Public national services use `coverage.states = []`.
- `MX-ALL` is not user-selectable and must not be required by mobile UI.
- `MX-ALL` is allowed only as an internal/import compatibility token.

Rationale:

Mobile selected-state UX uses real Mexican states. Exposing `MX-ALL` as if it were a selectable state would confuse users and create filtering mistakes. `NATIONAL` expresses the business rule directly while keeping state lists reserved for actual state codes.

## Unknown / Disabled / Rejected Handling

Internal states that must not be exposed as available:

- `UNKNOWN_REVIEW_REQUIRED`.
- `DISABLED`.
- Inactive.
- Rejected.
- Not user-facing.
- Provider capability unavailable/rejected/unknown/to-confirm.

Public behavior:

- These services are omitted from normal available service lists by default.
- If a future endpoint needs to mention an unavailable service, it must return `status = "UNAVAILABLE"` with safe copy only.
- Unknown coverage must never be treated as national by default.
- Unknown coverage must remain review-required until catalog ownership approves exposure.

## Short Code Compatibility Strategy

Current backend tables and filters use short state codes such as `CHH`, `COA`, `NLE`, and `CMX`. Future public API behavior must move to canonical `MX-*` codes without breaking existing development data abruptly.

Transition plan:

1. Accept `MX-*` at the public API boundary.
2. Temporarily accept legacy short codes such as `CHH` only as input compatibility.
3. Normalize accepted short-code input to canonical `MX-*` immediately at the boundary.
4. Emit only canonical `MX-*` codes in public responses.
5. Add validation tests that fail if new public responses contain short codes.
6. Later, migrate stored state coverage from `String(3)` short codes to canonical `MX-*` through an approved schema/data migration sprint.
7. After migration and telemetry/QA, remove or narrow short-code input compatibility.

Examples:

| Input | Boundary normalization | Public response |
|---|---|---|
| `CHH` | `MX-CHH` | `MX-CHH` |
| `COA` | `MX-COA` | `MX-COA` |
| `NLE` | `MX-NLE` | `MX-NLE` |
| `MX-CHH` | `MX-CHH` | `MX-CHH` |

Migration risk:

- If backend filters normalize only in one direction, national/state matching can hide valid services.
- If public responses leak short codes, mobile filtering based on `MX-*` can silently fail.
- If `MX-ALL` is exposed as a state, users may see a non-real state option.

## Security And Tekae Confidentiality Rules

- Use synthetic examples only.
- Do not document real Tekae catalog rows.
- Do not copy NDA, manuals, workbooks, screenshots with real provider data, credentials, token material, URLs, or commercial terms.
- Do not expose Tekae `menu`, `categoria`, `carrier`, provider IDs, or source row IDs in public examples.
- Public catalog responses must be safe for mobile bundles, screenshots, support walkthroughs, and QA evidence.
- Backend/admin may retain provider metadata only under RBAC, redaction, and audit rules.

## Example Public JSON Responses

National service:

```json
{
  "services": [
    {
      "id": "svc_synthetic_national_power",
      "displayName": "Servicio nacional demo",
      "serviceType": "bill_payment",
      "serviceCategory": "Utilities",
      "providerDisplayName": "Proveedor demo",
      "icon": "electricity",
      "description": "Servicio de ejemplo para validar cobertura nacional.",
      "isPayableInMobile": true,
      "isReferenceOnly": false,
      "coverage": {
        "mode": "NATIONAL",
        "states": [],
        "label": "Disponible a nivel nacional"
      },
      "status": "ACTIVE"
    }
  ],
  "count": 1,
  "state": {
    "code": "MX-CHH",
    "name": "Chihuahua"
  },
  "demo": true,
  "paymentAvailabilityGuaranteed": false
}
```

State-specific service:

```json
{
  "services": [
    {
      "id": "svc_synthetic_state_water",
      "displayName": "Agua demo estatal",
      "serviceType": "bill_payment",
      "serviceCategory": "Utilities",
      "providerDisplayName": "Proveedor estatal demo",
      "icon": "water",
      "isPayableInMobile": true,
      "isReferenceOnly": false,
      "coverage": {
        "mode": "STATE",
        "states": ["MX-CHH", "MX-COA"],
        "label": "Disponible en estados seleccionados"
      },
      "status": "ACTIVE"
    }
  ],
  "count": 1,
  "state": {
    "code": "MX-CHH",
    "name": "Chihuahua"
  },
  "demo": true,
  "paymentAvailabilityGuaranteed": false
}
```

No matching services:

```json
{
  "services": [],
  "count": 0,
  "state": {
    "code": "MX-JAL",
    "name": "Jalisco"
  },
  "message": "Por ahora no hay servicios disponibles para este estado.",
  "paymentAvailabilityGuaranteed": false
}
```

## Example Internal Mapping

Sanitized internal-only example:

```json
{
  "internalServiceId": "svc_internal_synthetic",
  "sourceProvider": "TEKAE",
  "sourceProviderServiceId": "[INTERNAL_ONLY]",
  "providerMetadata": {
    "menu": "[INTERNAL_ONLY]",
    "categoria": "[INTERNAL_ONLY]",
    "carrier": "[INTERNAL_ONLY]"
  },
  "publicProjection": {
    "id": "svc_synthetic_state_water",
    "displayName": "Agua demo estatal",
    "coverage": {
      "mode": "STATE",
      "states": ["MX-CHH"]
    },
    "status": "ACTIVE"
  }
}
```

The internal metadata exists only to support future provider launch/session construction after approval. It is not the FONDIXPAY business identity and must not become mobile taxonomy.

## STAGING Validation Plan

Before any future implementation can expose backend-owned coverage to mobile in STAGING:

- Validate `MX-CHH`, `MX-COA`, `MX-NLE`, `MX-CMX`, and `MX-JAL`.
- Validate every public response emits canonical `MX-*` codes only.
- Validate public national services return `coverage.mode = "NATIONAL"` and `coverage.states = []`.
- Validate state services return `coverage.mode = "STATE"` and only matching states.
- Validate `UNKNOWN_REVIEW_REQUIRED`, `DISABLED`, inactive, rejected, and not-user-facing services are omitted from available lists.
- Validate legacy input such as `CHH` is normalized at the boundary and never echoed as `CHH`.
- Validate no `MX-ALL` appears in selectable states or public `coverage.states`.
- Validate no Tekae `menu`, `categoria`, `carrier`, provider IDs, credentials, token material, raw payloads, URLs, or commercial terms appear in API responses, logs, QA screenshots, or docs.
- Validate mobile no longer needs local demo coverage metadata for backend-backed service filtering once the API is implemented.

## Future Implementation Plan

1. Add canonical state normalization helper at backend API boundary.
2. Add or evolve public catalog schema to include `coverage`.
3. Map legacy DB state rows to canonical `MX-*` in response projection.
4. Project national rows as `coverage.mode = "NATIONAL"` and `coverage.states = []`.
5. Keep hidden/internal states out of default public results.
6. Add tests for public field redaction and no short-code leakage.
7. Update mobile to prefer backend `coverage` fields and remove local demo coverage dependency only when backend contract is live.
8. Plan a later DB migration to canonical stored state codes.

## Acceptance Criteria For Future Sprint

- Public catalog API returns backend-owned coverage fields.
- Public response uses only `NATIONAL` and `STATE`.
- Public response emits only canonical `MX-*` state codes.
- National services return empty `coverage.states`.
- `MX-ALL` remains internal/import compatibility only.
- Unknown, disabled, inactive, rejected, and not-user-facing services are not exposed as available.
- Tekae provider metadata and confidential material are absent from public responses.
- Legacy short-code input is accepted only as temporary compatibility and normalized before response.
- Mobile can filter/display services using backend-provided coverage without relying on local demo coverage metadata.
- Tests cover national, state, unknown, disabled, short-code compatibility, and confidentiality redaction.

## Risks

- Short-code compatibility can linger and cause drift if no migration deadline is set.
- Backend/public response may accidentally leak provider metadata if schemas reuse admin models.
- National services may be hidden if `MX-ALL` and `NATIONAL` rules are mixed.
- Unknown coverage may be overexposed if review-required rows are converted to `ACTIVE`.
- Mobile may keep using local demo coverage longer than intended if backend contract is delayed.
- STAGING fixtures may not represent real provider catalog complexity.

## Open Questions

- Should the final implementation add `/api/catalog/services` or evolve `/service-catalog`?
- What exact backend schema/migration will replace `String(3)` state codes?
- Who approves removal of legacy short-code input compatibility?
- What is the final public category taxonomy for launch?
- What is the required STAGING validation threshold before mobile stops using local demo coverage metadata?
- Which support/admin view should explain why a service is hidden without exposing Tekae internals?

## Commit Suggestion

```text
phase-027: design public catalog coverage api
```
