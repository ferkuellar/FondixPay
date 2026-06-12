# Sprint 044 — PhoneLogin Consent Footnote: Requirements

## Goal

Add the terms/privacy consent footnote to PhoneLoginScreen to complete consistent consent coverage across the entire auth entry path.

## Context

OnboardingScreen (Sprint 040) and AccountCreatedScreen (Sprint 042) already have this footnote. PhoneLoginScreen was the remaining gap. PhoneLoginScreen already has `useAppTheme` — no additional wiring needed.

## Scope

- Add `Linking` to React Native imports.
- Add `PRIVACY_PAGE_URL` and `TERMS_PAGE_URL` imports from `constants/links`.
- Add consent footnote after CONTINUAR button inside `content` View.
- Same inline tappable span pattern as OnboardingScreen and AccountCreatedScreen.
- Add `consentNote` and `consentLink` styles.

## Out of Scope

- No new screen, store, component, or endpoint.
- No payment, provider, Tekae, or infrastructure changes.

## Acceptance Criteria

- Consent footnote visible below CONTINUAR button.
- Links tappable when URLs set; plain text when empty.
- `npm run typecheck` passes with 0 errors.
