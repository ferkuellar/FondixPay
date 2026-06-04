# Environment Strategy

Status: Sprint 012 documentation snapshot. No credentials are configured here.

This document complements `docs/ENVIRONMENTS.md` and records the Sprint 012 environment strategy for future Tekae readiness.

## Principles

- Do not commit secrets.
- Do not commit `.env` files.
- Do not commit provider credentials, API keys, passwords, access tokens, private URLs, Terraform state, Terraform plans, or backend override files.
- Use placeholders in documentation and examples only.
- Keep local/dev/staging/production separated.
- Keep Tekae disabled until Sprint 011 contract readiness passes.
- Keep FONDIXPAY positioned as a platform/app embedding Tekae capabilities, not as a fintech.

## Environment Tiers

| Tier | Current status | Provider mode | Notes |
| --- | --- | --- | --- |
| local | Operational for development | Mock/dev only | Uses local `.env` and Docker PostgreSQL. Real provider credentials must not be used. |
| dev | Partially planned | Mock/dev; Tekae disabled | Terraform dev foundation exists. Live AWS plan/apply requires credentials, identity review, and approval. |
| staging | Not implemented | Blocked | No Terraform staging environment exists. Must not be inferred from dev. |
| production | Not implemented | Blocked | Requires future approved architecture, security review, and Tekae contract readiness. |

## Required Placeholder Categories

Backend placeholders:

- `DATABASE_URL`
- `APP_ENV`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `OTP_DEV_CODE`
- `OTP_DEV_RESPONSE_ENABLED`
- `CORS_ORIGINS`

Mobile placeholders:

- `EXPO_PUBLIC_API_URL`

Admin placeholders:

- `VITE_API_BASE_URL`

Tekae placeholders:

- `TEKAE_ENABLED`
- `TEKAE_MODE`
- `TEKAE_ENV`
- `TEKAE_API_BASE_URL`
- `TEKAE_CLIENT_ID`
- `TEKAE_CLIENT_SECRET`
- `TEKAE_WEBHOOK_SECRET`
- `TEKAE_TIMEOUT_SECONDS`

AWS/GitHub deployment placeholders:

- `AWS_REGION`
- `AWS_ROLE_TO_ASSUME`
- `TF_STATE_BUCKET`
- `TF_LOCK_TABLE`
- `TF_VAR_ARTIFACTS_BUCKET_NAME`
- `TF_VAR_BUDGET_ALERT_EMAILS`

These names are configuration placeholders only. Real values must be stored through the approved environment-specific secret store.

## Tekae Flags

Tekae must remain disabled:

```txt
TEKAE_ENABLED=false
TEKAE_MODE=disabled
```

`TEKAE_ENABLED=true` is prohibited until:

- Sprint 011 contract readiness passes.
- Product/security approval exists.
- Sandbox/API access is confirmed.
- Webhook or no-webhook status model is confirmed.
- Transaction status/query model is confirmed.
- Reconciliation model is confirmed.
- Provider references and receipt rules are confirmed.
- Production connectivity requirements are confirmed.

## Mock Mode Vs Provider Mode

Mock/dev mode:

- May use local fixtures, mock payment states, demo provider states, and placeholder receipts.
- Must remain labeled as mock/dev.
- Must not use real Tekae credentials.
- Must not be used to claim provider-confirmed payment success.

Provider mode:

- Is blocked.
- Must be backend-brokered.
- Must not expose credentials to frontend.
- Must not expose full Tekae tokens or full launch URLs in logs, support views, commits, or CRM views.

## Environment Secret Rules

Local:

- Local `.env` may exist on a developer workstation.
- Local `.env` must remain uncommitted.
- Local may use mock OTP and weak local-only secrets.

Dev:

- Dev secrets should use GitHub Environment secrets and/or AWS Secrets Manager.
- Dev must not use production credentials.
- Dev provider credentials remain blocked until Tekae provides sandbox access through an approved secure channel.

Staging:

- Not implemented.
- Must use separate database, secrets, provider credentials, and CORS configuration once approved.
- Must not use dev OTP behavior.

Production:

- Not implemented.
- Must not run mock payment execution.
- Must not use dev OTP fallback.
- Must not enable Tekae without contract readiness and explicit approval.

## Historical Provider Placeholders

Historical Prontipagos/card processor placeholders may still appear in `.env.example`, docs, and older sprint material.

Sprint 012 does not remove them broadly. They should be treated as documentation/runtime debt unless directly touched by a future approved cleanup sprint.

Durable decisions remain:

- Prontipagos is permanently removed.
- Tekae is the approved provider.
- FONDIXPAY is not a fintech.
- Runtime provider execution remains blocked until readiness passes.

## Validation Expectations

Before any future runtime work:

- Run secret hygiene searches.
- Confirm `.env` files are not committed.
- Confirm Tekae remains disabled.
- Confirm backend/mobile runtime files are unchanged unless a runtime sprint is approved.
- Confirm no payment endpoints or webhook endpoints were added.
- Confirm no migration was created without approval.
