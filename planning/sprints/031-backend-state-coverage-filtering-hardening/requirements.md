# Sprint 031 — Backend State Coverage Filtering Test Hardening: Requirements

## Goal

Add the three missing acceptance-criteria test cases to `test_public_catalog_coverage_api.py` that the Sprint 030 smoke validation identified as gaps, and update API.md with confirmed filtering behavior.

## Context

Sprint 028 created the initial test file. Sprint 030 smoke validation confirmed the filtering path works but identified three untested edge cases: state code parity (CHH vs MX-CHH), state exclusion (service for CHH not returned for COA), and invalid state code handling (unknown code → 200 empty list). Sprint 031 adds these tests with no production code changes.

## Scope

- Update `backend/tests/test_public_catalog_coverage_api.py`:
  - Add parity test: CHH and MX-CHH return identical result sets.
  - Add exclusion test: CHH-only service not returned for MX-COA request.
  - Add invalid input test: unrecognized state_code returns 200 with empty list.
- Update `docs/API.md` with confirmed state_code behavior table and filtering logic.
- Update planning/STATE.md.

## Out of Scope

- No production code changes — tests only.
- No mobile, landing, provider, or infrastructure changes.

## Acceptance Criteria

- Three new test cases added and passing.
- `docs/API.md` state_code behavior table updated.
