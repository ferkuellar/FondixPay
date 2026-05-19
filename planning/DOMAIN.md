# Domain Model and Product Scope

## Problem

Users need a simple mobile way to pay domestic services in Mexico without navigating provider-specific flows.

## Objective

Open the app, see pending services, pay, and obtain a receipt.

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
- Future wallet: optional stored-value capability, not approved yet.
- Future ledger: accounting foundation before real money movement.
- Future audit log: immutable trace for sensitive and financial events.
