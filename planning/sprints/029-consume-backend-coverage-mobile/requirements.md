# Sprint 029 — Consume Backend Coverage in Mobile Filtering: Requirements

## Goal

Update the mobile coverage filter utility to consume backend API data instead of local mock data, completing the end-to-end connection between the user's state selection and the backend catalog endpoint.

## Context

Sprint 028 implemented the backend API and updated the mobile API client. Sprint 029 connects the last link: `serviceCoverageFilter.ts` now filters the backend response rather than a local mock array.

## Scope

- Update `mobile/src/utils/serviceCoverageFilter.ts` to operate on backend `ServiceCatalogItem` type.
- Update planning/STATE.md.

## Out of Scope

- No new mobile screens, components, or stores.
- No backend changes.
- No payment, provider, or auth changes.

## Acceptance Criteria

- `serviceCoverageFilter` works correctly with backend API response data.
- `npm run typecheck` passes with 0 errors.
