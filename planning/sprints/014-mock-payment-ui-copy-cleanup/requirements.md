# Sprint 014 — Mock Payment UI Copy Cleanup: Requirements

## Goal

Audit and standardize all mock/dev payment UI copy across the mobile app to ensure no screen presents demo content as if it were real. Establish consistent "DEMO" and "DEV" labeling patterns.

## Context

Sprint 013 aligned environment docs and cleaned up copy in a handful of screens. Sprint 014 extends that cleanup to the full breadth of payment-related components, screens, and stores — a comprehensive sweep rather than targeted fixes.

## Scope

- Audit all mobile payment components: AmountDisplay, HistoryFilterTabs, PaymentMethodDemoNotice, PaymentMethodEmptyState, PaymentRecoverySummary, PaymentSummaryCard, ProofReferenceBlock, ReceiptCard, ReceiptDetailCard, ReceiptProofCard, ReceiptStatusBadge, ServiceCard, TransactionHistoryCard.
- Audit all payment screens: AddPaymentMethodMockScreen, ConfirmPaymentScreen, PaymentFailedScreen, PaymentMethodsScreen, PaymentPendingScreen, PaymentSuccessScreen, ReceiptDetailScreen.
- Audit related stores: paymentMethodStore, paymentStore, serviceCatalogStore, serviceStore.
- Audit integrations/tekae/constants.ts.
- Update paymentFees.ts constants copy if needed.
- Add MOCK_PAYMENT_COPY_REVIEW.md in docs/ summarizing findings.
- Update planning/STATE.md and planning/RISKS.md.

## Out of Scope

- No payment logic changes.
- No backend, provider, or infrastructure changes.
- No Tekae integration changes.

## Acceptance Criteria

- No payment screen presents mock data as real to users without a visible dev/demo indicator.
- MOCK_PAYMENT_COPY_REVIEW.md documents every screen reviewed and the outcome.
