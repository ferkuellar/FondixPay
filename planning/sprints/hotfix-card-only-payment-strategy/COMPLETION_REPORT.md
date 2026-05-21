# Hotfix Completion Report - Card-Only Payment Strategy

## Summary
This hotfix corrects the payment-method source of truth. FondixPay is card-only for user-facing service payments in the current roadmap. Debit/credit card processing will require a future approved card processor and tokenization. Prontipagos remains the separate service-payment aggregator.

## Files Inspected
- README, planning state/decisions/domain/risks/questions/roadmap/backlogs.
- Payment method strategy and UX/security/API/data/audit/validation/operations docs.
- Sprint artifacts for 005D, 005E, 006A, and 006B.

## Multi-Method References Found
- SPEI/OXXO/CoDi evaluation language in payment strategy, ADR/risk/backlog, roadmap follow-up copy, and sprint 005D.
- Open questions asking whether SPEI or cash-in/cash-out were required.
- UX guidance warning against card-only UX despite the now-official card-only decision.

## Files Corrected
- Payment strategy, payment method backlog, README, domain, questions, roadmap, decisions, risks, UX backlog.
- UI/UX, security, API, data model, audit, validation, and operations docs.
- Sprint 005D and 005E artifacts.
- Mobile mock method labels/types so the runtime only offers card demo.

## Decisions Updated
- ADR-048 corrected to card-focused strategy.
- ADR-075 added for official card-only user payment model.

## Risks Updated
- Replaced alternative-method assumption risk with card-only adoption friction.
- Added SEV-1 PCI/card-only production blocker risk.

## Roadmap Corrected
- Phase 5D/5E wording is card-focused.
- Card processor selection is distinct from Prontipagos service-payment integration.
- Wallet/account/simulated balance remains demo/account-model scope, not a payment method.

## Sprints Corrected
- Sprint 005D now documents card payment strategy.
- Sprint 005E now documents card demo UX.

## Out Of Scope
- Real card processor integration.
- Prontipagos integration.
- Real payments or money movement.

## Final Payment Strategy
User pays with debit or credit card. FondixPay tokenizes/processes that card with a future approved card processor. FondixPay executes the service-payment leg through Prontipagos. No alternative user-facing payment method is in the current roadmap.

## Next Recommended Phase
Continue from the current post-Phase-7 route with Phase 8 simulated payment orchestration hardening while preserving the card-only strategy.

## Validation
- `cd mobile; npm run typecheck` passed after the card-demo runtime correction.
- Backend validation was not run because backend runtime was not changed.
