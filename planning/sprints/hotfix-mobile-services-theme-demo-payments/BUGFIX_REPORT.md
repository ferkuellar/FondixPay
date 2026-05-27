# Hotfix Report - Mobile Services, Theme Toggle, and Demo Payments

Date: 2026-05-27

## Summary

This hotfix restores internal demo usability in the mobile app without enabling real payments, real Prontipagos execution, or production service availability.

## Reported Problems

1. Service list did not appear.
2. Fondix header appeared on Home.
3. Day/Night toggle did not appear.
4. Login showed unnecessary top header noise.
5. Demo payments could not be created smoothly.

## Root Cause

### Service List

Phase 10F correctly made `/service-catalog` conservative: seeded services are not payable until provider capability is confirmed. Mobile consumed only that payable endpoint and had no demo fallback, so the Add Service list rendered empty.

### Home Header

`AppNavigator` rendered a custom `HeaderLogo` as the stack header title for `Home`.

### Day/Night Toggle

`ThemeProvider` exposed `toggleMode`, but no screen rendered a control for it. Theme preference also was not persisted.

### Login Header

`PhoneLogin` used the default stack header title (`Entrar`), creating visual noise at the top of a screen that should be clean.

### Demo Payments

The local demo payment flow requires a selected payment method. The mock payment method store started empty, so users could reach Confirm Payment with the CTA disabled until manually adding a demo card.

## Files Modified

- `mobile/src/store/serviceCatalogStore.ts`
- `mobile/src/store/paymentMethodStore.ts`
- `mobile/src/screens/services/AddServiceScreen.tsx`
- `mobile/src/screens/payments/ConfirmPaymentScreen.tsx`
- `mobile/src/screens/profile/ProfileScreen.tsx`
- `mobile/src/theme/ThemeProvider.tsx`
- `mobile/src/navigation/AppNavigator.tsx`
- `planning/STATE.md`
- `docs/VALIDATION.md`
- `docs/UI_UX_GUIDELINES.md`

## Flow Before

- Add Service showed an empty catalog when backend returned no payable services.
- Home rendered a large Fondix header logo through stack navigation.
- Users had no visible way to toggle Day/Night.
- Login showed stack header chrome.
- Demo payment confirmation required a selected card but did not ensure a demo card existed.

## Flow After

- Add Service shows a clearly labeled mobile-only demo service list when the strict catalog is empty or unavailable.
- Demo services are marked with copy explaining they are not production availability.
- Home has no stack header logo.
- Login has no stack header chrome.
- Profile shows a Day/Night switch and persists the selected mode with Expo Secure Store.
- Confirm Payment ensures a `Tarjeta demo` exists for mock validation without collecting PAN/CVV or real card data.

## Validation

Executed:

```powershell
cd mobile
npm run typecheck
```

Result: passed.

Backend was not modified, so backend compile/pytest was not required for this hotfix.

## Security And Product Boundaries

- No real provider integration was added.
- No Prontipagos production or sandbox traffic was added.
- No real processor integration was added.
- No PAN, CVV, card token, provider secret, or raw provider payload is captured.
- Demo catalog does not override backend production payable rules.
- Commercial production remains blocked.

## Remaining Risks

- Runtime visual QA on device/emulator is still recommended.
- Demo fallback is mobile-local; it should be removed or feature-gated before any production pilot.
- Real payable catalog still requires confirmed provider capability and operational approval.
