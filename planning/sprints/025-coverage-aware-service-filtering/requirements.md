# Sprint 025 — Coverage-Aware Service Filtering: Requirements

## Goal

Wire the user's resolved state (from Sprint 023/024) into the service catalog display so that AddServiceScreen only shows services available in the user's state.

## Context

The state selector and GPS resolver (Sprints 023–024) store the user's state code. Sprint 025 connects that state code to the service catalog filter — both the local utility and the API request parameter.

## Scope

- Create `mobile/src/utils/serviceCoverageFilter.ts` — filters a service list to those covering the user's state.
- Update `mobile/src/services/serviceCatalogApi.ts` — pass `state_code` query param.
- Update `mobile/src/store/serviceCatalogStore.ts` — read state preference and trigger filtered fetch.
- Update `mobile/src/screens/services/AddServiceScreen.tsx` — integrate filtered catalog display.
- Update `mobile/src/types/index.ts` — extend types as needed for coverage fields.
- Update planning/RISKS.md and planning/STATE.md.

## Out of Scope

- No backend implementation yet (Sprint 027–028).
- No payment, provider, or auth changes.

## Acceptance Criteria

- AddServiceScreen shows only services matching user's resolved state.
- `serviceCoverageFilter` utility handles missing/null state gracefully.
- `npm run typecheck` passes with 0 errors.
