# Sprint 017 — Receipt Demo Label Polish: Requirements

## Goal

Polish the demo labels in ReceiptProofCard to ensure the receipt reference block clearly communicates its mock/dev status without cluttering the UI.

## Context

Visual QA (Sprints 016/016B) surfaced that the receipt proof card's demo labeling could be clearer. Sprint 017 addresses the specific copy and label treatment in ReceiptProofCard.

## Scope

- Update ReceiptProofCard.tsx demo label copy and/or visual treatment.
- Update docs/MOBILE_DEVICE_VISUAL_QA_EVIDENCE.md and docs/MOBILE_MOCK_COPY_QA_REVIEW.md to reflect final state.
- Update planning/QUESTIONS.md and planning/RISKS.md.

## Out of Scope

- No other components, screens, stores, or backend changes.
- No payment logic or financial rule changes.

## Acceptance Criteria

- ReceiptProofCard demo label is clear and visually consistent with other mock/dev indicators.
- `npm run typecheck` passes with 0 errors.
