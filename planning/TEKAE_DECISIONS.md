# Tekae Integration — Decision Log

**Last updated:** 2026-06-02

---

## Decision Format

Each decision records: what was decided, why, who decided, when, and any consequences or constraints it imposes.

---

## DEC-T001 — Replace Prontipagos with Tekae Business as Primary Transactional Provider

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Status | CONFIRMED |
| Decided by | Product / Business leadership |
| Supersedes | DEC-001 through DEC-00N in `planning/DECISIONS.md` (Prontipagos selection) |

**Decision:** Tekae Business replaces Prontipagos as the primary transactional provider for FONDIXPAY MVP.

**Rationale:** Business and commercial reasons (not documented here — captured in business context). Prontipagos will no longer be used in production.

**Constraints imposed:**
- All new payment provider work targets Tekae.
- Prontipagos implementation is preserved but frozen — no new development.
- Tekae integration cannot begin until official documentation is reviewed.
- FONDIXPAY must not build a payment processor to compensate for Tekae unknowns.

**Historical note:** Prontipagos work (sprints 008b, 008c, and the provider module) remains in the codebase as historical record. Do not delete.

---

## DEC-T002 — Integration Architecture Deferred Pending Documentation

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Status | CONFIRMED |
| Decided by | Engineering lead |

**Decision:** The integration architecture (mobile-direct vs. backend-proxied) is explicitly deferred and not assumed until Tekae official documentation is reviewed.

**Rationale:** Building against assumed architecture risks rework, incorrect PCI scope decisions, and security model mismatch.

**Constraints imposed:**
- No architectural diagrams or code may be finalized until documentation confirms the integration method.
- Open question Q-001 in `planning/TEKAE_OPEN_QUESTIONS.md` must be answered first.

---

## DEC-T003 — FONDIXPAY Will Not Build a Payment Processor for MVP

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Status | CONFIRMED |
| Decided by | Product / Engineering leadership |

**Decision:** FONDIXPAY will not build payment processing, wallet, ledger, or bill payment aggregation logic for MVP. Tekae is the transactional layer.

**Rationale:** Scope control, time to market, regulatory risk reduction.

**Constraints imposed:**
- Any sprint requesting payment processor features must go through explicit product approval before engineering begins.

---

## Pending Decisions

| ID | Question | Blocked On |
|---|---|---|
| DEC-T004 | Integration method (mobile SDK, redirect, backend proxy) | Tekae documentation |
| DEC-T005 | PCI scope for FONDIXPAY under Tekae model | Tekae PCI documentation |
| DEC-T006 | Sandbox strategy for development | Tekae sandbox availability |
| DEC-T007 | Refund / reversal capability | Tekae API documentation |
| DEC-T008 | Reconciliation data model | Tekae settlement report format |
