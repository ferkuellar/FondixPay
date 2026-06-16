# Sprint 098 — Builder Handoff Prompt

You are implementing Sprint 098: Mobile Store Readiness for FONDIXPAY.

## Context

FONDIXPAY is an Expo 56/React Native app (`com.fondixpay.app`, EAS project ID `b1e6ae3f-847a-438d-8f3b-cfc044fa1972`). Current version is 0.1.0, versionCode 1. The Apple ID for submission is `fercuellar@gmail.com` (per `mobile/eas.json`). This sprint produces the production build and store submissions.

**Sprint 097 must be complete** — legal pages must be live at `fondixpay.com` before store submission (stores require a working privacy policy URL).

## What To Build

1. **Version bump** in `mobile/app.json`: version `"1.0.0"`, versionCode `2`, buildNumber `"2"`.

2. **Demo language audit**: grep mobile/src/ for "simulado", "demo", "mock", "sandbox", "ficticio". Each match in a user-visible string must be removed or gated behind `EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS`.

3. **EAS production builds**:
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```

4. **Store metadata** (document in sprint completion notes; do not commit to repo):
   - Spanish short/full description for both stores
   - Category: Finance; Age rating: 4+ / Everyone
   - Privacy URL: `https://fondixpay.com/privacidad`
   - Support URL: `https://fondixpay.com/soporte`

5. **Submit**:
   ```bash
   eas submit --platform android --profile production
   eas submit --platform ios --profile production
   ```

6. **Document OTA rollback** in `mobile/README.md`.

## Files to Read First

- `mobile/app.json` — current version fields
- `mobile/eas.json` — build profiles and submit config
- `mobile/src/` — grep for demo/mock strings
- `mobile/src/config/environment.ts` — `isDemoPaymentEnabled`, `isQaScenariosEnabled`

## Constraints

- Production build must point to production API URL
- `EXPO_PUBLIC_TEKAE_ENABLED` must be empty (not `true`) in production EAS build
- `EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS` must be empty in production EAS build
- Do not commit `.env` files with production values
- TypeScript must pass: `cd mobile && npx tsc --noEmit`

## Output

Report: version fields updated, demo strings found/fixed count, build IDs from EAS, store submission status (submitted / in review / approved), and OTA rollback command documented.
