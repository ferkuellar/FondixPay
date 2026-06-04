# Sprint 012 Builder Handoff Prompt

You are a senior software architect, DevOps architect, backend engineer, mobile readiness reviewer, and software quality auditor working on FONDIXPAY.

This is Sprint 012:

Dev Readiness & App Cleanup While Tekae Is Blocked

This sprint prepares internal development readiness while Tekae contract closure remains externally blocked.

## Read First

1. AGENTS.md
2. planning/STATE.md
3. planning/DECISIONS.md
4. planning/DOMAIN.md
5. planning/RISKS.md
6. planning/QUESTIONS.md
7. docs/ARCHITECTURE.md
8. docs/API.md
9. docs/SECURITY.md
10. docs/TEKAE_DISCOVERY.md
11. docs/TEKAE_RUNTIME_READINESS.md, if present
12. docs/DEPLOYMENT.md, if present
13. docs/ENVIRONMENT.md, if present
14. docs/DEV_READINESS.md, if present
15. planning/sprints/012-dev-readiness-app-cleanup-while-tekae-blocked/requirements.md
16. planning/sprints/012-dev-readiness-app-cleanup-while-tekae-blocked/blueprint.md
17. planning/sprints/012-dev-readiness-app-cleanup-while-tekae-blocked/acceptance.md

## Task

Execute Sprint 012 documentation and readiness work.

Create if missing:

* docs/DEV_READINESS.md
* docs/ENVIRONMENT.md

Update if present and relevant:

* docs/DEPLOYMENT.md
* docs/SECURITY.md
* docs/ARCHITECTURE.md
* docs/API.md
* docs/TEKAE_RUNTIME_READINESS.md
* planning/RISKS.md
* planning/QUESTIONS.md
* planning/STATE.md

## Rules

* Do not implement Tekae runtime.
* Do not create payment endpoints.
* Do not create webhook endpoints.
* Do not create migrations.
* Do not configure credentials.
* Do not add secrets.
* Do not enable real provider execution.
* Do not modify backend runtime payment behavior.
* Do not modify mobile runtime payment behavior.
* Do not change production deployment behavior.
* Keep Tekae blocked until Sprint 011 contract readiness passes.
* Preserve FONDIXPAY as not fintech.
* Preserve Tekae as approved provider.
* Preserve Prontipagos as permanently removed.
* Do not overwrite unrelated existing working tree changes.
* Do not modify tekae-readiness-matrix.md unless explicitly approved.

## Required Review

Inspect and document:

1. Repo structure.
2. Backend dev readiness.
3. Mobile dev readiness.
4. Docker/backend local readiness.
5. CI/typecheck/lint/test readiness.
6. Environment placeholder strategy.
7. AWS dev/staging direction.
8. Landing/Vercel boundary.
9. Mock provider vs real provider boundary.
10. Security/secret hygiene.
11. Historical Prontipagos/card processor documentation debt.

## Completion Report

After changes, report:

1. Files created.
2. Files modified.
3. Dev readiness findings.
4. Internal blockers.
5. External Tekae blockers.
6. Risks added or updated.
7. Questions added or updated.
8. Validation checks run.
9. Whether acceptance criteria are satisfied.
10. Recommended next sprint.

Do not mark Sprint 012 complete if acceptance criteria are not satisfied.
