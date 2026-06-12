# Sprint 023 — Mobile State Selector Mock: Requirements

## Goal

Add a state selector UI component and Zustand preference store to the mobile app so users can manually select their Mexican state for coverage-aware catalog filtering.

## Context

Sprint 020 defined the geolocation resolution chain: GPS → manual selection → default. Sprint 023 implements the manual selection UI (the mock/dev path before GPS is wired). The GPS integration comes in Sprint 024.

## Scope

- Create `mobile/src/components/StateSelectorCard.tsx` — UI component for state selection.
- Create `mobile/src/constants/mexicoStates.ts` — list of Mexican states with ISO codes.
- Create `mobile/src/store/statePreferenceStore.ts` — Zustand store for persisting user's selected state.
- Integrate StateSelectorCard into HomeScreen and ProfileScreen (minor wiring).
- Update planning/STATE.md.

## Out of Scope

- No GPS/location permission yet (Sprint 024).
- No backend catalog filtering yet (Sprint 025+).
- No payment, provider, or financial logic changes.

## Acceptance Criteria

- StateSelectorCard renders in HomeScreen and ProfileScreen.
- Selected state persists via statePreferenceStore.
- `npm run typecheck` passes with 0 errors.
