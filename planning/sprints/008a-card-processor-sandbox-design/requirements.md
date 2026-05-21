# Phase 8A Requirements - Card Processor Sandbox Design

## Goal

Design the future card processor sandbox integration for FondixPay without implementing charges, storing PAN/CVV, selecting a provider without evidence, or integrating Prontipagos.

## Required Outcomes

- Card processor and Prontipagos responsibilities are separated.
- Tokenization and PCI boundaries are explicit.
- Sandbox charge/auth flow, errors, idempotency, audit, webhooks, reconciliation, and production gates are documented.
- Future API and data model contracts are proposed only.
- Provider evaluation criteria and implementation backlog exist.

## In Scope

- Architecture documents.
- Security boundaries.
- Proposed card APIs, data entities, state machine, audit catalog, operations, UX, roadmap, risk, and validation updates.

## Out Of Scope

- Runtime code changes.
- Real provider or production secrets.
- Real or sandbox card charges.
- Prontipagos integration.
- Migrations or DB model changes.
