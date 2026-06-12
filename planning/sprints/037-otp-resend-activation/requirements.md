# Sprint 037 — OTP Resend Activation: Requirements

## Goal

Make the "Reenviar código" text on the OTP verification screen functional. It rendered after a 25-second countdown but had no `onPress` handler — it was a dead UI element.

## Scope

- Mobile only. No backend, store action, or new dependency.
- Wrap resend text in `Pressable`, call existing `requestLoginCode(phone)` from auth store.
- Reset countdown to 25 seconds after successful resend.
- Show 3-second "Código reenviado" confirmation on success.
- Disable `Pressable` while `isLoading`.

## Out of Scope

- No new backend endpoint or rate-limiting change.
- No email/SMS provider integration.
- No Tekae runtime. No payment logic.

## Acceptance Criteria

- "Reenviar código" is tappable after countdown reaches 0.
- Tapping calls `requestLoginCode` with the phone from route params.
- Countdown resets to 25 after successful resend.
- "Código reenviado" confirmation appears for ~3 seconds on success.
- Button is visually disabled and non-interactive while `isLoading`.
- `npm run typecheck` passes with 0 errors.
