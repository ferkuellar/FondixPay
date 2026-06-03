# Environments

**Status:** Strategy documented. Only `local` is operational. Dev/staging/production are not deployed.
**Last updated:** 2026-06-02

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
| Backend | AWS ECS (Terraform `dev` workspace) |
| Mobile | Expo development build pointing to dev API |
| Database | AWS RDS dev instance |
| Provider | Mock or Tekae sandbox once available |
| OTP | Real OTP provider or dev code if provider unavailable — `OTP_DEV_RESPONSE_ENABLED` must be reviewed |
| Secrets | AWS Secrets Manager (`dev` path) |
| Deployment | GitHub Actions `deploy-dev.yml` — manual, requires `confirm_environment=dev` and `apply=true` |

**Rules:**
- Dev OTP code must be reviewed per environment decision.
- Production credentials must never be used in dev.
- CORS must be explicit — no wildcards.
- Tekae sandbox credentials (when available) may be used here.

---

### staging

| Property | Value |
|---|---|
| Purpose | Production mirror — pre-release validation |
| Backend | AWS ECS (Terraform `staging` workspace — not yet created) |
| Mobile | Expo production build pointing to staging API |
| Database | AWS RDS staging instance — separate from dev |
| Provider | Tekae sandbox — must not use production credentials |
| OTP | Real OTP provider only. `OTP_DEV_RESPONSE_ENABLED=false` |
| Secrets | AWS Secrets Manager (`staging` path) |
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
| Purpose | Live user traffic — real money |
| Backend | AWS ECS (Terraform `production` workspace — not yet created) |
| Mobile | App Store / Google Play release build |
| Database | AWS RDS production instance — separate from staging |
| Provider | Tekae production — only after Gate 3 passes |
| OTP | Real OTP provider only. `OTP_DEV_RESPONSE_ENABLED=false` |
| Secrets | AWS Secrets Manager (`production` path) |
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
| `PRONTIPAGOS_ENV` | `sandbox` (historical) | `sandbox` (historical) | superseded | superseded |

---

## Secret Management

- **Local:** `.env` file — never committed, listed in `.gitignore`.
- **Dev / staging / production:** AWS Secrets Manager. Path convention: `fondixpay/{env}/{service}/{key}`.
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
