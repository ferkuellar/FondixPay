# Sprint 030 — Backend-Backed Mobile Catalog Smoke Validation: Requirements

## Goal

Validate the complete end-to-end path: mobile app → `GET /service-catalog?state_code=...` → backend filter → mobile display. Produce a smoke validation document confirming the path works.

## Context

Sprints 025–029 built and connected the coverage-aware catalog path. Sprint 030 is a validation sprint — no new code, just confirming the assembled path functions correctly and documenting the results.

## Scope

- Execute smoke tests on the backend-backed mobile catalog path.
- Create docs/MOBILE_BACKEND_CATALOG_SMOKE_VALIDATION.md documenting:
  - Test scenarios run.
  - Actual vs. expected results.
  - Any gaps or follow-up items.
- Update planning/STATE.md.

## Out of Scope

- No code changes. Validation and documentation only.

## Acceptance Criteria

- MOBILE_BACKEND_CATALOG_SMOKE_VALIDATION.md confirms the full path works.
- Any gaps documented as follow-up items.
