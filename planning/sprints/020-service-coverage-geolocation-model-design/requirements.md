# Sprint 020 — Service Coverage & Geolocation Model Design: Requirements

## Goal

Design the data model and architectural approach for service coverage based on Mexican state geolocation — defining how services declare coverage, how user location is resolved, and how filtering will work.

## Context

FondixPay's service catalog will only show services available in the user's state. Sprint 020 produces the design document that governs how state-based coverage works across backend, mobile, and the Tekae catalog normalization path.

## Scope

- Create docs/SERVICE_COVERAGE_GEOLOCATION_DESIGN.md with:
  - Coverage data model (service ↔ state mapping).
  - Geolocation resolution chain (GPS → manual selection → default).
  - State code normalization strategy (CHH vs MX-CHH).
  - API filter interface design.
- Update docs/API.md, docs/ARCHITECTURE.md, docs/ENVIRONMENTS.md, docs/SECURITY.md.
- Record decisions in planning/DECISIONS.md.
- Update planning/QUESTIONS.md and planning/RISKS.md.

## Out of Scope

- No implementation. Design doc only.
- No mobile UI, backend endpoint, or database changes.

## Acceptance Criteria

- SERVICE_COVERAGE_GEOLOCATION_DESIGN.md is complete and internally consistent.
- State code normalization approach documented.
- Coverage filtering API interface defined.
