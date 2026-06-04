# Sprint 013 Builder Handoff Prompt

You are a senior software architect, DevOps architect, product safety reviewer, mobile UX copy reviewer, and software quality auditor working on FONDIXPAY.

This is Sprint 013:

Environment Docs Alignment & Mock Payment Copy Cleanup

This sprint is documentation and review only.

## Read First

1. AGENTS.md
2. planning/STATE.md
3. planning/DECISIONS.md
4. planning/DOMAIN.md
5. planning/RISKS.md
6. planning/QUESTIONS.md
7. docs/ENVIRONMENT.md
8. docs/ENVIRONMENTS.md, if present
9. docs/DEV_READINESS.md
10. docs/DEPLOYMENT.md
11. docs/ARCHITECTURE.md
12. docs/API.md
13. docs/SECURITY.md
14. docs/TEKAE_DISCOVERY.md
15. docs/TEKAE_RUNTIME_READINESS.md, if present
16. planning/sprints/013-environment-docs-alignment-mock-payment-copy-cleanup/requirements.md
17. planning/sprints/013-environment-docs-alignment-mock-payment-copy-cleanup/blueprint.md
18. planning/sprints/013-environment-docs-alignment-mock-payment-copy-cleanup/acceptance.md

## Task

Execute Sprint 013 by aligning environment documentation and documenting mock/dev payment copy risks without touching runtime code.

Create if missing:

* docs/MOCK_PAYMENT_COPY_REVIEW.md

Update if present and relevant:

* docs/ENVIRONMENT.md
* docs/ENVIRONMENTS.md
* docs/DEV_READINESS.md
* docs/DEPLOYMENT.md
* docs/ARCHITECTURE.md
* docs/API.md
* docs/SECURITY.md
* docs/TEKAE_RUNTIME_READINESS.md
* planning/RISKS.md
* planning/QUESTIONS.md
* planning/STATE.md

## Rules

* Do not modify mobile runtime files.
* Do not modify backend runtime files.
* Do not create or modify migrations.
* Do not create or modify endpoints.
* Do not create or modify webhooks.
* Do not configure credentials.
* Do not modify `.env` files.
* Do not modify Terraform/infra behavior.
* Do not change production deployment behavior.
* Do not implement Tekae runtime.
* Do not enable real provider execution.
* Do not claim real payment success without provider confirmation.
* Keep Tekae blocked until Sprint 011 contract readiness passes.
* Preserve FONDIXPAY as not fintech.
* Preserve Tekae as approved provider.
* Preserve Prontipagos as permanently removed.
* Do not overwrite unrelated existing working tree changes.

## Required Review

Inspect and document:

1. Current environment documentation.
2. Whether `ENVIRONMENT.md` and `ENVIRONMENTS.md` conflict.
3. Which environment doc should be canonical.
4. Local/dev/staging/production status.
5. AWS dev-only status.
6. Vercel landing-only boundary.
7. Mock/dev payment copy risks.
8. Future UI copy cleanup requirements.
9. Prontipagos/card processor documentation debt.
10. Tekae runtime blocked status.

## Validation Checks

Run documentation-safe checks:

* git status --short
* git diff --name-only
* git diff --check
* search for `pago exitoso`
* search for `payment successful`
* search for `paid`
* search for `Prontipagos`
* search for `TEKAE_ENABLED=true`
* search for claims that Tekae runtime is enabled
* confirm no backend runtime files changed
* confirm no mobile runtime files changed
* confirm no migrations changed
* confirm no `.env` files changed
* confirm no infra/deployment behavior changed

## Completion Report

After changes, report:

1. Files created.
2. Files modified.
3. Environment documentation conflicts found.
4. Environment alignment performed.
5. Mock payment copy risks found.
6. Future UI copy changes recommended.
7. Risks added or updated.
8. Questions added or updated.
9. Validation checks run.
10. Whether acceptance criteria are satisfied.
11. Recommended next sprint.

Do not mark Sprint 013 complete if acceptance criteria are not satisfied.
