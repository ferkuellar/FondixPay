# Sprint 005C Completion Report

Updated: 2026-05-20

## Summary

Phase 5C implements payment fee transparency for the mock/dev FondixPay flow. The user now sees service amount, FondixPay fee, and final total before confirmation, in the CTA, on success, and on receipt/history surfaces. Backend exposes fee fields and tests verify fee calculation.

## Backend Changes

- Added fixed mock fee setting `FONDIX_FEE_MINOR=750`.
- Added `backend/app/modules/payments/fees.py`.
- Added derived payment fields: `amount_minor`, `fee_minor`, `total_minor`, `currency`, `fee_label`, `fee_description`, `is_mock`.
- Added receipt breakdown fields via payment-derived properties.
- Payment intent now stores fee and total minor units.
- Added audit events `payment.fee_disclosed` and `payment.confirmed_with_total`.

## Mobile Changes

- Added mock fee constants and money helpers.
- Updated payment detail to show breakdown and final total.
- Updated confirmation card and CTA to show final total.
- Updated success screen with breakdown.
- Updated receipt/history card with service amount, fee, and total.
- Removed unsupported "Pago 100% seguro" copy from payment detail and replaced it with specific confirmation copy.

## Documentation Changes

- Updated state, ADRs, risks, UX backlog, API, data model, audit, validation, security, operations, and UI/UX guidelines.

## Fee Model

- Fixed mock/dev fee: 750 minor units = $7.50 MXN.
- Total: `service_amount_minor + fee_minor`.
- This is not an approved production commercial model.

## Validation

- `cd backend && python -m compileall app`: passed.
- `cd backend && python -m pytest`: passed, 33 tests.
- `cd mobile && npm run typecheck`: passed.

## Critical Status

The critical "fee not visible before payment confirmation" is implemented for mock/dev MVP. Production still requires approved fee model, legal copy review, and user validation.

## Remaining Risks

- Mobile local mock fee must be replaced by backend-sourced fee when the app consumes the API payment flow.
- Payment method strategy is still missing.
- Payment recovery path is still missing.
- Real provider confirmation and reconciliation remain pending.

## Next Recommended Phase

Phase 5D - Payment Method Strategy.
