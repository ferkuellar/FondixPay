# FONDIXPAY — Production Closure Plan

**Created:** 2026-06-16  
**Audit baseline:** Sprint 087 (Tekae Mobile Session Launch)  
**Last completed sprint:** 090 (Remove unused CRM modules)  
**Active sprint at plan creation:** 091-auth-rate-limit-hardening  

---

## 1. Current State Summary

As of Sprint 090, FONDIXPAY has a functional mobile app (Expo/React Native), backend (FastAPI/PostgreSQL), CRM admin panel, and static landing. The Tekae SSO integration is wired end-to-end in sandbox but blocked from real use by ten identified blockers.

**What is working:**
- OTP authentication flow (dev mode and Twilio SMS)
- Service catalog with coverage-aware filtering (32 Mexican states)
- Tekae sandbox session endpoint (backend + mobile)
- CRM admin panel: users, payments, audit logs, search, bot config
- Claude AI chatbot on landing + admin
- All 202 backend tests passing; mobile TypeScript and lint clean
- Alembic migrations scaffolded (11 migrations)

**What is not production-ready:**
- OTP stored in process memory (single-instance only, no restart survival)
- No rate limiting on auth or payment endpoints
- `Base.metadata.create_all` runs at startup (bypasses Alembic in prod)
- No staging environment (Terraform is dev-only)
- Tekae payment confirmation mechanism unknown (no webhook contract from Tekae)
- Service catalog has demo/test data only; no production catalog
- Landing legal pages have unresolved placeholders
- App not submitted to Google Play or App Store
- No observability (no structured logs, metrics, or alerting)
- JWT has no refresh tokens or server-side revocation
- OTP brute-force: no rate limit on `/auth/request-code` or `/auth/verify-code`
- `POST /payments/sandbox` accessible in production without env gate

---

## 2. Blockers by Severity

| ID | Severity | Description | Sprint |
|----|----------|-------------|--------|
| B-01 | SEV-1 | OTP stored in process memory — single node only, no restart survival | 091 |
| B-02 | SEV-1 | No rate limiting on auth endpoints — brute-force OTP possible | 091 |
| B-03 | SEV-1 | No staging environment — cannot validate safely before prod | 093 |
| B-04 | SEV-2 | `Base.metadata.create_all` at startup — bypasses Alembic in production | 092 |
| B-05 | SEV-2 | Tekae payment confirmation contract unknown — no webhook spec from Tekae | 094 |
| B-06 | SEV-2 | Service catalog is demo/test data only — no production services loaded | 096 |
| B-07 | SEV-2 | Landing legal pages have unresolved placeholders — cannot go public | 097 |
| B-08 | SEV-2 | App not submitted to stores — no distribution channel | 098 |
| B-09 | SEV-2 | No observability — cannot operate production safely | 099 |
| B-10 | SEV-3 | `POST /payments/sandbox` accessible without env gate | 091 |

---

## 3. External Dependencies

| Dependency | Status | Blocks |
|------------|--------|--------|
| Tekae webhook/confirmation contract | Not received | Sprint 094, 095 |
| Tekae production credentials | Separate from sandbox | Sprint 093, 099 |
| Tekae production VPN/VPC topology | Not confirmed | Sprint 099 |
| Legal entity name, RFC, domicile | Not confirmed | Sprint 097 |
| Support email, hours | Not confirmed | Sprint 097 |
| Form submission endpoint provider (Formspree/Resend/etc.) | Not decided | Sprint 097 |
| Apple Developer Account (App Store) | Assumed exists — fercuellar@gmail.com | Sprint 098 |
| Google Play Developer Account | Not confirmed | Sprint 098 |

---

## 4. Sprint Order and Rationale

```
091 → 092 → 093 → 094 → 095 → 096 → 097 → 098 → 099 → 100 → 101 → 102
 ↑         ↑              ↑                             ↑              ↑
SEV-1    DB safety     Staging          Tekae          Store       PROD GATE
Auth     Alembic      env gate         confirm        ready
```

**No real users before 091, 092, 093 are complete.**  
**No Tekae payment confirmation before 094 + 095.**  
**No stores before 097 + 098.**  
**No production before 099 through 102.**

---

## 5. Sprint Definitions

### Sprint 091 — Auth Rate Limit Hardening
**SEV-1 blocker resolution.** Closes B-01 (OTP in-memory) and B-02 (no rate limit on auth).

Scope:
- Replace `_otp_store` dict with Redis (preferred) or database-backed OTP storage
- Add rate limiting: 3 OTP requests/phone/10min, 5 verify attempts/phone/10min
- Lockout after 5 failed OTP verifications (15-minute backoff)
- Gate `POST /payments/sandbox` behind `APP_ENV != production` check (B-10)
- Validate backend starts clean after these changes; 202+ tests still passing

Blocked by: none  
Blocks: real user pilots

Exit criteria:
- OTP survives backend restart
- Rate limit returns 429 after threshold
- Sandbox endpoint returns 403 in production env
- All existing tests pass + new rate limit tests pass

### Sprint 092 — Database Migration Startup Discipline
**SEV-2 blocker resolution.** Closes B-04 (create_all at startup).

Scope:
- Remove `Base.metadata.create_all(bind=engine)` from `backend/app/main.py:60`
- Ensure all 11 existing Alembic migrations produce correct schema
- Add startup check: if `alembic_version` table is absent and `APP_ENV=production`, fail with clear error
- Add `chatbot_ai_metrics` table to Alembic migration (currently auto-created via create_all)
- Update deployment docs: Alembic must run before server start in all envs

Blocked by: Sprint 091 (stable baseline)  
Blocks: staging environment (093)

Exit criteria:
- `main.py` has no `create_all` call
- Fresh DB from migrations only matches `Base.metadata.create_all` schema
- Startup with empty DB in production-like env fails fast with clear message
- `alembic upgrade head` documented in all deployment paths

### Sprint 093 — Staging Environment Foundation
**SEV-1 blocker resolution.** Closes B-03 (no staging env).

Scope:
- Terraform staging environment (`infra/terraform/environments/staging/`)
- GitHub Actions staging deploy pipeline (`.github/workflows/deploy-staging.yml`)
- Staging `backend/.env.staging.example` with safe defaults
- `TEKAE_ENABLED=false` in staging until sandbox credentials are configured
- Staging database with real Alembic migrations (not create_all)
- Backend smoke test via CI: startup health check, OTP rate limit check, migration check

Blocked by: Sprint 092  
Blocks: Tekae confirmation testing (095), observability (099)

Exit criteria:
- Staging backend reachable at a distinct URL from dev
- Alembic migrations ran on staging DB
- Staging CI pipeline green on main branch
- `TEKAE_ENABLED` defaults to false, startup validation enforced

### Sprint 094 — Tekae Payment Confirmation Contract Closure
**External dependency + design.** Closes B-05 (no webhook contract) via contract resolution with Tekae.

Scope:
- Obtain from Tekae: webhook spec, transaction query API, receipt/comprobante retrieval, reconciliation mechanism
- Document confirmed contract in `docs/TEKAE_CONFIRMATION_CONTRACT.md`
- Update `planning/TEKAE_OPEN_QUESTIONS.md`: close Q-004 through Q-012
- Record all new ADRs for confirmation behavior
- Design (no implementation): payment state machine for Tekae (pending → confirmed / failed / timeout)
- Design: session→payment DB schema additions needed for confirmation

Blocked by: Tekae response (external)  
Blocks: Sprint 095

Exit criteria:
- All Q-004–Q-012 resolved or formally marked as "Tekae cannot provide"
- Webhook payload schema documented
- Payment state machine approved and recorded as ADR
- Implementation sprint (095) can begin with no open design questions

### Sprint 095 — Tekae Payment Confirmation Implementation
**Payment confirmation backend wiring.** Requires Sprint 094 contract.

Scope:
- Backend webhook receiver: `POST /api/payments/tekae/webhook` (or polling if no webhook)
- Link webhook event to Tekae `session_ref` → payment record update
- Payment states: `tekae_pending` → `tekae_confirmed` / `tekae_failed` / `tekae_timeout`
- Audit events for each payment state transition
- Mobile: poll or push notification on payment state change
- Receipt generation on `tekae_confirmed`
- `TEKAE_ENABLED=true` on staging only after this sprint passes

Blocked by: Sprint 094 (contract), Sprint 093 (staging env)  
Blocks: production Tekae activation (099)

Exit criteria:
- Webhook receiver passes contract-specified payload validation
- Payment state machine transitions correctly in staging smoke test
- Receipt is generated and accessible for confirmed payment
- Tests: webhook path, state transitions, audit events
- Staging confirmed end-to-end with sandbox Tekae

### Sprint 096 — Service Catalog Production Activation
**Closes B-06 (demo catalog).** Real service catalog loaded and backend-validated.

Scope:
- Import production-intended service catalog (replace demo/test data)
- Validate all catalog entries have coverage, category, carrier metadata
- CRM admin: catalog management view (add/edit/disable services)
- Backend: catalog integrity validation endpoint for ops use
- `NATIONAL` and state-specific coverage rules verified against 32 MX states

Blocked by: Sprint 093 (staging env to validate against)  
Blocks: production user launch (102)

Exit criteria:
- Zero demo placeholder services in production catalog
- All services have valid coverage classification
- CRM can add/disable a service without code deploy
- Coverage filtering tested against all 32 states

### Sprint 097 — Landing Legal & Support Closure
**Closes B-07 (legal page placeholders).** Landing can be published.

Scope:
- Resolve all `.pend` placeholders: legal entity name, RFC, domicile, effective date, ARCO email, legal email, support email, support hours
- Wire contact form `[FORM_ACTION]` to real submission backend (Formspree, Resend, or backend endpoint)
- Legal review sign-off: Términos y Condiciones + Aviso de Privacidad by qualified Mexican attorney (LFPDPPP)
- Remove all internal pending warning blocks before publish
- Landing deploy: confirm `fondixpay.com` resolves to production landing
- CORS: `https://fondixpay.com` in backend `CORS_ORIGINS`

Blocked by: human/legal sign-off (external); Sprint 093 for backend CORS  
Blocks: public user acquisition (102)

Exit criteria:
- Zero `.pend` amber placeholders visible in public pages
- Contact form submits successfully
- Legal attorney has reviewed and approved both legal pages
- Landing passes `curl fondixpay.com` with 200 and no placeholder text in HTML
- Internal pending warning blocks removed from HTML

### Sprint 098 — Mobile Store Readiness
**Closes B-08 (not in stores).** App submitted to both stores.

Scope:
- EAS production build: `eas build --platform all --profile production`
- App Store metadata: screenshots, description (Spanish), keywords, category, age rating
- Google Play metadata: feature graphic, screenshots, short/full description, content rating
- Privacy policy URL wired to `https://fondixpay.com/privacidad` in both stores
- Terms URL wired to `https://fondixpay.com/terminos`
- Mobile version bump: 1.0.0 / versionCode 2
- Expo OTA update configuration: update URL, channel, rollback procedure
- App Store review submission; Google Play production track submission

Blocked by: Sprint 097 (legal pages must be live for store review)  
Blocks: production user acquisition (102)

Exit criteria:
- App available on Google Play (internal test track minimum)
- App in App Store review or approved
- All store metadata complete; no placeholder text
- Privacy policy and terms URLs resolve to live fondixpay.com pages
- Production EAS build ID documented

### Sprint 099 — Observability, Operations & Incident Readiness
**Closes B-09 (no observability).** Cannot operate production without this.

Scope:
- Structured JSON logging in backend (replace `print()` / unformatted log calls)
- Health endpoint hardening: `GET /health` returns detailed component status
- Error tracking: Sentry or equivalent on backend + mobile
- Uptime monitoring: external check on `/health` with alerting
- On-call runbook: `docs/RUNBOOK.md` — startup, restart, rollback, Tekae fallback disable, OTP fallback, DB migration
- Metrics: request rate, error rate, OTP attempt rate, Tekae session rate, p95 latency
- Alerting thresholds defined: error rate >5%, p95 >3s, Tekae failure rate >10%
- Staging smoke test: confirm all observability outputs before production

Blocked by: Sprint 093 (staging)  
Blocks: production launch gate (102)

Exit criteria:
- Every HTTP request writes structured log with request_id, path, status, duration
- Sentry captures exceptions in both backend and mobile
- Uptime monitor active on production URL
- Runbook exists and has been walked through by at least one operator
- Alerting fires on simulated 5xx spike in staging

### Sprint 100 — Security & Abuse Hardening
**Closes remaining SEV-2/SEV-3 security gaps.**

Scope:
- JWT refresh token implementation (rotation + server-side revocation table)
- Session inventory: `GET /auth/sessions` — list active tokens
- `POST /auth/revoke` — explicit logout invalidates token server-side
- HTTP security headers on all backend routes: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`
- Backend HTTPS enforcement in staging/production (no plaintext)
- Tekae session rate limiting: max 3 Tekae sessions/user/hour
- Audit log: all auth events include IP, user agent, device fingerprint
- Vulnerability scan: `pip-audit` + `npm audit` with zero critical findings
- CORS: explicit allowlist only (no wildcard in staging/prod)

Blocked by: Sprint 091 (auth baseline), Sprint 093 (staging env)  
Blocks: closed beta (101)

Exit criteria:
- Refresh token rotation implemented and tested
- Token revocation works: revoked token returns 401 within 1 request
- Security headers present on all responses
- `pip-audit` and `npm audit` return zero critical/high CVEs
- Penetration test checklist signed off (manual or automated)

### Sprint 101 — Closed Beta, Release Candidate & QA
**Last gate before production launch.**

Scope:
- Closed beta: 5–20 invited users with real Tekae sandbox payments
- End-to-end QA checklist: OTP flow, service selection, Tekae session, payment confirmation, receipt, history, support link
- Load test: 50 concurrent OTP requests, 20 concurrent Tekae sessions
- Mobile regression suite: all screens navigate without crash
- Backend: 202+ tests still passing after all closure sprints
- CRM: admin can view beta user payments, receipts, audit logs
- Rollback drill: disable `TEKAE_ENABLED` on staging, verify graceful degradation
- Bug fix window: only severity SEV-1/SEV-2 blockers fixed; no scope additions
- Go/No-Go vote: product, security, legal sign-off

Blocked by: Sprints 093–100 complete  
Blocks: Sprint 102

Exit criteria:
- 5+ real users completed a full Tekae payment flow in sandbox without support intervention
- Zero SEV-1 bugs open
- Load test: p95 < 2s under 50 concurrent OTP requests
- Rollback drill completed successfully
- Go/No-Go: all three sign-offs obtained

### Sprint 102 — Production Launch Gate
**Final production activation.**

Scope:
- Switch Tekae credentials to production (`TEKAE_UID`, `TEKAE_PASSWORD`, `TEKAE_BEARER`, `TEKAE_BASE_URL` prod values)
- VPN/VPC or allowlist: confirm network path to Tekae prod API
- Production environment variables: validated against `validate_security_settings`
- DNS: `api.fondixpay.com` (or equivalent) pointing to production backend
- Tekae `TEKAE_ENABLED=true` in production — only after all gates pass
- Mobile: app live in stores pointing to production API
- Landing: `https://fondixpay.com` live with resolved legal pages
- Operations: on-call schedule, escalation path, Tekae vendor contact
- Launch announcement only after `GET /health` returns `{"status":"ok"}` on production
- Post-launch: monitor error rate for 24h; rollback criteria defined

Blocked by: Sprint 101 (beta pass), Sprint 098 (store approval)  
Exit criteria (LAUNCH GATE — all must be met):

- [ ] Production database running with Alembic migrations (no create_all)
- [ ] `validate_security_settings` passes on startup with production env
- [ ] JWT secret is 64+ character random value in production env
- [ ] `TEKAE_ENABLED=true` with production credentials validated
- [ ] Tekae production VPN/VPC confirmed
- [ ] `GET /production-health` returns `{"status":"ok","ai_configured":true,"db_reachable":true}`
- [ ] Mobile app live in Google Play and App Store (or at minimum one store)
- [ ] `fondixpay.com` resolves; legal pages have zero placeholders
- [ ] Sentry capturing on production
- [ ] On-call runbook documented and operator confirmed
- [ ] Go/No-Go from product, security, and legal

---

## 6. Beta Release Criteria (Sprint 101 Gate)

Before any invited real users access production:
1. OTP rate limiting active (Sprint 091)
2. Alembic-only DB management (Sprint 092)
3. Staging environment validated (Sprint 093)
4. Tekae payment confirmation implemented (Sprint 095)
5. Security hardening complete (Sprint 100)
6. Observability active (Sprint 099)
7. Legal pages resolved (Sprint 097)

---

## 7. App Store Criteria (Sprint 098 Gate)

Before submitting to stores:
1. Legal pages live at `fondixpay.com/privacidad` and `fondixpay.com/terminos`
2. Production EAS build using `com.fondixpay.app`
3. Version 1.0.0, versionCode ≥ 2
4. Privacy policy URL populated in store listing
5. App does not mention "demo", "mock", "sandbox", or "simulado" in any user-visible string

---

## 8. Open Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Tekae never provides webhook spec | SEV-1 | Define polling fallback in Sprint 094; use status query API if available |
| Tekae production VPN/VPC blocks deployment | SEV-1 | Confirm topology in Sprint 093; test network path before Sprint 102 |
| Apple App Review rejection | SEV-2 | Ensure legal pages live, no demo language, correct age rating |
| Legal attorney unavailable for Sprint 097 deadline | SEV-2 | Begin legal engagement now; Sprint 097 blocked until signed off |
| OTP Redis dependency adds operational complexity | SEV-3 | Use DB-backed OTP (PostgreSQL) if Redis not available in staging |
| JWT revocation adds DB read per request | SEV-3 | Cache revocation table in Redis or use short token TTL |

---

## 9. Required Decisions (see DECISIONS.md ADR-195–ADR-200)

- ADR-195: OTP persistence backend (Redis vs. PostgreSQL)
- ADR-196: JWT refresh token rotation and revocation model
- ADR-197: Tekae production network path (VPN vs. allowlist)
- ADR-198: Contact form submission backend (Formspree vs. backend endpoint)
- ADR-199: Production observability backend (Sentry, Datadog, CloudWatch)
- ADR-200: Closed beta user acquisition and invitation model

---

## 10. Open Questions (see QUESTIONS.md)

- Q-CPC-001: Does Tekae provide webhook or only polling for payment confirmation?
- Q-CPC-002: What is the Tekae transaction query API format?
- Q-CPC-003: Which Tekae evidence is sufficient to generate a receipt?
- Q-CPC-004: Does Tekae production require VPN, IP allowlist, or mTLS?
- Q-CPC-005: Has the Apple Developer Account been confirmed active for this product?
- Q-CPC-006: Which form submission provider is approved for the contact form?
- Q-CPC-007: Has a Mexican LFPDPPP attorney been engaged for legal page review?

---

## 11. Sprint Dependencies Graph

```
091 (B-01, B-02, B-10)
 └──> 092 (B-04)
       └──> 093 (B-03) ──────────────────────────────┐
             ├──> 094 (external) ──> 095 (B-05)      │
             ├──> 096 (B-06)                          │
             └──> 099 (B-09) ──> 100 ──> 101 ──> 102 │
097 (external legal) ──────────────────────────────────┤
098 (stores; needs 097) ────────────────────────────────┘
```

All paths converge at Sprint 102 — Production Launch Gate.
