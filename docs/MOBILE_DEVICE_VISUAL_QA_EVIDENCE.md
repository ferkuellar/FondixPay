# Mobile Device Visual QA Evidence

Status: Sprint 016 partial evidence. Android device QA started, but the full evidence pack is not complete.

## Scope

Sprint 016 is intended to close the Sprint 015 residual visual QA gap by reviewing mock/dev payment screens in a real visual environment.

This sprint does not enable Tekae, does not call Tekae, does not create real payment behavior, and does not prove production readiness.

## QA Environment

| Item | Value |
|---|---|
| Date | 2026-06-03 |
| Environment | Android emulator via ADB |
| Device | `emulator-5554`, reported by Expo as `Pixel_9_Pro` |
| App host | Expo Go package `host.exp.exponent` |
| Project command attempted | `npm --prefix mobile run android` |
| Fallback command attempted | `npx expo start --android --port 8082` |
| Evidence directory | `docs/qa/sprint-016-mobile-device-visual-qa/` |

## Startup Notes

- `npm --prefix mobile run android` could not use port `8081` because it was already occupied.
- `npx expo start --android --port 8082` started Metro and attempted to open Expo Go.
- Expo reported the installed Expo Go version was behind the SDK 52 recommendation and requested interactive installation.
- The app was nevertheless visible in Expo Go and ADB UI inspection confirmed rendered FONDIXPAY screens.
- Further ADB inspection after the loading state was blocked by tool approval/usage limits, so the full visual pack could not be completed in this run.

## Evidence Captured

| Screenshot | Screen | Result |
|---|---|---|
| `docs/qa/sprint-016-mobile-device-visual-qa/01-home.png` | Home / services demo dashboard | Captured. Visible copy uses demo language and states the balance is simulated. |
| `docs/qa/sprint-016-mobile-device-visual-qa/02-confirm-payment.png` | Confirm payment / mock payment confirmation | Captured. Visible copy uses `TOTAL SIMULADO`, `monto de prueba`, and says there is no real banking operation. |

## Screens Not Yet Captured

The following required/expected screens still need visual evidence before Sprint 016 can pass:

- `ServiceDetail`
- `AddPaymentMethodMock`
- `PaymentSuccess`
- `PaymentFailed`
- `ReceiptDetail`
- receipt unavailable or pending state, if reachable without changing runtime logic

## Findings From Captured Screens

| Area | Finding |
|---|---|
| Home copy | Pass for captured viewport. It says `TOTAL DEMO ESTE MES`, `Saldo demo`, and `Este saldo es simulado y no representa dinero real.` |
| Service list copy | Pass for captured viewport. Service area says `Servicios demo`; CTAs say `Simular`, not provider-confirmed payment. |
| Confirm payment copy | Pass for captured viewport. It says `TOTAL SIMULADO`, `Revisa el monto de prueba`, and `No se realizará una operación real.` |
| Confirm payment CTA | Pass for captured viewport. The button label `Simular pago` fits and does not imply real provider execution. |
| Layout | Pass for captured screens. No obvious clipping, overlap, or unreadable text was observed in the two captured screenshots. |

## Incomplete Acceptance

Sprint 016 cannot be marked complete from this run because the full payment mock flow was not visually captured through success, failure, and receipt states.

The captured evidence is useful, but it only partially closes the Sprint 015 residual risk.

## Decision Boundary

- No backend runtime behavior changed.
- No mobile runtime behavior changed.
- No payment logic changed.
- No provider adapter changed.
- No Tekae runtime was enabled.
- No payment endpoint or webhook was created.
- No migrations changed.
- No `.env` or credentials changed.
- No infrastructure, workflow, or deployment behavior changed.

