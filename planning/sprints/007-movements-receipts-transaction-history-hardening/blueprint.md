# Phase 7 Blueprint

## Runtime Shape
- Keep backend payment and receipt persistence unchanged for this phase.
- Use the existing mobile payment store as the mock transaction-history projection.
- Record failed, pending, timeout, and duplicate-blocked recovery attempts alongside succeeded payments.
- Expose explicit `PaymentDisplayStatus` and `ReceiptStatus` in mobile types.

## Mobile Surfaces
- `HistoryScreen` uses explicit filters and transaction cards.
- `ReceiptDetailScreen` shows breakdown, status, method, safe mock references, and disclaimer.
- `PaymentSuccess` links directly to receipt detail.
- Failed/pending recovery screens link back to history.

## Follow-Up Boundary
Backend history projections must later merge persisted payments, receipts, movements, audit identifiers, and provider confirmation facts.
