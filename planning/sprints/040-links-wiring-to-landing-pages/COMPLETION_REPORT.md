# Sprint 040 — links.ts Wiring to Landing Pages: Completion Report

Date: 2026-06-12
Commit: 0bbe91e

## Status: COMPLETED

## Files Changed

| File | Action |
|------|--------|
| `mobile/src/screens/profile/ProfileScreen.tsx` | Modified |
| `mobile/src/screens/OnboardingScreen.tsx` | Modified |

## Implementation Notes

- `ProfileScreen`: added `Linking` import; added `PRIVACY_PAGE_URL` import; added `onPress` + `accessibilityLabel` to "Seguridad y privacidad" `Pressable`.
- `OnboardingScreen`: added `Linking` import; added `TERMS_PAGE_URL` + `PRIVACY_PAGE_URL` imports; added consent footnote below login link using inline `Text` spans with conditional `onPress` and `accessibilityRole`; added `consentNote` and `consentLink` styles.

## Decision Boundary

- No hardcoded URL — all gated on truthiness of constants.
- No store action, new component, backend endpoint, payment logic, or infrastructure change.

## Validation

- `npm run typecheck`: 0 errors.
