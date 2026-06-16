# Sprint 094 — Builder Handoff Prompt

You are implementing Sprint 094: Tekae Payment Confirmation Contract Closure for FONDIXPAY.

## Context

FONDIXPAY has a working Tekae SSO session endpoint (Sprint 086) and mobile browser launch (Sprint 087). After a user pays inside the Tekae portal browser, FONDIXPAY currently has no way to know if the payment succeeded. This sprint resolves that by documenting the payment confirmation contract from Tekae.

**This sprint produces no code.** It produces planning documents only.

## What To Do

1. Review all available Tekae documentation (`docs/TEKAE_INTEGRATION_READINESS.md`, `planning/TEKAE_OPEN_QUESTIONS.md`, `planning/sprints/011-tekae-contract-closure-runtime-readiness-design/`) to understand what is already known.

2. Identify which questions in Q-004 through Q-012 (in `planning/TEKAE_OPEN_QUESTIONS.md`) remain unresolved. These cover: payment methods, transaction states, webhooks, PCI, refunds, reconciliation, error codes, rate limits, idempotency.

3. Contact Tekae (or review any additional Tekae materials available) to resolve these questions. If this is a planning exercise and Tekae is not reachable, design the most likely answer for webhook-first with polling fallback and mark each answer as "Assumed — needs Tekae confirmation."

4. Create `docs/TEKAE_CONFIRMATION_CONTRACT.md` documenting:
   - Confirmation mechanism (webhook, polling, or both)
   - Payload schema and signature verification
   - Payment terminal states and their FONDIXPAY equivalents
   - Receipt generation trigger
   - Identifier linking Tekae event to FONDIXPAY `session_ref`

5. Update `planning/TEKAE_OPEN_QUESTIONS.md` to move resolved questions to a Resolved section.

6. Design payment state machine: `tekae_pending` → `tekae_confirmed` / `tekae_failed` / `tekae_timeout`.

7. Add new ADRs to `planning/DECISIONS.md` for the webhook/polling decision and receipt trigger.

## Files to Read First

- `planning/TEKAE_OPEN_QUESTIONS.md` — current open questions
- `docs/TEKAE_INTEGRATION_READINESS.md` — what is already confirmed
- `planning/sprints/011-tekae-contract-closure-runtime-readiness-design/` — Sprint 011 findings
- `planning/DECISIONS.md` — ADR-191 through ADR-194 (Tekae session decisions)
- `backend/app/modules/tekae/service.py` — current session creation (session_ref usage)

## Constraints

- No code changes in this sprint
- `TEKAE_ENABLED` remains false
- If Tekae cannot provide webhook, document polling design as primary path
- This sprint must produce enough detail that Sprint 095 can begin without open questions

## Output

Report: documents created, questions resolved, ADRs added, and whether Sprint 095 can proceed (yes/no, and if no, what is still blocking).
