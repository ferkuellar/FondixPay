# Sprint 027 — Public Catalog Coverage API Design: Requirements

## Goal

Design the backend public API endpoint that exposes service catalog coverage by state — separate from Tekae's internal catalog, usable by the mobile app without authentication.

## Context

The mobile coverage filter (Sprint 025) currently operates on client-side mock data. Sprint 027 designs the backend API that will replace the mock data source. The API must not expose Tekae internals, must be public (no auth required for catalog browsing), and must support `state_code` filtering.

## Scope

- Create docs/PUBLIC_CATALOG_COVERAGE_API_DESIGN.md with:
  - Endpoint: `GET /service-catalog?state_code=...`
  - Request/response schemas.
  - State code normalization behavior (CHH and MX-CHH both accepted).
  - Empty-list vs. 404 behavior for unknown state codes.
- Update docs/API.md, docs/ARCHITECTURE.md, docs/SECURITY.md.
- Update docs/TEKAE_CATALOG_NORMALIZATION_DESIGN.md to clarify the public/internal boundary.
- Record decisions in planning/DECISIONS.md.
- Update planning/QUESTIONS.md and planning/RISKS.md.

## Out of Scope

- No implementation. Design only.
- No mobile, payment, or infrastructure changes.

## Acceptance Criteria

- PUBLIC_CATALOG_COVERAGE_API_DESIGN.md defines the endpoint contract.
- Design is consistent with TEKAE_CATALOG_NORMALIZATION_DESIGN.md and SERVICE_COVERAGE_GEOLOCATION_DESIGN.md.
