# Domain Model and Product Scope

## Problem

Users need a simple mobile way to pay domestic services in Mexico without navigating provider-specific flows.

## Objective

Open the app, see pending services, pay, and obtain a receipt.

FondixPay permite a usuarios en Mexico pagar servicios domesticos desde una app movil usando exclusivamente tarjeta de credito o debito como metodo de pago del usuario.

Prontipagos se usara como agregador para ejecutar el pago del servicio. El procesador/tokenizador de tarjeta sera un proveedor futuro separado hasta que exista decision contractual y tecnica aprobada.

No estan dentro del roadmap actual como metodo de pago del usuario:

- SPEI.
- CoDi.
- OXXO.
- Efectivo.
- Cash-in.
- Wallet balance.
- Transferencia bancaria.

## Users

- End user: registers services, reviews pending amounts, confirms payments, views receipts and history.
- Administrator: future role for user and catalog administration.
- Support: future role for case investigation with minimum necessary data.
- Finance/operations: future role for payment review, reconciliation, and receipts.
- Auditor/viewer: future read-only role for traceability.

## Current Flows

- Phone login.
- Development OTP verification.
- Add service.
- View service detail.
- Confirm mock payment.
- View receipt.
- View history.
- View profile.

## Current Services

- CFE.
- Telmex.
- Telcel.

## Terms

- Service provider: company or biller such as CFE, Telmex, or Telcel.
- User service: a user-owned service reference or account.
- Payment: attempt or confirmation of a service payment.
- Receipt: proof generated after payment flow.
- History: user-facing record of previous payments.
- Notification: message associated with user or payment state.
- Demo account/balance: mock UX/testing capability only, not a real payment method.
- Future ledger: accounting foundation before real money movement.
- Future audit log: immutable trace for sensitive and financial events.
