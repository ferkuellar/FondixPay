# Phase 5E Card Payment Blueprint

## Architecture
- Mobile owns a temporary local card-demo payment method store.
- Backend remains unchanged because no real card payment method is implemented.
- ConfirmPayment reads selected card demo from store and blocks payment until one exists.
- ServiceDetail, PaymentSuccess, and ReceiptCard display card-demo status without implying a real card charge.

## Mobile Files
- `mobile/src/store/paymentMethodStore.ts`
- `mobile/src/components/PaymentMethodCard.tsx`
- `mobile/src/components/PaymentMethodEmptyState.tsx`
- `mobile/src/components/PaymentMethodDemoNotice.tsx`
- `mobile/src/screens/payments/PaymentMethodsScreen.tsx`
- `mobile/src/screens/payments/AddPaymentMethodMockScreen.tsx`

## Rules
- No PAN, CVV, CLABE, provider token, or real payment credential is requested.
- Card demo records are memory-only for this phase.
- Every visible card demo must come from explicit local state.
