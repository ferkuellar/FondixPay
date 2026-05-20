# Handoff Prompt - Sprint 005B

Act as a Senior FinTech Backend Engineer and Software Quality Auditor.

Read first:

1. `AGENTS.md`
2. `planning/STATE.md`
3. `planning/DECISIONS.md`
4. `planning/RISKS.md`
5. `docs/LEDGER_AND_AUDIT_DESIGN.md`
6. `docs/PAYMENT_STATE_MACHINE.md`
7. `docs/AUDIT.md`
8. `docs/VALIDATION.md`
9. `planning/sprints/005b-ledger-audit-implementation/COMPLETION_REPORT.md`

Maintain these boundaries:

- Do not integrate Prontipagos or any real payment provider.
- Do not move real money.
- Do not change mobile UI.
- Do not store secrets or sensitive provider payloads.
- Keep mock payments clearly marked as mock/dev.

Next recommended phase:

Phase 5C - Payment Trust & Fee Transparency.

Reason: the backend now has basic traceability/idempotency, while UX/Product audit still blocks real payments because fees and total payable are not clearly disclosed before confirmation.
