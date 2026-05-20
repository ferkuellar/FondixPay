# Builder Handoff — Phase 5F Payment Recovery Paths

Read first:
1. `AGENTS.md`
2. `planning/STATE.md`
3. `planning/DECISIONS.md`
4. `planning/RISKS.md`
5. `docs/PAYMENT_RECOVERY_PATHS.md`
6. `docs/PAYMENT_STATE_MACHINE.md`
7. `docs/LEDGER_AND_AUDIT_DESIGN.md`
8. `docs/AUDIT.md`
9. `docs/VALIDATION.md`
10. `docs/SECURITY.md`

Do not implement provider-backed recovery until:
- provider status semantics are known,
- idempotency is enforced end to end,
- audit events are durable,
- support/RBAC model exists,
- reconciliation rules are accepted.

No real payments, Prontipagos, refunds, reversals, or irreversible financial logic are allowed from this handoff alone.
