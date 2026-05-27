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
- The current roadmap is card-only for user-facing payments. UX research should reduce card trust and onboarding friction without showing unsupported payment methods.
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

## Account and Balance UX

- Demo balance must use labels such as “Saldo demo” and “No representa dinero real”.
- Do not show real-money balance copy without approved backend/legal/provider backing.
- Pending and held amounts must be separated from available display.
- Movement lists must explain direction, amount, state, and related payment context.
- Provide empty state when no movements or demo balance exist.
- Provide error state when balance cannot load.
- Do not claim custody, regulation, or protected funds unless approved and true.

## Phase 6B Demo Balance UX Status
- Implemented surfaces must use `Saldo demo` as the balance label.
- Every account or movement surface must preserve the no-real-money disclaimer.
- Loading, error, and empty states must not substitute fake real-money copy.
- Movements may be shown as demo credits/debits, but they must not imply provider settlement or regulated custody.
## Phase 7 Transaction History And Receipt UX

- History must provide basic filters for all, paid demo, pending, and failed records.
- Status badges must distinguish payment status from receipt status.
- Receipt detail must keep service amount, fee, total, currency, method, date, and safe reference visible.
- A receipt is not proof of real provider confirmation while the flow is mock/dev.
- Pending and timeout entries must use review/pending copy, not paid-success copy.
- Failed and duplicate-blocked entries must expose the next action without creating a confirmed receipt.
- Empty, loading, error, and unavailable receipt states must be explicit.

## Card Payment UX Requirements

- User-facing payment method language must focus on debit and credit card.
- Current mock UX must use `Tarjeta demo` when referring to the mock payment method.
- Do not show SPEI, CoDi, OXXO/store payment, cash-in, cash, bank transfer, wallet balance, or stored balance as payment options.
- Mock add-card copy must say `No ingreses datos reales de tarjeta`.
- Mock add-card copy must say `Tarjeta demo no genera cargos reales`.
- Confirmation must show selected card, demo last four digits when available, fee, final total, and change-card action.
- Future real card UX must cover declined, expired, invalid CVV, processor timeout, and auth/3DS challenge states.

## Card Sandbox UX Requirements

- Keep `Tarjeta demo` until a real provider tokenization path is approved.
- Mock UX must not ask for real PAN, CVV, or card credentials.
- Future add-card UX must enter provider tokenized UI/SDK or equivalent approved secure flow.
- `ConfirmPayment` must show the selected card and amount breakdown.
- Declined card UX must state next action without raw processor jargon.
- Expired card UX must recommend another card.
- Invalid CVV messaging is future processor-driven and must stay user-safe.
- 3DS/auth challenge remains future.
- Do not make false security, PCI, or provider claims.
- Use `No se realizo cargo` copy when the mapped state proves no charge was made.

## Prontipagos Service Payment UX Requirements

- Mobile copy must describe service-payment status without technical Prontipagos jargon.
- Pending provider confirmation must say the payment is being verified, not paid.
- Invalid reference UX must ask the user to correct or revalidate the reference.
- Amount mismatch UX must require a fresh confirmation before another attempt.
- Receipt unavailable UX must not imply provider confirmation.
- Unknown or pending provider status must warn `No intentes pagar de nuevo` until a safe next action exists.

## Phase 9 Receipt Proof And Notification UX

- Treat receipt detail as proof with status, not as a fiscal claim.
- Status badges must keep payment, provider/service, and receipt certainty distinct.
- Proof detail keeps fee breakdown, safe card label, issued time, masked service reference, and safe support references visible.
- Mock/sandbox disclaimer must be visible on proof surfaces and shared text.
- Sharing/copy UX must exclude sensitive data and avoid legal/fiscal wording.
- In-app notifications must distinguish confirmed, pending, timeout, failed, generated receipt, pending receipt, and unavailable receipt states.
- Pending and unavailable proof surfaces must lead with next action and must not use provider-paid language.
- Demo-card success must keep the receipt CTA reachable on compact screens; success copy should say the proof is mock/dev before the user opens detail.

## CRM Admin UI Patterns

- CRM Admin is a separate web operations tool, not a marketing surface and not part of the mobile payment UX.
- Prefer compact tables, detail rows, safe reference blocks, restrained stat cards, explicit filters, and status badges.
- Sidebar/topbar navigation follows permission-aware rendering; hidden navigation does not imply frontend authorization.
- Support views stay limited and evidence-first.
- `AUDITOR` surfaces remain read-only.
- Card and Prontipagos reconciliation screens must visibly say placeholder/not implemented until real provider reconciliation exists.
- Redacted values should look intentionally limited and never invite PAN/CVV/token/secret input.
- Every page needs loading, empty, error, and permission-denied behavior.

## WhatsApp Receipt Channel UX

Future WhatsApp UX must be opt-in, explicit, and revocable.

- Onboarding consent screen is future and must not pre-enable WhatsApp.
- Notification preferences must separate receipt, failed payment, due reminder, monthly summary, and OTP categories.
- Receipt opt-in language should say WhatsApp is an optional delivery channel, not the only proof.
- Use clear copy such as: "Enviar comprobantes por WhatsApp" and "Puedes desactivarlo cuando quieras".
- Avoid dark patterns, bundled consent, or hidden revocation.
- The in-app receipt remains the authoritative proof surface.
- WhatsApp receipt copy must avoid fiscal/legal claims unless a future approved fiscal product exists.
- If delivery fails, UI should say the receipt is still available in the app and avoid raw provider errors.

## Public Landing Page UX

- The public landing is a commercial front door, not a transactional surface.
- Use the delivered FondixPay design system ZIP as the visual source for web marketing.
- Keep the landing separate from mobile app flows and CRM/Admin operations.
- Public CTAs must point to launch, interest, or future download placeholders until official app store URLs exist.
- Avoid "Paga ahora", login, account, balance, receipt, CRM, admin, or transaction CTAs.
- State clearly when the platform is preparing launch and payments are not yet live.
- The approved public coverage file may be shown as official landing coverage once it is sourced from `FONDIXPAY_Cobertura_Por_Estado.xlsx` and product confirms Prontipagos consultation.
- Public coverage UI may show state, service name, area, and coverage type only.
- Public coverage UI must not show internal utility, margin, provider payloads, payment status, user data, PAN/CVV, tokens, or secrets.
- Confirmed landing coverage must still avoid implying that payments are live before controlled launch.
- Do not imply official WhatsApp support or receipt delivery until runtime and consent are implemented.
- Do not use unsupported claims such as "fintech regulada", "100% seguro", "PCI compliant", or "tokenización segura".
## Coverage-Aware Service Catalog UX

### Mobile

- Mobile should show only services with `payable_in_mobile=true` for MVP.
- Unavailable, unknown, provider-pending, maintenance, and deprecated services must not reach `ConfirmPayment`.
- If a future product decision allows `coming_soon`, the CTA must be disabled and clear.
- User-facing copy should be plain:
  - `Servicio no disponible por ahora`
  - `Estamos preparando este servicio`
  - `No podemos validar esta referencia todavia`
- Do not expose provider jargon, Prontipagos codes, raw errors, or operational states to the user.
- Empty states should help users understand that more services will be enabled as coverage is confirmed.

### Landing / Public Coverage

- The coverage map can show reference/commercial coverage.
- The map must not imply that every listed service is currently payable.
- Use disclaimers such as:
  - `Cobertura referencial sujeta a disponibilidad del proveedor.`
  - `Servicios disponibles para pago se habilitaran conforme a validacion operativa.`
- Do not show direct `Paga ahora` CTAs for services that are not production-enabled.

### CRM/Admin

- Admin can see all statuses, including `provider_pending`, `unknown`, and `temporarily_disabled`.
- Support-facing views should provide safe explanation language.
- Admin/finance views can show provider mapping only according to RBAC.
- Coverage changes must be visible with audit history.
