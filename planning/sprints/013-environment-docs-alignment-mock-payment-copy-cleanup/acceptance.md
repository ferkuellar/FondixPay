# Sprint 013 — Environment Docs Alignment & Mock Payment Copy Cleanup Acceptance Criteria

Sprint 013 is complete only when all applicable criteria below are satisfied.

## Environment Documentation

* `docs/ENVIRONMENT.md` is reviewed.
* `docs/ENVIRONMENTS.md` is reviewed if it exists.
* Conflicts between environment docs are identified.
* Canonical environment documentation strategy is documented.
* Local environment behavior is documented or confirmed.
* Dev environment behavior is documented or confirmed.
* Staging status is documented as implemented, proposed, or missing.
* Production status is documented as implemented, proposed, or missing.
* AWS current infrastructure is documented as dev-only unless an approved decision says otherwise.
* Vercel remains documented as public landing/front door only.

## Mock Payment Copy Review

* Mock/dev payment success copy is reviewed through documentation-safe search.
* Risky wording is listed in `docs/MOCK_PAYMENT_COPY_REVIEW.md` or an equivalent doc.
* Future UI copy changes are documented without modifying mobile runtime.
* Mock success is clearly distinguished from provider-confirmed success.
* Tekae provider-confirmed success remains blocked pending official provider evidence.

## Provider / Payment Safety

* Tekae remains blocked until Sprint 011 readiness passes.
* FONDIXPAY remains documented as not fintech.
* Prontipagos remains removed.
* No documentation reintroduces old provider behavior as active.
* No wording claims real payment execution is enabled.

## Scope Control

* No mobile runtime files are modified.
* No backend runtime files are modified.
* No migrations are created or modified.
* No endpoints are created or modified.
* No webhooks are created or modified.
* No credentials are configured.
* No `.env` files are modified.
* No deployment behavior changes.
* No Terraform/infra behavior changes.
* No real payment execution is added.

## Planning Updates

* `planning/STATE.md` reflects Sprint 013 active/in progress/completed as appropriate.
* `planning/RISKS.md` includes relevant environment/copy risks.
* `planning/QUESTIONS.md` includes unresolved environment/copy questions.
* Sprint 011 remains recognized as the external Tekae contract readiness gate.
* Sprint 012 remains recognized as dev readiness documentation complete if already completed.

## Validation

* `git status --short` is run.
* `git diff --name-only` is run.
* `git diff --check` is run.
* Searches for risky payment/provider copy are run.
* Searches for stale Prontipagos references are run.
* Searches for Tekae runtime enabled claims are run.
* Checks confirm no runtime/backend/mobile/migration/env/infra files changed.

## Completion Standard

Sprint 013 may be marked complete only if the environment documentation is clearer, risky mock payment copy is documented for future cleanup, and no runtime or deployment behavior has changed.
