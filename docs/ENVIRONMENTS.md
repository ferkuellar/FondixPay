# Environments

**Status:** Sprint 013 aligned environment tier matrix. Only `local` is operational. Dev/staging/production app runtime are not deployed.
**Last updated:** 2026-06-03

Canonical relationship:

- `docs/ENVIRONMENT.md` is the canonical current-state environment strategy.
- This file is the tier matrix and must not imply deployed AWS services that do not exist in the current Terraform.
- Current AWS infrastructure remains dev-only and minimal. It is not staging or production.
- Vercel remains the public landing/front-door host only.

---

## Environment Tiers

### local

| Property | Value |
|---|---|
| Purpose | Developer workstation — feature development |
| Backend | `uvicorn` on `localhost:8000` |
| Mobile | Expo Go on device or emulator |
| Database | Local PostgreSQL via Docker |
| Provider | Mock only. `TEKAE_ENABLED=false`, `CARD_PROCESSOR_PROVIDER=mock` |
| OTP | Dev code `123456` allowed (`OTP_DEV_RESPONSE_ENABLED=true`) |
| Secrets | `.env` local file only — never committed |
| Deployment | Manual |

**Rules:**
- Real payment credentials must never be used in local.
- Dev OTP code is permitted.
- CORS may include `localhost` and LAN IPs.

---

### development (dev)

| Property | Value |
|---|---|
| Purpose | Shared integration environment — merged feature branches |
| Backend | Not deployed. Future dev backend target remains to be approved; current Terraform supports dev foundation and optional EC2 only. |
| Mobile | Expo development build pointing to dev API |
| Database | Not deployed in AWS. Local PostgreSQL/Docker is operational; no RDS exists in current Terraform. |
| Provider | Mock/dev only. Tekae sandbox remains blocked until Sprint 011 contract readiness passes. |
| OTP | Real OTP provider or dev code if provider unavailable — `OTP_DEV_RESPONSE_ENABLED` must be reviewed |
| Secrets | Future GitHub Environment secrets and/or AWS Secrets Manager once approved |
| Deployment | GitHub Actions can validate and manually plan/apply dev Terraform when secrets are configured; no backend app deployment is active. |

**Rules:**
- Dev OTP code must be reviewed per environment decision.
- Production credentials must never be used in dev.
- CORS must be explicit — no wildcards.
- Tekae sandbox credentials must not be configured until Sprint 011 contract readiness passes and an implementation sprint is approved.

---

### staging

| Property | Value |
|---|---|
| Purpose | Production mirror — pre-release validation |
| Backend | Not implemented. Future design required. |
| Mobile | Expo production build pointing to staging API |
| Database | Not implemented. Must be separate from dev once approved. |
| Provider | Blocked. Future Tekae sandbox/staging behavior must be confirmed by official Tekae material. |
| OTP | Real OTP provider only. `OTP_DEV_RESPONSE_ENABLED=false` |
| Secrets | Future environment-specific secret store once approved |
| Deployment | GitHub Actions — gated, requires explicit approval |

**Rules:**
- `OTP_DEV_RESPONSE_ENABLED` must be `false`.
- `JWT_SECRET_KEY` must be strong and environment-specific.
- CORS must be explicit and restricted.
- Production credentials must never be used in staging.
- All release checklist items must pass in staging before production deploy.

**Current state:** Staging Terraform workspace does not exist. Staging deployment is blocked.

---

### production

| Property | Value |
|---|---|
| Purpose | Future live user traffic. Not approved for real payment execution. |
| Backend | Not implemented. Future approved architecture required. |
| Mobile | App Store / Google Play release build |
| Database | Not implemented. Must be separate from every non-production environment once approved. |
| Provider | Tekae production only after Sprint 011 contract readiness and future production gates pass |
| OTP | Real OTP provider only. `OTP_DEV_RESPONSE_ENABLED=false` |
| Secrets | Future production-approved secret store |
| Deployment | GitHub Actions — gated, multi-approval required |

**Rules:**
- Production is locked until all gates in `docs/PRODUCTION_READINESS.md` pass.
- `TEKAE_ENABLED` must be explicitly approved before set to `true`.
- Mock payment scenarios must be disabled or removed.
- No `OTP_DEV_CODE` fallback.
- CORS must be restricted to production domains only.
- Force-push to `main` is prohibited.

**Current state:** Production infrastructure does not exist. Production deployment is blocked.

---

## Environment Variable Matrix

| Variable | local | dev | staging | production |
|---|---|---|---|---|
| `APP_ENV` | `development` | `development` | `staging` | `production` |
| `OTP_DEV_RESPONSE_ENABLED` | `true` | review | `false` | `false` |
| `OTP_DEV_CODE` | `123456` | review | must not exist | must not exist |
| `JWT_SECRET_KEY` | weak local | strong | strong | strong — rotate on schedule |
| `CORS_ORIGINS` | localhost + LAN | explicit | explicit | explicit production domains |
| `TEKAE_ENABLED` | `false` | `false` | `false` until approved | `false` until approved |
| `TEKAE_MODE` | `disabled` | `disabled` | `disabled` until approved | `disabled` until approved |
| `CARD_PROCESSOR_PROVIDER` | `mock` | `mock` | TBD | TBD |
| `PRONTIPAGOS_ENV` | `sandbox` (historical/superseded) | `sandbox` (historical/superseded) | superseded | superseded |

---

## Secret Management

- **Local:** `.env` file — never committed, listed in `.gitignore`.
- **Dev / staging / production:** Future environment-specific secret store, such as GitHub Environment secrets and/or AWS Secrets Manager once approved. Suggested path convention: `fondixpay/{env}/{service}/{key}`.
- No provider secrets (API keys, webhook secrets, credentials) may appear in any `.env.example` file.
- `.env.example` contains only placeholder/empty values and documentation comments.

---

## Related Documents

- `docs/DEPLOYMENT.md` — deployment procedures
- `docs/PRODUCTION_READINESS.md` — production gates
- `docs/RELEASE_CHECKLIST.md` — release checklist
- `docs/ROLLBACK.md` — rollback procedures
- `docs/AWS_DEV_STAGING_DEPLOYMENT.md` — AWS Terraform workflow
- `docs/CICD_PIPELINE.md` — CI/CD pipeline
