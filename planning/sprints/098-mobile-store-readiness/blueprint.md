# Sprint 098 — Blueprint

## Code Changes

### mobile/app.json
```json
{
  "version": "1.0.0",
  "ios": {
    "buildNumber": "2",
    ...
  },
  "android": {
    "versionCode": 2,
    ...
  }
}
```

### Mobile string audit
```bash
# Find demo/mock language in user-visible strings
grep -r "simulado\|demo\|mock\|sandbox\|ficticio\|prueba" mobile/src/ --include="*.tsx" --include="*.ts"
```
Each match: determine if it's behind an env flag (safe) or user-visible in production (fix required).

## EAS Commands

```bash
# Production Android build
eas build --platform android --profile production

# Production iOS build  
eas build --platform ios --profile production

# Submit Android (after build)
eas submit --platform android --profile production

# Submit iOS (after build)
eas submit --platform ios --profile production

# OTA update (post-release patches)
eas update --branch production --message "Patch 1.0.1"

# Rollback OTA
eas update --branch production --message "rollback to 1.0.0"
```

## App Store Assets Required

| Asset | Format | Notes |
|-------|--------|-------|
| App icon | 1024x1024 PNG, no alpha | Already in app.json via `adaptive-icon` |
| Screenshot 6.7" | 1290x2796 PNG | iPhone 15 Pro Max |
| Screenshot 6.1" | 1179x2556 PNG | iPhone 15 |
| App preview video | Optional | 15–30s |

## Google Play Assets Required

| Asset | Format | Notes |
|-------|--------|-------|
| Feature graphic | 1024x500 PNG/JPG | Required |
| Phone screenshot | 1080x1920 min | Minimum 2 required |
| High-res icon | 512x512 PNG | Already exists |

## Privacy Policy and Terms URLs for Store Listings

- Privacy: `https://fondixpay.com/privacidad`
- Terms: `https://fondixpay.com/terminos`
- Support: `https://fondixpay.com/soporte`

## Production Mobile Build .env

```
EXPO_PUBLIC_API_URL=https://api.fondixpay.com
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS=
EXPO_PUBLIC_TEKAE_ENABLED=
```
(Tekae enabled in mobile only after Sprint 102 production gate.)
