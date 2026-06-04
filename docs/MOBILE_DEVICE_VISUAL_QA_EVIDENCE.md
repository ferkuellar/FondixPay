# Mobile Device Visual QA Evidence

Status: Sprint 016B complete. Android device QA evidence pack captured for the required reachable mock/dev payment screens.

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

## Sprint 016B QA Environment

| Item | Value |
|---|---|
| Date | 2026-06-04 |
| Environment | Android emulator via ADB |
| Device | `emulator-5554`, AVD `Pixel_9_Pro` |
| App host | Expo Go package `host.exp.exponent` |
| Metro command used | `npx expo start --port 8082 --non-interactive` |
| Native launch route | `adb shell am start -a android.intent.action.VIEW -d "exp://10.0.2.2:8082"` |
| Evidence directory | `docs/qa/sprint-016-mobile-device-visual-qa/` |

Startup notes:

- `npx expo start --port 8082 --non-interactive` started Metro on `http://localhost:8082`.
- Expo CLI printed `--non-interactive is not supported, use $CI=1 instead`, but Metro continued running and bundled the app.
- Opening `exp://127.0.0.1:8082` in Expo Go stayed on the Expo progress view.
- Opening `exp://10.0.2.2:8082` loaded the FONDIXPAY app in Expo Go.
- The app initially showed the authenticated account-created interstitial; tapping `Ahora no` reached Home.

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
| `docs/qa/sprint-016-mobile-device-visual-qa/03-payment-success.png` | PaymentSuccess | Captured in Sprint 016B. Visible copy says `Pago de prueba completado`, `La simulacion... se guardo en modo prueba`, and `No hubo operacion bancaria real`. |
| `docs/qa/sprint-016-mobile-device-visual-qa/04-payment-failed.png` | PaymentFailed plus recovery action | Captured in Sprint 016B. Visible copy says `No se completo el pago de prueba` and `Simulacion sin operacion real`; `REINTENTAR PRUEBA` is reachable. |
| `docs/qa/sprint-016-mobile-device-visual-qa/05-receipt-detail.png` | ReceiptDetail | Captured in Sprint 016B. Screen is titled `Comprobante de prueba` and shows demo references. Residual copy note recorded below. |
| `docs/qa/sprint-016-mobile-device-visual-qa/06-service-detail.png` | ServiceDetail | Captured in Sprint 016B from Home saved-service card. Visible copy says `TOTAL SIMULADO` and `Modo prueba: no se realiza una operacion real`. |
| `docs/qa/sprint-016-mobile-device-visual-qa/07-add-payment-method-mock.png` | AddPaymentMethodMock | Captured in Sprint 016B. Visible copy says no real card, CVV, expiry, or banking data is requested. |
| `docs/qa/sprint-016-mobile-device-visual-qa/08-payment-pending.png` | PaymentPending | Captured in Sprint 016B. Visible copy says it simulates a pending state and that no real operation/provider confirmation is in progress. |
| `docs/qa/sprint-016-mobile-device-visual-qa/10-payment-modal-or-alert.png` | Payment-related alert/scenario state | Captured in Sprint 016B. In-app protected simulation alert and demo scenario selector are reachable; no native modal/toast was encountered. |

## Screens Not Yet Captured

All required reachable Sprint 016B screens were captured or documented.

Not separate from captured evidence:

- Payment recovery/retry action is visible in `04-payment-failed.png` through `REINTENTAR PRUEBA`; tapping it returned to `ConfirmPayment`.
- Payment history detail is not a separate route from `ReceiptDetail`; History rows navigate to `ReceiptDetail`.
- A native modal/toast was not encountered. The reachable payment-related alert/card state is captured in `10-payment-modal-or-alert.png`.

## Findings From Captured Screens

| Area | Finding |
|---|---|
| Home copy | Pass for captured viewport. It says `TOTAL DEMO ESTE MES`, `Saldo demo`, and `Este saldo es simulado y no representa dinero real.` |
| Service list copy | Pass for captured viewport. Service area says `Servicios demo`; CTAs say `Simular`, not provider-confirmed payment. |
| Confirm payment copy | Pass for captured viewport. It says `TOTAL SIMULADO`, `Revisa el monto de prueba`, and `No se realizará una operación real.` |
| Confirm payment CTA | Pass for captured viewport. The button label `Simular pago` fits and does not imply real provider execution. |
| Layout | Pass for captured screens. No obvious clipping, overlap, or unreadable text was observed in the two captured screenshots. |
| Service detail | Pass. The screen uses simulated total and no-real-operation copy. No clipped CTA or unreadable disclaimer was observed. |
| Add payment method mock | Pass. The screen clearly avoids real card/CVV/banking data capture and the `AGREGAR` CTA fits. |
| Payment success | Pass. The screen uses payment-test/simulation copy and says no real banking operation occurred. |
| Payment failed | Pass. The screen says the payment test was not completed, explains no real operation occurred, and exposes reachable recovery actions. |
| Payment pending | Pass. The screen states the pending state is simulated and no provider confirmation is in progress. |
| Receipt detail | Pass with residual copy debt. The screen is titled `Comprobante de prueba` and shows demo references, but visible internal labels `Prueba: Succeeded` and `Estado Demo: Mock Succeeded` remain less user-friendly than Spanish demo labels. |
| Payment alert/scenario state | Pass. The in-app alert says the flow is demo-only and there is no real provider, WhatsApp, or banking operation. |

## Incomplete Acceptance

Sprint 016B completes the Sprint 016 missing evidence pack. Sprint 016 can now be closed for mock/dev mobile visual QA evidence, with residual copy debt recorded for `ReceiptDetail` internal technical labels.

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
- No Tekae runtime was enabled.
- Prontipagos was not reintroduced.
- FONDIXPAY was not described as a fintech.
