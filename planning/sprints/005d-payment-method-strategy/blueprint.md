# Sprint 005D Blueprint

## Strategy

- Current MVP uses explicit mock payment method only.
- Future real-money method must be selected after user research, provider selection, tokenization/compliance review, and reconciliation design.
- SPEI/OXXO-like options should be evaluated because FondixPay may serve non-banked or partially banked users.
- Tokenized card is valid only with approved provider vault and no raw card storage.

## Mobile Adjustment

- Replace hardcoded card copy with explicit mock/dev method labels.
- Keep flow working.
- Do not add real card form.

## Documentation

- `docs/PAYMENT_METHOD_STRATEGY.md`
- `planning/PAYMENT_METHOD_BACKLOG.md`
- Docs updates for UX, API, data, security, audit, validation, operations.

## Validation

- Run `npm run typecheck` because mobile labels changed.
- Backend validation is optional because no backend runtime code changed.
