# Sprint 8B.4 - Mobile Provider-State Readiness

## Goal

Prepare the mobile app for future Tekae provider states without implementing Tekae runtime behavior.

## Scope

- Add mobile-only provider readiness states.
- Add a callback route placeholder for future provider return flows.
- Gate mock/demo payment methods behind dev/internal mode only.
- Replace unavailable payment actions with user-safe informational states.
- Document that no Tekae API calls, endpoints, payloads, or transaction mappings exist yet.

## Non-Goals

- No Tekae API calls.
- No invented Tekae endpoints.
- No provider payload shapes.
- No payment runtime behavior changes in `paymentStore.ts`.
- No real payment enablement.
- No secrets or credentials.

## Files In Scope

- `mobile/src/integrations/providerReadiness.ts`
- `mobile/src/screens/payments/ConfirmPaymentScreen.tsx`
- `mobile/src/screens/payments/PaymentMethodsScreen.tsx`
- `mobile/src/screens/payments/AddPaymentMethodMockScreen.tsx`
- `mobile/src/screens/payments/PaymentFailedScreen.tsx`
- `mobile/src/screens/payments/ProviderCallbackScreen.tsx`
- `mobile/src/navigation/AppNavigator.tsx`
- `mobile/App.tsx`
- `mobile/src/types/index.ts`
- `docs/integrations/TEKAE.md`
- `planning/TEKAE_HARNESS.md`
- `planning/STATE.md`

