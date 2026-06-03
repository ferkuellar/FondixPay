# Rollback Procedures

**Status:** Documented. Not yet tested in staging.
**Last updated:** 2026-06-02

---

## Principle

Every deployment must have a tested rollback path before going live. If a rollback path does not exist for a component, the deployment is not approved.

---

## Backend Rollback

### Scenario: Bad deployment — backend returning errors

1. Identify the last known good container image tag from ECS task history.
2. In GitHub Actions, trigger a manual deployment of the previous tag.
3. If GitHub Actions is unavailable, run Terraform targeting the ECS service with the previous image URI.
4. Confirm health endpoint returns 200 after rollback.
5. File an incident report documenting what broke and what was rolled back.

### Scenario: Database migration failure

1. Do not run `terraform destroy`.
2. Identify the migration that failed (Alembic revision).
3. Run `alembic downgrade -1` on the affected environment.
4. If data was written after a bad migration, assess data integrity before marking rollback complete.
5. Fix the migration and re-test in staging before re-applying.

**Rule:** Never run `alembic downgrade base` in staging or production without explicit engineering lead approval.

---

## Mobile Rollback

### Scenario: Bad release in App Store / Google Play

1. If using Expo OTA updates: roll back OTA by reverting to the previous published update in EAS dashboard.
2. If OTA is not used or update cannot be reverted: submit a hotfix build to App Store / Google Play expedited review.
3. Notify support team immediately — users on the bad version may need manual guidance.

### Scenario: Critical crash on app launch

1. Revert OTA if available.
2. If no OTA: submit emergency patch.
3. Support team uses `docs/SUPPORT_RUNBOOK.md` to handle inbound reports.

---

## Tekae Integration Rollback

### Scenario: Tekae integration is live but producing payment failures

1. Set `TEKAE_ENABLED=false` / `TEKAE_MODE=disabled` in the relevant environment secrets.
2. Redeploy backend with updated config (no code change required if feature flag is wired).
3. Mobile will display "Servicio en preparación" message to users attempting to pay.
4. Support team activates manual payment guidance path per `docs/SUPPORT_RUNBOOK.md`.
5. File incident with Tekae support using `docs/integrations/TEKAE_SUPPORT.md`.
6. Do not re-enable until root cause is confirmed and Tekae acknowledges.

> **Note:** TEKAE_ENABLED is currently `false` and Tekae integration is not live. This procedure applies once integration is active.

### Scenario: Tekae sends unexpected webhook payloads

1. Disable webhook processing at the routing layer (return 200 to avoid Tekae retry storms, queue events for manual review).
2. Do not process any unverified payment state changes.
3. Contact Tekae support immediately.
4. Review all payment records for the affected time window.

---

## Infra / Terraform Rollback

1. Review the failed deployment logs.
2. Run `terraform plan` against the last known good state.
3. Do not run `terraform plan -destroy` without explicit human approval.
4. Do not run `terraform destroy` without explicit engineering lead approval and a backup of the database.

---

## Rollback Communication Protocol

| Step | Action |
|---|---|
| 1 | Engineering lead confirms rollback is initiated |
| 2 | Product owner notified within 15 minutes |
| 3 | Support team briefed on user-facing impact |
| 4 | Incident record opened |
| 5 | RCA filed within 48 hours |

---

## What Cannot Be Rolled Back

- Sent OTP messages (charges to SMS provider may occur).
- Confirmed Tekae payment transactions (refund/reversal process applies, not rollback).
- Audit log entries (append-only by design).
- Emails or WhatsApp receipts already delivered.

---

## Related Documents

- `docs/DEPLOYMENT.md` — deployment procedures
- `docs/ENVIRONMENTS.md` — environment strategy
- `docs/RELEASE_CHECKLIST.md` — release checklist
- `docs/integrations/TEKAE_RUNBOOK.md` — Tekae operational runbook
- `docs/integrations/TEKAE_SUPPORT.md` — Tekae support contacts
- `docs/CICD_PIPELINE.md` — CI/CD pipeline
