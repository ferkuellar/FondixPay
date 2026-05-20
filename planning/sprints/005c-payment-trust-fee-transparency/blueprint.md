# Sprint 005C Blueprint

## Fee Model

- `FONDIX_FEE_MINOR=750`.
- Currency: `MXN`.
- `total_minor = amount_minor + fee_minor`.
- Backend uses integer minor units.
- Mobile local mock store uses the same fixed mock fee until it consumes backend payment responses directly.

## Backend

- Add `backend/app/modules/payments/fees.py`.
- Expose fee fields on `PaymentRead`.
- Expose receipt breakdown fields through derived properties.
- Emit `payment.fee_disclosed` and `payment.confirmed_with_total` during mock payment creation.

## Mobile

- Add `mobile/src/constants/paymentFees.ts`.
- Add `mobile/src/utils/money.ts`.
- Update payment summary, service detail, confirm, success, and receipt card.
- CTA uses final total.
- Replace generic "100% seguro" copy with concrete trust copy.

## Validation

- `python -m compileall app`
- `python -m pytest`
- `npm run typecheck`
