# UI/UX Guidelines

## Direction

FondixPay is mobile-first. The primary product promise is simple: open the app, see pending services, pay, and receive a receipt.

Visual style should be professional fintech: clear hierarchy, calm colors, strong readability, accessible controls, and minimal friction.

## Visual Reference

Sprint 003 uses per-screen PNG mockups in `references/` (`01-splash.png` through `14-history.png`), not a single `fondix.png` file.

`fondix.png` was not found in this repo during Phase 1 inspection and is superseded for UI work by ADR-013.

## Current Screens

- Onboarding.
- PhoneLogin.
- OtpVerification.
- AccountCreated.
- Home.
- AddService.
- ServiceDetail.
- ConfirmPayment.
- PaymentSuccess.
- History.
- Profile.

## Future Screens

- Support case detail.
- Receipt detail/download.
- Payment status detail.
- Admin/support console screens, if approved.
- Audit/finance views, if approved.

## Required States

- Loading.
- Empty.
- Error.
- Success.
- Disabled.
- Pending payment.
- Payment failed.
- Receipt unavailable.

## Accessibility

- Touch targets must be comfortable on iOS and Android.
- Text must remain readable at common mobile sizes.
- Critical actions need clear labels and confirmation.
- Errors should explain what happened and what the user can do next.

## Consistency

Use shared theme tokens for color, typography, spacing, and components. Avoid one-off screen styling during Phase 3.

## Language (product copy)

- Prefer: "Ya quedó pagado", "Pagar", "Listo".
- Primary actions in uppercase on buttons: `PAGAR`, `CONTINUAR`, `LISTO`.
- Development OTP remains 6 digits (`123456`); OTP UI uses 6 boxes (ADR-012).

## Visual reference note (2026-05-19)

Phase 3 alignment uses `references/01-splash.png` … `references/14-history.png` as the authoritative per-screen mockups. `fondix.png` is not used.
