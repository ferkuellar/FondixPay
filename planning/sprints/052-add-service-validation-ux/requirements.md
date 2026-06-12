# Sprint 052 — AddServiceScreen Validation UX: Requirements

## Goal

Remove the redundant full-screen `LoadingState` overlay during inline reference number validation in AddServiceScreen. The `PrimaryButton` already communicates the loading state via its `loading` prop.

## Context

During the Sprint 050 LoadingState audit, AddServiceScreen was observed rendering both a full-screen `LoadingState` ("Validando número...") and a `PrimaryButton` with `loading={validating}` simultaneously during the 500ms mock validation. The full-screen overlay takes `flex: 1` and dominates the layout unnecessarily for a brief inline validation step.

## Scope

- Remove `{validating ? <LoadingState message="Validando número..." /> : null}` from the `number` step in AddServiceScreen.
- `LoadingState` import remains — still used for the initial catalog load (lines 82-86).
- No logic, store, backend, or navigation changes.

## Out of Scope

- No changes to `PrimaryButton`, `LoadingState`, or any other component.
- No payment, provider, or auth changes.

## Acceptance Criteria

- During validation, only the `PrimaryButton` spinner shows — no full-screen overlay.
- `npm run typecheck` and `npm run lint` pass with 0 errors.
