# Sprint 098 — Mobile Store Readiness

## Why This Sprint Exists

Blocks B-08 (SEV-2). FONDIXPAY has no distribution channel for end users. The Expo project is configured (`com.fondixpay.app`, EAS project ID `b1e6ae3f-847a-438d-8f3b-cfc044fa1972`) but no production build has been submitted to Google Play or App Store. This sprint produces that submission.

## Blockers Closed

- B-08: App not submitted to stores (SEV-2)

## Prerequisites

- Sprint 097 complete (legal pages live at fondixpay.com with real content — required for store listing)
- `https://fondixpay.com/privacidad` and `https://fondixpay.com/terminos` must be publicly reachable with no placeholders

## Scope

1. **Version bump:**
   - `mobile/app.json`: `version` → `"1.0.0"`, `versionCode` → `2`, `buildNumber` → `"2"`
   - This distinguishes the production build from internal builds

2. **Remove all demo/dev language from user-visible strings:**
   - Search all mobile screens for "simulado", "demo", "mock", "sandbox", "prueba", "ficticio"
   - Replace with appropriate production copy or remove the feature behind env flag
   - Store review will reject apps with test/demo language in production builds

3. **EAS production build:**
   - `eas build --platform android --profile production`
   - `eas build --platform ios --profile production`
   - Production builds use `autoIncrement` for version management (per existing `eas.json`)

4. **App Store metadata (iOS):**
   - Short description (30 chars max)
   - Full description (4000 chars max — Spanish)
   - Keywords (100 chars max, comma-separated)
   - Category: Finance
   - Age rating: 4+ (no adult content, no gambling)
   - Privacy policy URL: `https://fondixpay.com/privacidad`
   - Support URL: `https://fondixpay.com/soporte`
   - Apple ID: `fercuellar@gmail.com` (per `eas.json`)

5. **Google Play metadata:**
   - Short description (80 chars)
   - Full description (4000 chars — Spanish)
   - Feature graphic (1024x500 PNG)
   - Screenshots: phone (minimum 2), tablet optional
   - Content rating: E (Everyone) or equivalent
   - Privacy policy URL: `https://fondixpay.com/privacidad`
   - Category: Finance

6. **OTA update configuration:**
   - Ensure `expo-updates` is configured with production update URL
   - Document rollback procedure: `eas update --branch production --message "rollback"`

7. **Submission:**
   - Android: `eas submit --platform android --profile production` or manual APK/AAB upload
   - iOS: `eas submit --platform ios --profile production` (uses apple ID in eas.json)

## Out of Scope

- Paid app or in-app purchases
- Push notification setup (future sprint)
- Beta testing track management (Sprint 101)

## Constraint

App description and screenshots must not mention demo, mock, sandbox, or simulated payments. The app must function with the production API (`EXPO_PUBLIC_API_URL` pointing to production backend).
