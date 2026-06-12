# Sprint 021 — Tekae Catalog Coverage Normalization Design: Requirements

## Goal

Design the normalization layer that maps Tekae's catalog format and state codes to FondixPay's internal coverage model defined in Sprint 020.

## Context

Tekae uses its own state code format and catalog structure. Before any Tekae catalog data can drive mobile service filtering, it must be normalized to FondixPay's internal representation. Sprint 021 designs that normalization contract.

## Scope

- Create docs/TEKAE_CATALOG_NORMALIZATION_DESIGN.md with:
  - Tekae state code → MX ISO 3166-2 mapping table.
  - Catalog field normalization rules.
  - normalizer interface (inputs, outputs, error handling).
- Update docs/API.md, docs/ARCHITECTURE.md.
- Update docs/SERVICE_COVERAGE_GEOLOCATION_DESIGN.md and docs/TEKAE_INTEGRATION_READINESS.md.
- Record decisions in planning/DECISIONS.md.
- Update planning/QUESTIONS.md and planning/RISKS.md.

## Out of Scope

- No implementation. Design only.
- Tekae remains disabled.

## Acceptance Criteria

- TEKAE_CATALOG_NORMALIZATION_DESIGN.md defines the normalizer interface and state code mapping.
- Design is consistent with SERVICE_COVERAGE_GEOLOCATION_DESIGN.md.
