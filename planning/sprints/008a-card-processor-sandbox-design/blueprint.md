# Phase 8A Blueprint - Card Processor Sandbox Design

## Architecture

```text
User card leg:
Mobile -> processor tokenization -> FondixPay backend -> card processor sandbox adapter

Service payment leg:
FondixPay backend -> Prontipagos -> service provider
```

## Design Work

1. Define provider scorecard and keep provider selection open.
2. Prefer hosted or SDK tokenization.
3. Keep PAN/CVV outside FondixPay backend by default.
4. Define card states, errors, idempotency, audit, webhooks, and reconciliation.
5. Propose future APIs and data entities only.
6. Register risks, decisions, backlog, roadmap, state, and production blockers.

## Delivery Shape

- Main design in `docs/CARD_PROCESSOR_SANDBOX_DESIGN.md`.
- Evaluation matrix in `docs/CARD_PROCESSOR_EVALUATION_MATRIX.md`.
- Backlog in `planning/CARD_PROCESSOR_BACKLOG.md`.
- Supporting changes in existing AXON-AI docs.
