# Sprint 040 — links.ts Wiring to Landing Pages: Requirements

## Goal

Wire `PRIVACY_PAGE_URL` and `TERMS_PAGE_URL` from `constants/links.ts` into the two mobile screens where they are most naturally surfaced.

## Scope

- `ProfileScreen`: add `onPress` to "Seguridad y privacidad" row → opens `PRIVACY_PAGE_URL` via `Linking` when non-empty.
- `OnboardingScreen`: add consent footnote below login link → inline tappable spans for Terms and Privacy when URLs non-empty, plain text when empty.
- No new screen, store, component, or endpoint.

## Out of Scope

- No hardcoded unconfirmed URLs.
- No payment, provider, Tekae, or infrastructure changes.

## Acceptance Criteria

- Profile "Seguridad y privacidad" row opens privacy page when URL is set.
- Onboarding last slide shows consent footnote.
- Both links gracefully degrade to plain text when URLs are empty.
- `npm run typecheck` passes with 0 errors.
