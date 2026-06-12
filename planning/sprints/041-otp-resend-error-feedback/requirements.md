# Sprint 041 — OTP Resend Error Feedback: Requirements

## Goal

Surface user-facing error feedback when the OTP resend call fails, and prevent the resend failure from polluting the wrong-code error card.

## Problem

Two bugs existed after Sprint 037:
1. `requestLoginCode` failure wrote to `store.error`, which the OTP error card displayed with hardcoded "Código incorrecto…" copy — wrong message for a resend failure.
2. The resend catch block was silent; users received no feedback on failure.

## Scope

- Add local `resendError: string | undefined` state.
- Subscribe to `clearError` from auth store.
- `resendCode` catch: capture error message locally, call `clearError()` to prevent store contamination, set `resendError`, auto-clear after 5 seconds.
- Render `resendError` as an amber warning card near the resend button.
- OTP red error card remains exclusively for `signInWithOtp` failures.
- Mobile only. No backend, store action, or new dependency.

## Acceptance Criteria

- Resend network failure shows amber warning card with actual error message.
- Resend failure does NOT trigger the "Código incorrecto" red card.
- `store.error` is cleared after resend failure via `clearError()`.
- Amber card auto-clears after 5 seconds.
- `npm run typecheck` passes with 0 errors.
