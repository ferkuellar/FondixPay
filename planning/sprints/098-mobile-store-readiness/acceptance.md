# Sprint 098 — Acceptance Criteria

## Version

- [ ] `mobile/app.json` version is `"1.0.0"`
- [ ] `mobile/app.json` versionCode is `2`
- [ ] `mobile/app.json` buildNumber is `"2"`

## Demo Language Removal

- [ ] Zero user-visible strings contain "simulado", "demo", "mock", "sandbox", "ficticio"
- [ ] QA scenario picker is hidden in production builds (gated by `EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS`)
- [ ] No dev-only UI elements visible in production EAS build

## Builds

- [ ] Android production build completes: `eas build --platform android --profile production` succeeds
- [ ] iOS production build completes: `eas build --platform ios --profile production` succeeds
- [ ] Both build IDs documented in sprint completion notes

## Store Metadata

- [ ] App Store Connect listing created with Spanish description, keywords, category (Finance), age rating
- [ ] Privacy policy URL set to `https://fondixpay.com/privacidad` in App Store Connect
- [ ] Google Play Console listing created with Spanish description, feature graphic, category (Finance), content rating
- [ ] Privacy policy URL set to `https://fondixpay.com/privacidad` in Google Play Console

## Submission

- [ ] Android submitted to Google Play (minimum: internal testing track)
- [ ] iOS submitted for App Store review OR TestFlight internal track
- [ ] Submission IDs / track status documented

## OTA Updates

- [ ] `expo-updates` production channel configured
- [ ] Rollback command documented in `mobile/README.md` or sprint notes

## General

- [ ] App points to production API URL in production build
- [ ] Mobile TypeScript: 0 errors after any string changes
