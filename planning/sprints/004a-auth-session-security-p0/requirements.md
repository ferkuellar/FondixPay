# Sprint 004A - Auth & Session Security P0 Requirements

## Goal

Harden the existing auth/session baseline without changing product flow, adding real OTP providers, or enabling real payments.

## In Scope

- Gate development OTP response by environment.
- Reject weak JWT secrets in staging/production.
- Validate critical security settings at backend startup.
- Keep local development login working with OTP `123456`.
- Make mobile tolerant of missing `otp_dev`.
- Add minimum auth/config tests.
- Update AXON-AI docs for auth/session security.

## Out of Scope

- Real SMS/OTP provider.
- Refresh token implementation.
- Server-side session inventory and revocation.
- RBAC implementation.
- Audit log persistence.
- Payment, wallet, KYC, or ledger implementation.
- Mobile navigation or UI redesign.

## Acceptance Inputs

- `docs/TECHNICAL_HARDENING_AUDIT.md`
- `docs/SECURITY.md`
- `docs/API.md`
- `docs/AUDIT.md`
- Existing backend auth module.
- Existing mobile auth store/services.
