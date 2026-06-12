# Sprint 022 — Tekae Catalog Coverage Normalization Implementation: Requirements

## Goal

Implement the Tekae catalog normalizer as designed in Sprint 021 — a backend Python module that maps Tekae catalog data to FondixPay's internal coverage model.

## Context

Sprint 021 produced TEKAE_CATALOG_NORMALIZATION_DESIGN.md. Sprint 022 implements that design as `tekae_normalizer.py` in the backend service catalog module, with full test coverage.

## Scope

- Implement `backend/app/modules/service_catalog/tekae_normalizer.py`.
- Write `backend/tests/test_tekae_catalog_normalizer.py` covering:
  - State code normalization (CHH → MX-CHH, MX-CHH passthrough).
  - Field mapping from Tekae format to internal format.
  - Error/edge cases.
- Update planning/STATE.md.

## Out of Scope

- No Tekae API calls. Normalizer operates on static or mock Tekae data structures.
- Tekae remains disabled (TEKAE_ENABLED=false).
- No mobile, frontend, or database changes.

## Acceptance Criteria

- `tekae_normalizer.py` implements the interface from TEKAE_CATALOG_NORMALIZATION_DESIGN.md.
- All tests pass.
- `npm run typecheck` (mobile) passes — no mobile changes expected.
