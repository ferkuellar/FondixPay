# Sprint 003 — Completion Report

Date: 2026-05-19  
Status: Complete (mock/dev UI system; not production-ready)

## Summary

Implemented a mobile UI/UX production system: design tokens, reusable components, and visual polish on all primary screens aligned with `references/01-splash.png` through `14-history.png`. Backend, payment semantics, and store logic were not changed except a UI-only `showAccountWelcome` flag in `authStore`.

## Decisions Applied

| ID | Decision |
|----|----------|
| ADR-012 | OTP 6 digits / 6 input boxes |
| ADR-013 | Per-screen PNGs in `references/` replace `fondix.png` |
| ADR-014 | StyleSheet + `mobile/src/theme/` tokens (no NativeWind/Tailwind) |
| ADR-015 | Splash illustration placeholder + TODO until real asset |

## Files Created

### Theme (`mobile/src/theme/`)

- `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `index.ts`
- Extended `colors.ts` (legacy aliases preserved)

### Components (`mobile/src/components/`)

- `SecondaryButton.tsx`, `TextInput.tsx`, `NumericKeypad.tsx`, `PhoneInput.tsx`, `OtpInput.tsx`
- `ServiceIconBadge.tsx`, `StatusBadge.tsx`, `ServiceCard.tsx`
- `AmountDisplay.tsx`, `PaymentSummaryCard.tsx`, `ReceiptCard.tsx`
- `EmptyState.tsx`, `ErrorState.tsx`, `LoadingState.tsx`, `SuccessIllustration.tsx`
- `BottomTabBar.tsx`

### Screens

- `mobile/src/screens/auth/AccountCreatedScreen.tsx`

### Documentation

- `planning/sprints/003-ui-ux-production-system/COMPLETION_REPORT.md` (this file)

## Files Modified

- All primary screens under `mobile/src/screens/`
- `mobile/src/navigation/AppNavigator.tsx`
- `mobile/src/store/authStore.ts` (`showAccountWelcome`, `dismissAccountWelcome`)
- `mobile/src/types/index.ts` (`AccountCreated` route)
- `mobile/src/screens/styles.ts`
- `mobile/src/components/Screen.tsx`, `PrimaryButton.tsx`
- `planning/DECISIONS.md` (ADR-012–015)
- `planning/STATE.md`
- `docs/UI_UX_GUIDELINES.md`

## Phase 3 Implementation Choices

1. **AccountCreated** — Shown once after successful OTP via `showAccountWelcome`; session restore goes straight to Home.
2. **11-payment mockup** — `ServiceDetail` shows amount, static demo payment method, `PAGAR AHORA`; `ConfirmPayment` matches `12-confirm-payment` summary card.
3. **AddService** — Single screen with local steps (`list` → `number` → `confirm`) and tooltip card before navigate (no API change).
4. **Bottom navigation** — Custom `BottomTabBar` on main hubs; stack navigator unchanged (no new tab navigator).
5. **Home → Pay** — Unchanged shortcut to `ConfirmPayment` from `ServiceCard`; detail flow still available.

## States Represented

| State | Where |
|-------|--------|
| Loading | AddService providers/validate, ConfirmPayment pay, auth restore |
| Empty | Home (no services), History filters |
| Error | Phone/OTP text, AddService fetch, ConfirmPayment failed/retry |
| Success | AccountCreated, PaymentSuccess |
| Disabled | Phone/OTP/AddService buttons |
| Pending | StatusBadge on ServiceCard |
| Payment failed | ConfirmPayment ErrorState + retry |
| Receipt unavailable | History first row demo flag on ReceiptCard |

## Validation

- `cd mobile && npm run typecheck` — pass
- `npx expo start` — not run in CI here; recommended manual Expo Go pass against PNGs

## Risks / Deuda

- Splash asset still placeholder.
- Payment method UI is non-functional demo.
- OTP resend timer is visual only (no API resend).
- History “receipt unavailable” shown on first item for demo.
- `@expo/vector-icons` used via Expo bundle (not added to `package.json`).

## Suggested Follow-Up Sprint

- **Phase 4 Auth** or **004-mobile-polish**: real OTP resend, production splash asset, optional React Navigation tabs, component snapshot tests, Home fetch loading when services come from API.
