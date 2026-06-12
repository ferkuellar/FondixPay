# Sprint 015 — Mobile Mock Copy Visual Regression Review: Requirements

## Goal

After the Sprint 014 mass copy cleanup, review the modified screens for visual regressions and confirm that the UI renders correctly with updated copy.

## Context

Sprint 014 touched 35 files. A visual regression pass is required to ensure no layout broke (e.g., label overflow, truncated text, misaligned elements) due to changed string lengths.

## Scope

- Review PaymentFailedScreen, PaymentSuccessScreen, ReceiptDetailScreen — the highest-risk screens from Sprint 014.
- Document findings in docs/MOBILE_MOCK_COPY_QA_REVIEW.md.
- Apply any copy or layout corrections found during review.
- Update planning/RISKS.md with any new risks surfaced.

## Out of Scope

- No new features, payment logic, backend changes, or provider changes.

## Acceptance Criteria

- QA review doc confirms all reviewed screens render without layout regressions.
- Any copy or minor layout corrections applied and committed.
