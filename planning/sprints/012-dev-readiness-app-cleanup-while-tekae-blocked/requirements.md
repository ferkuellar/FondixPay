# Sprint 012 — Dev Readiness & App Cleanup While Tekae Is Blocked

## Objective

Prepare FONDIXPAY for future Tekae runtime integration while Tekae contract closure remains externally blocked.

This sprint improves internal development readiness, infrastructure clarity, environment hygiene, mock/provider separation, app copy safety, and documentation cleanup without implementing real Tekae runtime payment behavior.

## Context

Sprint 010 confirmed the current Tekae integration model as SSO launch into Tekae responsive platform.

Sprint 011 remains required for Tekae Contract Closure & Runtime Readiness Design, but it depends on Tekae providing missing technical and operational contract details.

While Sprint 011 is externally blocked, Sprint 012 advances safe internal work that does not depend on Tekae’s final API/webhook/reconciliation contract.

## In Scope

* Review and document current AWS dev infrastructure assumptions.
* Confirm where the FastAPI backend is expected to live during dev/staging.
* Confirm that the public landing page remains outside AWS if hosted on Vercel.
* Document environment variable placeholders without secrets.
* Review backend local/Docker readiness.
* Review CI/typecheck/lint readiness.
* Document mock provider vs real provider boundaries.
* Ensure Tekae remains blocked behind readiness/feature-gate rules.
* Review app/payment copy risks, especially screens that imply production payment success.
* Document cleanup approach for historical Prontipagos/card processor references.
* Document repo secret hygiene checks.
* Identify safe future implementation areas without executing them.

## Out of Scope

* No Tekae runtime implementation.
* No real payment execution.
* No real provider session creation.
* No webhook endpoint implementation.
* No transaction query implementation.
* No reconciliation implementation.
* No database migrations.
* No production deployment changes.
* No secrets or credentials.
* No AWS resource creation.
* No Vercel deployment changes.
* No mobile runtime payment behavior changes.
* No backend runtime payment behavior changes.

## Functional Requirements

FR-012-001: The sprint must document the current dev readiness status of backend, mobile, environment configuration, and CI.

FR-012-002: The sprint must document the intended backend hosting direction for dev/staging without provisioning infrastructure.

FR-012-003: The sprint must preserve the landing page as a public commercial front door hosted outside core payment/runtime infrastructure, currently assumed Vercel unless changed by decision.

FR-012-004: The sprint must define mock/dev provider boundaries versus real Tekae provider boundaries.

FR-012-005: The sprint must keep Tekae runtime blocked until Sprint 011 readiness passes.

FR-012-006: The sprint must document app copy/payment-state risks where mock “success” screens could be misread as production behavior.

FR-012-007: The sprint must document environment placeholder requirements without storing secrets.

FR-012-008: The sprint must document secret hygiene checks for the repo.

FR-012-009: The sprint must document historical Prontipagos/card processor cleanup debt without broad destructive cleanup.

FR-012-010: The sprint must identify the next safe implementation sprint only after dev readiness documentation is complete.

## Non-Functional Requirements

NFR-012-001: No production runtime behavior changes are allowed.

NFR-012-002: No secrets may be committed.

NFR-012-003: Existing architecture must not be expanded into unnecessary infrastructure complexity.

NFR-012-004: Documentation must distinguish dev/mock/demo states from production/provider states.

NFR-012-005: The sprint must keep FONDIXPAY positioned as a platform/app using Tekae capabilities, not as a fintech.

NFR-012-006: The sprint must preserve auditability and traceability of decisions.

## Business Rules

BR-012-001: Prontipagos remains permanently removed.

BR-012-002: Tekae remains the approved provider.

BR-012-003: FONDIXPAY is not a fintech.

BR-012-004: Mock/dev payment states must not be presented as real provider-confirmed payment success.

BR-012-005: Runtime provider execution remains blocked until Tekae contract readiness passes.

BR-012-006: Landing page must not host core transaction, payment, reconciliation, backend financial operation, secrets, or provider credential logic.

## Deliverables

* Populated Sprint 012 planning files.
* Future docs to create/update during execution:

  * docs/DEV_READINESS.md
  * docs/ENVIRONMENT.md
  * docs/DEPLOYMENT.md
  * docs/SECURITY.md
  * docs/ARCHITECTURE.md
  * docs/API.md
  * docs/TEKAE_RUNTIME_READINESS.md
  * planning/RISKS.md
  * planning/QUESTIONS.md
  * planning/STATE.md

## Implementation Gate

Sprint 012 does not authorize real Tekae runtime implementation.

The future runtime implementation sprint remains blocked until Sprint 011 contract readiness passes.
