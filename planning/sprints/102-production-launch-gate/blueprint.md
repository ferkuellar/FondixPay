# Sprint 102 — Blueprint

## Production Deploy Sequence

Execute in this exact order — do not activate TEKAE before all prior steps pass.

```
Step 1: terraform apply (production)
Step 2: Set all secrets in AWS Secrets Manager
Step 3: Run backend tests (must all pass)
Step 4: Build production Docker image
Step 5: Push image to production ECR
Step 6: alembic upgrade head (production DB)
Step 7: Start production ECS service
Step 8: GET /health → must return {"status":"ok","db_reachable":true}
Step 9: Confirm Sentry receiving events
Step 10: Confirm uptime monitor green
Step 11: Tekae network path test (TEKAE_ENABLED=false first)
Step 12: Set TEKAE_ENABLED=true in Secrets Manager
Step 13: Restart ECS service to pick up new env var
Step 14: GET /health → must include {"tekae_enabled":true}
Step 15: Test Tekae session with production credentials
Step 16: EAS production build with production API URL + TEKAE_ENABLED=true
Step 17: Submit to stores
Step 18: Monitor 24 hours
```

## New Files

### infra/terraform/environments/production/main.tf
- Adapt from `staging/main.tf`; change all `fondixpay-staging-` prefixes to `fondixpay-prod-`
- Larger RDS instance class for production
- Multi-AZ RDS for durability (optional at launch)

### .github/workflows/deploy-production.yml
- Trigger: manual dispatch only (not auto on push)
- Requires: Sprint 101 acceptance criteria file checked in
- Same pattern as `deploy-staging.yml` but targets production resources

## Production AWS Secrets Manager Keys

```
/fondixpay/production/DATABASE_URL
/fondixpay/production/JWT_SECRET
/fondixpay/production/TEKAE_UID
/fondixpay/production/TEKAE_PASSWORD
/fondixpay/production/TEKAE_BEARER
/fondixpay/production/TEKAE_BASE_URL
/fondixpay/production/TEKAE_PORTAL_UID
/fondixpay/production/SENTRY_DSN
/fondixpay/production/TWILIO_ACCOUNT_SID
/fondixpay/production/TWILIO_AUTH_TOKEN
/fondixpay/production/TWILIO_PHONE_NUMBER
/fondixpay/production/CHATBOT_AI_API_KEY
```

## Rollback Commands

```bash
# Disable Tekae immediately
aws secretsmanager put-secret-value --secret-id /fondixpay/production/TEKAE_ENABLED --secret-string "false"
# Restart ECS service to pick up
aws ecs update-service --cluster fondixpay-prod --service fondixpay-backend-prod --force-new-deployment

# OTA mobile rollback
eas update --branch production --message "emergency rollback to previous version"
```

## Post-Launch Monitoring Schedule

| Time | Check |
|------|-------|
| +30 min | Error rate, Tekae success rate, p95 latency |
| +1 hour | Same + OTP rate limit breach count |
| +4 hours | Full health review; confirm no SEV-1 bugs |
| +12 hours | Review Sentry for new error patterns |
| +24 hours | Final launch stability sign-off |
