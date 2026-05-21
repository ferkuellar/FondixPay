# Sprint 008C Requirements

## Goal

Implement the first controlled sandbox payment orchestration slice with separate card-processor and Prontipagos adapters.

## Required Outcomes

- Use contractual mocks because official provider docs and credentials are not present.
- Keep card processor and Prontipagos adapters separate.
- Gate Prontipagos execution on successful sandbox card charge state.
- Reuse ledger/audit/idempotency foundations.
- Map card and Prontipagos failure, pending, timeout, and duplicate scenarios.
- Preserve no PAN/CVV, fee breakdown, receipt gating, and production blockers.

## Out Of Scope

- Production or live sandbox provider calls.
- Real card forms, PAN/CVV handling, 3DS, refunds, voids, chargebacks, or full reconciliation.
- Mobile redesign or admin manual-review UI.

