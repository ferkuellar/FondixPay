# Domain Model and Product Scope

## Problem

Users need a simple mobile way to pay domestic services in Mexico without navigating provider-specific flows.

## Objective

Open the app, see pending services, pay, and obtain a receipt.

FONDIXPAY permite a usuarios en Mexico acceder a capacidades de pago de servicios domesticos desde una app movil, integrando Tekae como proveedor aprobado.

FONDIXPAY no es una fintech, banco, wallet, procesador de tarjetas, adquirente, procesador SPEI, tokenizador ni core bancario. FONDIXPAY solo embebe capacidades de pago de Tekae y conserva la experiencia de usuario, autenticacion, soporte, notificaciones, historial y CRM.

Prontipagos queda removido permanentemente como proveedor futuro de FONDIXPAY. Sus documentos y codigo historico pueden permanecer como referencia, pero no deben guiar nuevas implementaciones.

No estan dentro del roadmap actual como metodo de pago del usuario:

- SPEI propio.
- CoDi propio.
- OXXO propio.
- Efectivo propio.
- Cash-in propio.
- Wallet balance.
- Transferencia bancaria propia.
- Card vault.
- Tokenizacion propia.
- Acquiring propio.
- Core bancario.

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
- Payment: user-facing payment flow mediated by Tekae evidence; FONDIXPAY must not infer success from launch alone.
- Receipt: proof generated after payment flow.
- History: user-facing record of previous payments.
- Notification: message associated with user or payment state.
- Demo account/balance: mock UX/testing capability only, not a real payment method, wallet, or ledger balance.
- Future audit log: immutable trace for sensitive actions and provider session evidence.
- Tekae session: backend-generated provider launch session used to open Tekae Business without exposing Tekae credentials to the frontend.

## Coverage-Aware Service Catalog

FONDIXPAY must show users only the services available for their selected state.

### Business Rule

- National services are available to all users.
- State/regional services are available only when coverage exists for the user's selected state.
- Services without coverage for the user's selected state are hidden in the mobile app.
- The user must be able to manually change their selected state.
- GPS may assist, but it is not mandatory and does not override manual selection.
- The mobile app must not contain hardcoded service coverage rules.

### User-facing behavior

If a service is unavailable in the user's selected state, it is not rendered in the service catalog.

### Support behavior

Support should be able to determine whether a missing service is unavailable because of state coverage rules.
