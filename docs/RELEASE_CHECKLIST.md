# Release Checklist

**Status:** Template ready. No release has been executed.
**Last updated:** 2026-06-02

---

## How to Use

Complete this checklist in order for every release. Each item requires a sign-off (initials + date). Do not mark an item complete without verifiable evidence.

A release may not proceed to production if any item is NOT DONE.

---

## Phase 0 — Pre-Release Gate

| # | Check | Status | Sign-off |
|---|---|---|---|
| 0.1 | All production readiness gates pass (`docs/PRODUCTION_READINESS.md`) | — | |
| 0.2 | Active sprint acceptance criteria met | — | |
| 0.3 | No open BLOCKING risks in `planning/TEKAE_RISKS.md` | — | |
| 0.4 | Feature flags reviewed: `TEKAE_ENABLED=false` unless explicitly approved | — | |
| 0.5 | No secrets in repository (`git log` secret scan passed) | — | |

---

## Phase 1 — Code Quality

| # | Check | Status | Sign-off |
|---|---|---|---|
| 1.1 | `npx tsc --noEmit` passes with 0 errors (mobile) | — | |
| 1.2 | Backend test suite passes | — | |
| 1.3 | No TODO/FIXME items in payment-critical paths | — | |
| 1.4 | No console.log or debug output in production code | — | |
| 1.5 | All new dependencies reviewed and approved | — | |

---

## Phase 2 — Security

| # | Check | Status | Sign-off |
|---|---|---|---|
| 2.1 | `OTP_DEV_RESPONSE_ENABLED=false` in staging and production | — | |
| 2.2 | `OTP_DEV_CODE` not present in staging/production environment | — | |
| 2.3 | `JWT_SECRET_KEY` is strong and environment-specific | — | |
| 2.4 | CORS origins are explicit and restricted | — | |
| 2.5 | Tekae credentials not present in mobile bundle | — | |
| 2.6 | No card data stored in FONDIXPAY systems | — | |
| 2.7 | Webhook signature verification implemented and tested | — | |

---

## Phase 3 — Staging Validation

| # | Check | Status | Sign-off |
|---|---|---|---|
| 3.1 | Staging environment deployed from same commit as production candidate | — | |
| 3.2 | Auth flow (OTP login → session) tested in staging | — | |
| 3.3 | Payment flow tested end-to-end in staging | — | |
| 3.4 | Payment failure and recovery paths tested | — | |
| 3.5 | Support screen displays user-friendly message on Tekae unavailable | — | |
| 3.6 | Rollback procedure tested in staging (`docs/ROLLBACK.md`) | — | |

---

## Phase 4 — Provider Readiness (Tekae)

| # | Check | Status | Sign-off |
|---|---|---|---|
| 4.1 | All 14 open questions resolved (`planning/TEKAE_OPEN_QUESTIONS.md`) | BLOCKED | |
| 4.2 | Tekae sandbox test report reviewed and accepted | BLOCKED | |
| 4.3 | Tekae production credentials in AWS Secrets Manager | BLOCKED | |
| 4.4 | `TEKAE_ENABLED=true` approved by product leadership + security | BLOCKED | |
| 4.5 | Tekae runbook populated (`docs/integrations/TEKAE_RUNBOOK.md`) | BLOCKED | |
| 4.6 | Tekae support contacts confirmed (`docs/integrations/TEKAE_SUPPORT.md`) | BLOCKED | |

> Items 4.x remain BLOCKED until sprint `008b-tekae-integration-discovery` acceptance criteria are met.

---

## Phase 5 — Mobile Build

| # | Check | Status | Sign-off |
|---|---|---|---|
| 5.1 | EAS production build created from release commit | — | |
| 5.2 | App Store metadata and screenshots updated | — | |
| 5.3 | Google Play metadata and screenshots updated | — | |
| 5.4 | `app.json` version and build number incremented | — | |
| 5.5 | Expo updates / OTA policy reviewed | — | |

---

## Phase 6 — Post-Deploy Verification

| # | Check | Status | Sign-off |
|---|---|---|---|
| 6.1 | Backend health endpoint returns 200 | — | |
| 6.2 | Auth flow tested in production | — | |
| 6.3 | At least one payment tested in production (after Tekae live) | BLOCKED | |
| 6.4 | Observability events confirmed flowing (`docs/OBSERVABILITY.md`) | — | |
| 6.5 | Support team briefed on new release | — | |
| 6.6 | Rollback procedure ready and rehearsed | — | |

---

## Sign-Off Record

| Role | Name | Date | Notes |
|---|---|---|---|
| Engineering Lead | | | |
| Product Owner | | | |
| Security Reviewer | | | |
| Operations | | | |

---

## Related Documents

- `docs/PRODUCTION_READINESS.md` — full production gate list
- `docs/ENVIRONMENTS.md` — environment strategy
- `docs/ROLLBACK.md` — rollback procedures
- `docs/OBSERVABILITY.md` — observability contract
- `planning/TEKAE_OPEN_QUESTIONS.md` — 14 blocking questions
