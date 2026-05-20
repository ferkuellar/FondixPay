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

## UX/Product Critical Requirements Before Real Payments

Before FondixPay can support real payments, the product UX must satisfy these requirements:

- Fee visible before payment confirmation, on confirmation, and on receipt.
- OTP UI and design handoffs must remain 6 digits.
- Payment method must be explicit; users need a clear add/select/manage method flow.
- Payment recovery path is mandatory: failure state, retry, change method, support, and charged/not-charged clarity.
- Trust signals must explain real controls: operator identity, data protection, fee transparency, support, and security model.
- Longer flows should use stepper/progress cues where user context can be lost.
- Empty, loading, error, success, disabled, and pending states must be present for payment-critical screens.
- Receipt must behave as proof: view, download, share, and status clarity.
- Support entry points must be visible after failed or uncertain payment outcomes.

## Fee Transparency Requirements

- Always show service amount, FondixPay fee, and final total before payment.
- Payment CTA must include the final total, not only "Pagar".
- Receipt and history must show the same breakdown.
- Allowed trust copy:
  - "Te mostraremos siempre la comisión antes de pagar."
  - "No se realiza ningún cargo sin tu confirmación."
  - "Guarda tu comprobante después de cada pago."
- Prohibited copy until implemented/approved:
  - "100% seguro"
  - "Protección bancaria"
  - "PCI compliant"
  - "Tokenización segura"
  - "Regulado por Banxico"
- Fee comprehension must be validated with target users before real payments.

## Payment Method UX Requirements

- Do not show a card or payment method as selected unless a real or explicitly mock method exists.
- If no method exists, show an empty state and CTA: "Agregar método de pago".
- The selected method must be visible before payment confirmation.
- The user must be able to change method before paying.
- Mock/dev method must be clearly labeled as simulated and no real charge.
- Do not force card-only UX for users who may be non-banked or partially banked.
- Add future help copy: "¿Por qué pedimos esto?"
- Use future card copy only when provider tokenization exists: "Nunca guardamos el número completo de tu tarjeta." and "El método de pago se procesa con un proveedor autorizado."
- Until tokenization/provider is approved, avoid card-entry forms.
# Payment Method Mock UX

Before real providers exist, FondixPay must use an explicit mock/dev payment method flow:

- The app starts with no payment method.
- The user can add a demo method without entering real card, CVV, CLABE, or bank data.
- The selected method is visible before confirming payment.
- The user can change the selected method before paying.
- Every demo method must say “Método demo” or equivalent.
- Confirmation must state that no real charge will occur.
- Payment success and receipt views should show the method used when available.
- Fee breakdown from Phase 5C must remain visible and unchanged.

## Payment Recovery UX Requirements

- Failed, pending, timeout, and duplicate-attempt states must be explicit.
- Failed payment copy must state when no charge was made.
- Pending/timeout must never use success copy or confetti.
- Retry must be offered only as a safe next action.
- Change payment method must be available from failure recovery when a method flow exists.
- Support entry must use safe references and must not promise real chat when unavailable.
- Recovery screens must preserve amount, fee, total, and selected method breakdown.
- User messages must avoid provider jargon and show the next action.
