# Sprint 024 — GPS Permission with Manual State Fallback: Requirements

## Goal

Request device location permission on app launch and resolve the user's Mexican state from GPS coordinates, falling back to the manual selector (Sprint 023) when permission is denied or unavailable.

## Context

Sprint 023 provides the manual state selector. Sprint 024 adds the automatic path: GPS permission → coordinates → state resolution via `locationStateResolver`. The manual selector becomes the fallback, not the primary path.

## Scope

- Add `expo-location` package (`mobile/package.json`, `mobile/package-lock.json`).
- Update `mobile/app.json` with location permission strings (iOS NSLocationWhenInUseUsageDescription, Android permissions).
- Create `mobile/src/utils/locationStateResolver.ts` — resolves GPS coordinates to a Mexican state code.
- Update `mobile/src/components/StateSelectorCard.tsx` to trigger GPS resolution on mount and show manual selector as fallback.
- Update `mobile/src/store/statePreferenceStore.ts` to store resolved state.
- Update planning/RISKS.md and planning/STATE.md.

## Out of Scope

- No catalog filtering yet. GPS resolves the state; filtering wired in Sprint 025.
- No backend, payment, or provider changes.

## Acceptance Criteria

- App requests location permission on first launch.
- GPS-resolved state stored in statePreferenceStore.
- Manual selector shown when GPS denied or unavailable.
- `npm run typecheck` passes with 0 errors.
