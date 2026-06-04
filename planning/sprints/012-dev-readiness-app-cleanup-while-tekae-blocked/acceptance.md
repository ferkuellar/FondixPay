# Sprint 012 — Dev Readiness & App Cleanup While Tekae Is Blocked Acceptance Criteria

Sprint 012 is complete only when the criteria below are satisfied.

## Dev Readiness

* docs/DEV_READINESS.md exists or equivalent existing documentation is updated.
* Backend local readiness is documented.
* Docker/backend readiness is documented.
* Database/Alembic readiness is documented if applicable.
* Mobile Expo readiness is documented.
* CI/typecheck/lint/test readiness is documented.
* Known internal dev blockers are listed.

## Environment Strategy

* docs/ENVIRONMENT.md exists or equivalent existing documentation is updated.
* Required environment placeholders are documented without secrets.
* Local/dev/staging/production separation is documented.
* Tekae disabled/blocking flags are documented.
* Provider mode/mock mode distinction is documented.
* No real credentials are stored.

## Infrastructure Direction

* AWS dev/staging direction is documented.
* Backend hosting target is documented as proposed or confirmed.
* VPC/public/private boundary is documented at a high level.
* No AWS resources are created.
* Landing page remains documented as public commercial front door outside core payment/runtime backend if still hosted on Vercel.

## Mock / Provider Boundary

* Mock/dev payment behavior is clearly documented.
* Real Tekae runtime behavior remains blocked.
* Payment success copy risks are documented.
* Provider-confirmed success is distinguished from mock success.
* Tekae contract readiness remains required before runtime.

## Security

* Secret hygiene checks are documented.
* Token/credential redaction expectations are documented.
* No secrets or provider credentials are added.
* No full Tekae tokens/URLs are documented as reusable runtime values.
* No frontend credential exposure is allowed.

## Documentation Cleanup

* Historical Prontipagos/card processor references are identified as debt or cleaned only in files touched.
* No broad destructive documentation cleanup is performed.
* Durable decisions remain preserved:

  * Prontipagos removed.
  * Tekae approved.
  * FONDIXPAY not fintech.
  * Tekae runtime blocked until readiness passes.

## Scope Control

* No backend runtime payment code changed.
* No mobile runtime payment code changed.
* No migrations created.
* No webhook endpoints created.
* No real payment endpoints created.
* No credentials configured.
* No production deployment behavior changed.
* No unconfirmed Tekae behavior presented as fact.

## Planning Updates

* planning/STATE.md reflects Sprint 012 active/in progress/completed as appropriate.
* planning/RISKS.md includes relevant dev readiness and blocked-runtime risks.
* planning/QUESTIONS.md includes unresolved internal readiness questions.
* Sprint 011 remains recognized as external Tekae contract closure gate.

## Completion Standard

Sprint 012 may be marked complete only if FONDIXPAY is better prepared for future Tekae implementation while still preserving the hard block against real provider runtime until Sprint 011 passes.
