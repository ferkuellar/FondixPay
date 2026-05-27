# Phase 10E - Coverage-Aware Service Catalog Design Requirements

## Goal

Design the coverage-aware service catalog that separates public/commercial coverage from mobile-payable availability.

## Required Inputs

- External design-system map reference: `FONDIX PAY Design System/assets/coverage-map.html`.
- Coverage workbook: `FONDIXPAY_Cobertura_Por_Estado.xlsx`.
- Current backend `service_providers` mock catalog.
- Current mobile service add/payment flow.
- Public landing coverage data and constraints.

## In Scope

- Service catalog model design.
- Coverage status design.
- Provider capability design.
- Landing, mobile, and CRM visibility rules.
- Future APIs, audit events, operations, validation, and backlog.

## Out of Scope

- Runtime implementation.
- Real Prontipagos integration.
- Real payment enablement.
- Coverage sync jobs.
- Mobile payment flow changes.
- Map replacement or visual refactor.

## Acceptance

- Unconfirmed services are not designed as payable.
- `available` is the only payable status.
- Landing coverage is reference/commercial only.
- Mobile catalog is stricter than landing.
- Provider capability is required before payment execution.
- Production remains blocked.
