# Sprint 008b-tekae-integration-discovery — Handoff Prompt

**Sprint:** 008b-tekae-integration-discovery
**Status:** ACTIVE — Discovery only. No implementation.
**Last updated:** 2026-06-02

---

## Context for the Next Engineer / AI Session

You are picking up the Tekae integration discovery sprint for FONDIXPAY.

### What happened before this sprint

FONDIXPAY previously integrated with Prontipagos as its transactional provider. That work is complete and preserved in:
- `planning/sprints/008b-prontipagos-sandbox-integration-design/` (COMPLETED)
- `backend/app/modules/providers/prontipagos/` (sandbox adapter, frozen, do not extend)

The business decision was made to replace Prontipagos with **Tekae Business** as the MVP transactional provider. See `planning/TEKAE_DECISIONS.md`, DEC-T001.

### What this sprint is

A **documentation and discovery sprint only**. No code may be written. No production behavior may be changed. No Tekae behavior may be invented.

### What is blocking implementation

Official Tekae API documentation has not yet been reviewed. All 14 open questions in `planning/TEKAE_OPEN_QUESTIONS.md` are unanswered. The integration architecture is unconfirmed.

### Your job this sprint

1. Obtain official Tekae Business API documentation.
2. Answer the open questions in `planning/TEKAE_OPEN_QUESTIONS.md`.
3. Populate `docs/integrations/TEKAE_API_CONTRACT.md` with confirmed, sourced content.
4. Update the security review in `docs/integrations/TEKAE_SECURITY.md`.
5. Update `planning/TEKAE_DECISIONS.md` with decisions unblocked by documentation.
6. Update `planning/TEKAE_RISKS.md` with resolved and new risks.
7. Produce an implementation sprint proposal.

### What you must NOT do

- Do not write production code.
- Do not add dependencies.
- Do not modify the payment orchestrator or any payment runtime file.
- Do not invent Tekae endpoints, status codes, payloads, or webhooks.
- Do not delete Prontipagos files.
- Do not start the implementation sprint before this sprint's acceptance criteria are met.

### Key files to read first

1. `planning/TEKAE_HARNESS.md` — harness overview
2. `planning/TEKAE_OPEN_QUESTIONS.md` — 14 open questions
3. `planning/TEKAE_RISKS.md` — active risks
4. `planning/TEKAE_DECISIONS.md` — decision log
5. `docs/integrations/TEKAE.md` — provider overview
6. `planning/sprints/008b-tekae-integration-discovery/requirements.md` — sprint scope
7. `planning/sprints/008b-tekae-integration-discovery/blueprint.md` — step-by-step approach
8. `planning/sprints/008b-tekae-integration-discovery/acceptance.md` — done criteria

### FONDIXPAY's role (do not exceed this)

- Mobile app bridge
- UX and brand layer
- Support and CRM layer
- Minimal traceability (Tekae transaction IDs only — no card data)

FONDIXPAY is **not** a payment processor. Tekae is.

### Hard rules that cannot be overridden without explicit product leadership approval

- No payment processor logic.
- No wallet or balance ledger tied to real money.
- No card data storage.
- No Tekae production secrets in the mobile app.
