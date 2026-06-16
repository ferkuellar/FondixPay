# Sprint 101 — Builder Handoff Prompt

You are running Sprint 101: Closed Beta, Release Candidate & QA for FONDIXPAY.

## Context

All production closure sprints (091–100) are complete. This sprint validates the full system with real invited users and load tests. It ends with a Go/No-Go vote. No new features are added in this sprint — only bug fixes for SEV-1 and SEV-2 issues found during QA.

## What To Do

**Before beta begins:**
1. Confirm staging is healthy: `GET staging-url/health` returns `{"status":"ok"}`.
2. Confirm `TEKAE_ENABLED=true` in staging with sandbox credentials.
3. Confirm all 202+ backend tests pass.
4. Confirm mobile TypeScript: 0 errors.
5. Prepare EAS preview build pointing at staging API for testers.

**Run QA:**
1. Execute the end-to-end QA script (in `blueprint.md`) for each beta user.
2. Run load test: 50 concurrent OTP requests (p95 < 2s), 20 concurrent Tekae sessions (p95 < 5s).
3. Execute rollback drill: `TEKAE_ENABLED=false` in staging while session in progress; verify graceful error.
4. Execute security regression checklist.

**Triage:**
1. Log all issues as SEV-1/2/3.
2. Fix all SEV-1 and SEV-2 before Go/No-Go.
3. Log SEV-3 for post-launch sprint.

**Go/No-Go:**
1. Obtain written sign-off from product owner, security reviewer, and legal.
2. Document each sign-off with name and date in sprint completion notes.

## Files to Read First

- `planning/PRODUCTION_CLOSURE_PLAN.md` — full blocker list to verify all closed
- `planning/sprints/101-closed-beta-release-candidate-qa/blueprint.md` — QA script and load test
- `docs/RUNBOOK.md` — rollback drill procedure (created in Sprint 099)
- `backend/app/core/config.py` — TEKAE_ENABLED and validate_security_settings

## Constraints

- No new features in this sprint
- No changes to production (Sprint 102 only)
- `TEKAE_ENABLED=true` in staging ONLY; `false` in production
- Every Go/No-Go sign-off must have a name and date

## Output

Report: beta user count, flows completed without support, load test results (p95 OTP, p95 Tekae), SEV-1/2/3 bug counts found and fixed, rollback drill result, and Go/No-Go status (pass/fail and three sign-off names+dates).
