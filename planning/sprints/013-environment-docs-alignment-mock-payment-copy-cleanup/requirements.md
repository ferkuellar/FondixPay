# Sprint 013 — Environment Docs Alignment & Mock Payment Copy Cleanup

## Objective

Align FONDIXPAY environment documentation and identify mock/dev payment copy that could be confused with real provider-confirmed payment success, without changing runtime behavior.

This sprint reduces ambiguity created by overlapping environment documentation and prepares a safe future UI cleanup sprint by documenting risky mock payment wording before any mobile runtime changes are made.

## Context

Sprint 010 documented Tekae Discovery and confirmed that the currently documented Tekae model is SSO launch into Tekae responsive platform.

Sprint 011 remains the external Tekae contract closure and runtime readiness gate.

Sprint 012 documented dev readiness and environment strategy while Tekae remains blocked. During Sprint 012, a documentation gap was identified: `docs/ENVIRONMENT.md` and `docs/ENVIRONMENTS.md` may not be aligned, and mock payment success copy may imply production behavior if not carefully documented.

## In Scope

* Review `docs/ENVIRONMENT.md` and `docs/ENVIRONMENTS.md`.
* Identify conflicts, duplication, outdated assumptions, or unclear environment definitions.
* Align documentation for local, dev, staging, and production environments.
* Preserve AWS infrastructure as dev-only unless otherwise approved.
* Preserve Vercel as public landing page/front door only.
* Document that FONDIXPAY core runtime, payment execution, reconciliation, provider credentials, secrets, and backend financial operations do not live in the landing page.
* Review app/payment copy references in documentation or source text search only.
* Identify copy such as “payment successful”, “pago exitoso”, “paid”, or equivalent mock/dev success wording that could be misunderstood.
* Document future UI copy changes required.
* Document that mock success is not provider-confirmed success.
* Keep Tekae runtime blocked until Sprint 011 readiness passes.
* Keep FONDIXPAY positioned as not fintech.
* Keep Prontipagos removed.
* Update planning risks/questions/state as needed.

## Out of Scope

* No mobile runtime changes.
* No backend runtime changes.
* No code edits.
* No migrations.
* No endpoints.
* No webhooks.
* No credentials.
* No .env changes.
* No production deployment changes.
* No AWS resource creation.
* No Vercel deployment changes.
* No real payment execution.
* No Tekae runtime implementation.
* No broad destructive documentation cleanup.
* No deletion of historical references unless explicitly approved.

## Functional Requirements

FR-013-001: The sprint must identify whether both `docs/ENVIRONMENT.md` and `docs/ENVIRONMENTS.md` exist.

FR-013-002: The sprint must document which environment document is canonical or propose one canonical document without deleting the other unless explicitly approved.

FR-013-003: The sprint must align environment terminology for local, dev, staging, and production.

FR-013-004: The sprint must document that current AWS infrastructure is dev-only unless otherwise approved.

FR-013-005: The sprint must document that Vercel is limited to landing page/public front door behavior.

FR-013-006: The sprint must identify mock/dev payment success copy that could imply real payment confirmation.

FR-013-007: The sprint must document future UI copy changes without modifying mobile runtime.

FR-013-008: The sprint must preserve the rule that real provider-confirmed payment success requires Tekae evidence.

FR-013-009: The sprint must document remaining Prontipagos/card processor references as debt or clarify them only in touched documentation.

FR-013-010: The sprint must update planning files with risks/questions/state as needed.

## Non-Functional Requirements

NFR-013-001: No runtime behavior may change.

NFR-013-002: No secrets may be added.

NFR-013-003: Documentation must distinguish mock/dev/demo behavior from production/provider-confirmed behavior.

NFR-013-004: Documentation must not claim Tekae runtime is enabled.

NFR-013-005: Documentation must not position FONDIXPAY as a fintech.

NFR-013-006: Documentation must not reintroduce Prontipagos as an active provider.

NFR-013-007: Documentation must avoid expanding infrastructure complexity without approval.

## Business Rules

BR-013-001: Prontipagos remains permanently removed.

BR-013-002: Tekae remains the approved provider.

BR-013-003: Tekae runtime remains blocked until Sprint 011 contract readiness passes.

BR-013-004: FONDIXPAY is not a fintech.

BR-013-005: Mock/dev success screens are not evidence of real payment success.

BR-013-006: Provider-confirmed success must come from official Tekae evidence, not local mock state.

BR-013-007: Landing page must not host core payment/runtime/financial/reconciliation logic.

## Deliverables

* Populated Sprint 013 planning files.
* Environment documentation alignment plan.
* Mock payment copy cleanup plan.
* Future UI copy change list.
* Updated planning risks/questions/state during execution.

## Implementation Gate

Sprint 013 does not authorize mobile runtime edits, backend runtime edits, payment runtime implementation, provider integration, or deployment changes.
