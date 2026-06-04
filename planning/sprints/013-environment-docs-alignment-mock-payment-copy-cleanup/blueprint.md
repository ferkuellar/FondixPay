# Sprint 013 — Environment Docs Alignment & Mock Payment Copy Cleanup Blueprint

## Objective

Align environment documentation and document risky mock/dev payment copy without touching runtime code.

## Files to Review

* AGENTS.md
* planning/STATE.md
* planning/DECISIONS.md
* planning/DOMAIN.md
* planning/RISKS.md
* planning/QUESTIONS.md
* docs/ENVIRONMENT.md
* docs/ENVIRONMENTS.md, if present
* docs/DEV_READINESS.md
* docs/DEPLOYMENT.md
* docs/ARCHITECTURE.md
* docs/API.md
* docs/SECURITY.md
* docs/TEKAE_DISCOVERY.md
* docs/TEKAE_RUNTIME_READINESS.md, if present
* mobile source files only for text search / inspection, not modification
* backend source files only for text search / inspection, not modification
* README.md and project docs only for provider/payment wording search

## Files to Create If Missing

* docs/MOCK_PAYMENT_COPY_REVIEW.md

## Files to Update If Present and Relevant

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

## Do Not Modify

* mobile runtime files
* backend runtime files
* migrations
* .env files
* credentials
* payment execution logic
* webhook handlers
* provider integration code
* production deployment configuration
* Terraform / infra code
* package scripts
* CI workflow behavior

## Execution Plan

1. Inspect repository status.

   * Run `git status --short`.
   * Identify existing uncommitted changes.
   * Do not overwrite unrelated work.

2. Review environment documentation.

   * Check whether `docs/ENVIRONMENT.md` exists.
   * Check whether `docs/ENVIRONMENTS.md` exists.
   * Identify overlap, conflicts, stale assumptions, and naming confusion.
   * Decide whether to preserve both documents with clear responsibility or propose one canonical document.

3. Align environment strategy.

   * Document local environment.
   * Document dev environment.
   * Document staging as missing/proposed if not implemented.
   * Document production as future/not active if not implemented.
   * Keep AWS current infrastructure as dev-only unless an approved decision says otherwise.
   * Keep Vercel limited to public landing page/front door only.

4. Review mock payment copy risk.

   * Search documentation and source text for terms such as:

     * pago exitoso
     * payment successful
     * success
     * paid
     * provider confirmed
     * completed
     * Prontipagos
     * card processor
   * Do not edit runtime files.
   * Document risky wording in `docs/MOCK_PAYMENT_COPY_REVIEW.md`.

5. Define future copy cleanup requirements.

   * Identify copy that should be changed in a future UI sprint.
   * Recommend safer wording for mock/dev screens.
   * Separate mock success from provider-confirmed success.
   * Keep real Tekae success blocked until provider evidence exists.

6. Update environment docs.

   * Clarify canonical environment strategy.
   * Align terminology.
   * Remove or mark stale assumptions only in docs touched.
   * Do not delete documents unless explicitly approved.

7. Update planning docs.

   * Update `planning/RISKS.md` with environment confusion and mock success copy risks.
   * Update `planning/QUESTIONS.md` with open environment/copy cleanup questions.
   * Update `planning/STATE.md` with Sprint 013 active/in progress.

8. Validate scope control.

   * Confirm no mobile runtime changes.
   * Confirm no backend runtime changes.
   * Confirm no migrations changed.
   * Confirm no .env files changed.
   * Confirm no infra/deployment behavior changed.
   * Confirm no Tekae runtime enabled claims were introduced.

## Validation Plan

Run documentation-safe checks only:

* git status --short
* git diff --name-only
* git diff --check
* search for `docs/ENVIRONMENT.md`
* search for `docs/ENVIRONMENTS.md`
* search for `pago exitoso`
* search for `payment successful`
* search for `paid`
* search for `Prontipagos`
* search for `TEKAE_ENABLED=true`
* search for risky claims that Tekae runtime is enabled
* confirm no changes under backend runtime directories
* confirm no changes under mobile runtime directories
* confirm no migrations changed
* confirm no .env changed
* confirm no infra/deployment behavior changed

## Expected Completion Report

After execution, report:

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
