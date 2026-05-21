# Sprint 008B Handoff Prompt

Continue with Phase 8C only after reviewing the Phase 8B design, Prontipagos backlog, open questions, and real Prontipagos sandbox documentation.

Implementation must preserve:

- Card processor and Prontipagos separation.
- No provider execution when card charge failed, pending, timeout, or unknown.
- Idempotency, safe provider-reference storage, redaction, audit, status recovery, and reconciliation.
- No real credentials in repo and no production enablement without security gates.

