# Sprint 012 — Dev Readiness & App Cleanup While Tekae Is Blocked Blueprint

## Objective

Create or update documentation that prepares FONDIXPAY for future Tekae runtime implementation without touching real payment runtime code.

## Files to Review

* AGENTS.md
* planning/STATE.md
* planning/DECISIONS.md
* planning/DOMAIN.md
* planning/RISKS.md
* planning/QUESTIONS.md
* docs/ARCHITECTURE.md
* docs/API.md
* docs/SECURITY.md
* docs/TEKAE_DISCOVERY.md
* docs/TEKAE_RUNTIME_READINESS.md, if it exists
* docs/DEPLOYMENT.md, if it exists
* docs/ENVIRONMENT.md, if it exists
* docs/DEV_READINESS.md, if it exists
* package.json files, if present, for scripts only
* backend dependency/config files, for documentation only
* mobile dependency/config files, for documentation only
* CI workflow files, if present, for documentation only

## Files to Create If Missing

* docs/DEV_READINESS.md
* docs/ENVIRONMENT.md

## Files to Update If Present

* docs/DEPLOYMENT.md
* docs/SECURITY.md
* docs/ARCHITECTURE.md
* docs/API.md
* docs/TEKAE_RUNTIME_READINESS.md
* planning/RISKS.md
* planning/QUESTIONS.md
* planning/STATE.md

## Do Not Modify Unless Explicitly Approved

* backend runtime code
* mobile runtime code
* database migrations
* .env files
* credentials
* payment execution logic
* webhook handlers
* production deployment configs

## Execution Plan

1. Inspect current repo structure.

   * Identify backend folder.
   * Identify mobile folder.
   * Identify infra/AWS folders.
   * Identify CI workflow files.
   * Identify docs already present.

2. Document dev readiness.

   * Backend local run status.
   * Docker status.
   * Database/Alembic status.
   * Mobile Expo status.
   * CI/typecheck/lint/test status.
   * Known blockers.

3. Document environment strategy.

   * Required placeholders.
   * No secrets in repo.
   * Difference between local/dev/staging/production.
   * Tekae disabled/blocking flags.
   * Backend API URL behavior.
   * Provider mode flags.

4. Document AWS dev direction.

   * Minimal backend hosting direction.
   * VPC expectation.
   * Public/private boundary.
   * No AWS resource creation in this sprint.
   * Landing remains outside core backend if hosted on Vercel.

5. Document mock/provider boundary.

   * Mock/dev payment behavior.
   * Real Tekae behavior blocked.
   * Provider abstraction expectations.
   * Safe copy rules.
   * App screens that may need wording review later.

6. Document security checks.

   * Secret scanning expectation.
   * Token/credential redaction.
   * No Tekae credentials committed.
   * No full provider URLs/tokens in logs.

7. Document cleanup debt.

   * Historical Prontipagos/card processor references.
   * Clean only when touched or in future documentation cleanup sprint.
   * Do not perform broad destructive cleanup in this sprint.

8. Update planning.

   * STATE reflects Sprint 012 active.
   * RISKS captures readiness risks.
   * QUESTIONS captures unresolved internal readiness questions.
   * Do not overwrite unrelated existing changes.

## Validation Plan

Run documentation-safe checks only:

* git status --short
* git diff --name-only
* git diff --check
* search for Prontipagos references
* search for Tekae enabled/runtime claims
* search for secrets/tokens/password-like strings where safe
* inspect package scripts if present
* inspect CI workflow names if present
* confirm no backend/mobile runtime files changed unless explicitly approved

## Expected Output Report

At completion, report:

1. Files created.
2. Files modified.
3. Dev readiness status.
4. Internal blockers.
5. Tekae blockers still external.
6. Risks added.
7. Questions added.
8. Validation checks run.
9. Whether acceptance criteria are met.
10. Recommended next sprint.
