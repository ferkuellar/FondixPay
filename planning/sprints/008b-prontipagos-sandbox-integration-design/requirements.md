# Sprint 008B Requirements

## Goal

Design the future Prontipagos sandbox integration as the service-payment aggregator leg for FondixPay without making provider calls, moving money, or implementing runtime changes.

## Required Outcomes

- Keep the user-facing payment model card-only.
- Keep card processor and Prontipagos as separate integrations.
- Document catalog, reference validation, amount lookup, execution, status, receipt, reconciliation, security, audit, idempotency, and operations design.
- Create status/error mapping placeholders until Prontipagos documentation is confirmed.
- Update AXON-AI state, roadmap, risks, decisions, validation, security, operations, API, data model, UX, card design, and payment state docs.

## Out Of Scope

- Real Prontipagos API calls or credentials.
- Real or sandbox service payments.
- Card processor implementation.
- Productive DB model or mobile runtime changes.
- Production readiness claims.

