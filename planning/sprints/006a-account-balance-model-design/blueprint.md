# Phase 6A Blueprint

## Architecture
- Product account defines ownership and status.
- Ledger accounts and ledger entries remain financial source of truth.
- Balance snapshot is a derived/cacheable projection.
- Movement is a UX projection tied to ledger/payment facts.
- Demo balance is isolated from any future real balance.

## Deliverables
- `docs/ACCOUNT_AND_BALANCE_MODEL.md`
- account/balance additions in data model, API, audit, validation, security, operations, and UI/UX docs
- ADR-060 through ADR-064
- `planning/ACCOUNT_BALANCE_BACKLOG.md`

## Builder Boundary
Do not implement real balance or wallet behavior from this blueprint. Phase 6B may implement simulated/demo balance only after preserving demo labels and user-scope tests.
