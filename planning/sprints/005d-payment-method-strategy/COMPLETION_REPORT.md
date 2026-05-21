# Sprint 005D Completion Report

Updated: 2026-05-20

## Executive Summary

Phase 5D formalizes FondixPay's card-only payment method strategy and removes the current phantom-card risk by relabeling the mobile UI method as an explicit card-demo method. No real provider, tokenization, card storage, Prontipagos, or real payment flow was added.

## Initial State

- Phase 5C completed fee transparency.
- Mobile still showed a hardcoded card-like label: `Tarjeta demo **** 9021`.
- No add/select/manage payment method flow existed.

## Gap Detected

The UI implied a selected card without a real creation, selection, validation, or tokenization path.

## MVP Recommendation

- Internal/dev: explicit card demo only.
- Future real-money beta: tokenized debit/credit card through an approved card processor.
- Prontipagos remains the service-payment aggregator and is not assumed to be the card processor.
- Wallet/stored balance remains out of scope as a user-facing payment method.

## Options Evaluated

- Card tokenization.
- Card demo/mock.
- Unsupported methods corrected to out of scope: SPEI, CoDi, OXXO/store payment, cash-in, cash, bank transfer, and wallet/stored balance.

## Decisions Added

- ADR-046 through ADR-050.

## Risks Added

- Phantom card UI.
- PCI risk without tokenization.
- Card-only trust and adoption friction.
- Sensitive logs.
- Method unavailable without fallback.
- Real payment confirmation without selected method.

## Backlog Created

- `planning/PAYMENT_METHOD_BACKLOG.md`.

## Mobile Changes

- `ServiceDetailScreen` now shows explicit card-demo copy with `MOCK` badge.
- `PaymentSummaryCard` default method is card demo copy for no-real-charge validation.
- `Nueva tarjeta` copy was replaced with a pending add-card path.

## Backend Changes

- No backend runtime changes.

## Production Status

Commercial production remains blocked. Real payments remain blocked.

## Next Recommended Phase

Phase 5E - Card Payment UX Mock Implementation.
