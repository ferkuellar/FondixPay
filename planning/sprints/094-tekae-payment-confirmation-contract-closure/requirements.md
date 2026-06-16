# Sprint 094 — Tekae Payment Confirmation Contract Closure

## Why This Sprint Exists

Blocks B-05 (SEV-2). The Tekae integration is wired end-to-end for session launch (Sprints 086–087), but payment confirmation is completely unknown. After a user completes a payment in the Tekae portal, FONDIXPAY has no mechanism to know whether the payment succeeded, failed, or timed out. This sprint resolves that by obtaining the confirmation contract from Tekae and designing the state machine.

This sprint is documentation and design only — no implementation code. The implementation is Sprint 095.

## Blockers Closed

- B-05: Tekae payment confirmation contract unknown (design phase)

## Scope

1. **Obtain from Tekae:** The builder must contact Tekae or review available Tekae documentation to resolve:
   - Q-CPC-001: Does Tekae provide a webhook callback? If yes, what is the payload schema?
   - Q-CPC-002: Is there a transaction query/status API FONDIXPAY can poll after session launch?
   - Q-CPC-003: Which evidence is sufficient to mark a payment confirmed and generate a receipt?
   - Q-CPC-004: Which transaction identifiers connect a Tekae event to a FONDIXPAY session_ref?

2. **Update `planning/TEKAE_OPEN_QUESTIONS.md`:** Move Q-004 through Q-012 to Resolved with confirmed answers. Mark any Tekae "cannot provide" questions explicitly.

3. **Document contract in `docs/TEKAE_CONFIRMATION_CONTRACT.md`:**
   - Webhook endpoint Tekae calls (if applicable): payload fields, signature verification, retry behavior
   - Or: polling API endpoint, request format, response format
   - Terminal payment states: confirmed, failed, canceled, timeout, unknown
   - Receipt/comprobante retrieval: which fields, which API call
   - Reconciliation mechanism

4. **Design payment state machine (no code):**
   - Draw out state transitions: `tekae_pending` → `tekae_confirmed` / `tekae_failed` / `tekae_timeout`
   - Map states to user-visible copy in Spanish
   - Document DB schema additions needed: what columns on `payments` table, what new `tekae_events` table

5. **Record ADRs** for: webhook vs. polling choice, payment state machine transitions, receipt trigger.

## Out of Scope

- Any backend code changes
- Any mobile code changes
- Tekae production credentials (those are Sprint 102)

## External Dependency (Critical Path)

This sprint is blocked on Tekae providing the webhook/confirmation specification. If Tekae cannot provide webhook support, this sprint must document the polling fallback design instead. Do not implement either path until this design sprint is complete.
