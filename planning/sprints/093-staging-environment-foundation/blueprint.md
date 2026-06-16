# Sprint 093 — Blueprint

## Files to Create

### infra/terraform/environments/staging/main.tf
- Copy `dev/main.tf` as base; replace resource name prefixes `fondixpay-dev-` → `fondixpay-staging-`
- Separate VPC or shared VPC with distinct subnets (confirm with existing dev Terraform)
- RDS: `fondixpay-staging` DB instance
- ECS/EC2: separate task definition `fondixpay-backend-staging`

### infra/terraform/environments/staging/variables.tf
- `environment = "staging"`
- `app_env = "staging"`

### infra/terraform/environments/staging/outputs.tf
- `staging_backend_url`
- `staging_db_endpoint`

### .github/workflows/deploy-staging.yml
```yaml
name: Deploy Staging
on:
  push:
    branches: [main]
jobs:
  deploy:
    steps:
      - checkout
      - run backend tests (cd backend && pytest)
      - build Docker image
      - push to ECR
      - run alembic upgrade head (via ECS task or SSH)
      - update ECS service / restart server
      - smoke test: curl ${{ secrets.STAGING_URL }}/health
```

### backend/.env.staging.example
```
APP_ENV=staging
DEBUG=false
DATABASE_URL=postgresql://...staging-rds-endpoint.../fondixpay
JWT_SECRET=<strong-random-64-char>
CORS_ORIGINS=https://fondixpay-staging.example.com
TEKAE_ENABLED=false
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
CHATBOT_AI_API_KEY=
```

## Terraform Apply Sequence

1. `cd infra/terraform/environments/staging`
2. `terraform init`
3. `terraform plan`
4. `terraform apply`
5. Copy `staging_backend_url` and `staging_db_endpoint` to GitHub Secrets

## CI Secrets Required

- `AWS_ACCESS_KEY_ID_STAGING`
- `AWS_SECRET_ACCESS_KEY_STAGING`
- `STAGING_DB_URL`
- `STAGING_JWT_SECRET`
- `STAGING_URL` (for smoke test)
