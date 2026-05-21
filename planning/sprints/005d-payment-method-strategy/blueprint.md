# Sprint 005D Card Payment Blueprint

## Strategy

- Current MVP uses explicit card demo only.
- Future real-money user payment method is debit/credit card through a selected card processor after tokenization/compliance review.
- Prontipagos remains the service-payment aggregator, separate from the future card processor.
- Tokenized card is valid only with approved provider vault and no raw card storage.

## Mobile Adjustment

- Replace hardcoded card copy with explicit card-demo labels.
- Keep flow working.
- Do not add real card form.

## Documentation

- `docs/PAYMENT_METHOD_STRATEGY.md`
- `planning/PAYMENT_METHOD_BACKLOG.md`
- Docs updates for UX, API, data, security, audit, validation, operations.

## Validation

- Run `npm run typecheck` because mobile labels changed.
- Backend validation is optional because no backend runtime code changed.
