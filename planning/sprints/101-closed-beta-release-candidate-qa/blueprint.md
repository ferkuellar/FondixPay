# Sprint 101 — Blueprint

## QA Execution Plan

### Test Environments
- Backend: staging (`APP_ENV=staging`, `TEKAE_ENABLED=true` with sandbox credentials)
- Mobile: EAS preview build pointing at staging API
- Admin: CRM admin pointing at staging API

### Beta User Onboarding
1. Invite testers (share TestFlight link or APK)
2. Provide: staging support email, known-working service for their state, instructions not to use real payment data
3. Collect feedback via form or Slack channel

### End-to-End QA Script (run for each tester)
```
1. Fresh install (no prior app data)
2. Open app → Onboarding screen visible
3. Enter test phone number → OTP sent via Twilio
4. Enter OTP → authenticated, name shown in HomeScreen
5. Select state (if not auto-detected via GPS)
6. Tap a service → ServiceDetailScreen
7. Tap "Pagar con Tekae (sandbox)" → TekaeSessionScreen opens
8. Tekae portal opens in browser → complete sandbox payment
9. Return to app → confirmation detected, receipt shown
10. Check HistoryScreen → payment in list
11. Check receipt detail
12. Sign out → sign in again → history preserved
13. CRM: admin confirms payment visible in PaymentsView
```

## Load Test Script (k6 or locust)

```python
# locust — OTP load test
class FondixUser(HttpUser):
    @task
    def request_otp(self):
        self.client.post("/api/auth/request-code", json={"phone": "+521234567890"})
```

```bash
locust -f locustfile.py --host https://staging.fondixpay.com --users 50 --spawn-rate 10 -t 60s --headless
```

## Bug Triage Matrix

| Severity | Definition | Required Action |
|----------|------------|-----------------|
| SEV-1 | Crash, data loss, auth bypass, payment data exposure | Fix in Sprint 101 before Go/No-Go |
| SEV-2 | Broken user flow, wrong data displayed, UX blocker | Fix in Sprint 101 before Go/No-Go |
| SEV-3 | Cosmetic, minor UX, typo | Log for post-launch sprint |

## Go/No-Go Checklist

Before starting Sprint 102, confirm in writing (slack/email/doc):

- [ ] Product owner: "I approve the release candidate as-is for production"
- [ ] Security reviewer: "All SEV-1/SEV-2 security items are closed"
- [ ] Legal: "Legal pages are live and approved at fondixpay.com"

All three must be obtained with names and dates recorded.
