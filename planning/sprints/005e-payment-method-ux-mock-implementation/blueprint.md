# Phase 5E Blueprint

## Architecture
- Mobile owns a temporary local mock payment method store.
- Backend remains unchanged because no real payment method is implemented.
- ConfirmPayment reads selected method from store and blocks payment until one exists.
- ServiceDetail, PaymentSuccess, and ReceiptCard display mock method status without implying a real card.

## Mobile Files
- `mobile/src/store/paymentMethodStore.ts`
- `mobile/src/components/PaymentMethodCard.tsx`
- `mobile/src/components/PaymentMethodEmptyState.tsx`
- `mobile/src/components/PaymentMethodDemoNotice.tsx`
- `mobile/src/screens/payments/PaymentMethodsScreen.tsx`
- `mobile/src/screens/payments/AddPaymentMethodMockScreen.tsx`

## Rules
- No PAN, CVV, CLABE, provider token, or real payment credential is requested.
- Mock methods are memory-only for this phase.
- Every visible payment method must come from explicit local state.
