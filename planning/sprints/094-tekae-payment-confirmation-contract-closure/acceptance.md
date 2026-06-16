# Sprint 094 — Acceptance Criteria

## Contract Documentation

- [ ] `docs/TEKAE_CONFIRMATION_CONTRACT.md` exists and covers:
  - Webhook or polling mechanism (one or both)
  - Payload or response schema with all fields documented
  - Signature/HMAC verification method (if webhook)
  - Terminal payment state enumeration
  - Receipt/comprobante retrieval method
  - Identifier linking Tekae event ↔ FONDIXPAY session_ref

## Open Questions

- [ ] `planning/TEKAE_OPEN_QUESTIONS.md` — Q-004 through Q-012 resolved or formally marked as "Tekae cannot provide"
- [ ] Q-CPC-001 through Q-CPC-004 answered and documented

## Design Artifacts

- [ ] Payment state machine documented (diagram or state table): at minimum `tekae_pending`, `tekae_confirmed`, `tekae_failed`, `tekae_timeout`
- [ ] DB schema additions designed: columns or table required for confirmation tracking
- [ ] User-visible copy for each payment state defined (Spanish)
- [ ] Fallback behavior documented for unknown/timeout state

## Decisions

- [ ] At minimum 2 new ADRs recorded in `planning/DECISIONS.md`:
  - Webhook vs. polling decision
  - Receipt trigger condition

## Sprint 095 Readiness

- [ ] Blueprint for Sprint 095 can be written without open questions
- [ ] No unresolved "ask Tekae" items remaining in the design
