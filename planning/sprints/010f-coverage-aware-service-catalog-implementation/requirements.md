# Phase 10F Requirements - Coverage-Aware Service Catalog Implementation

## Goal

Implement a conservative coverage-aware service catalog for FondixPay without enabling real payments or real Prontipagos integration.

## Requirements

- Create backend service catalog module.
- Store categories, catalog items, state coverage, provider capability, and source metadata.
- Seed coverage reference data safely from approved map/Excel concepts.
- Keep every seeded service non-payable by default.
- Expose `/service-catalog` for mobile-payable services only.
- Expose `/coverage-map` as reference-only public coverage.
- Expose admin catalog read/update endpoints with RBAC.
- Connect mobile Add Service flow to the payable catalog.
- Keep landing map as commercial/reference layer.
- Add tests for payable rules and reference-only coverage.
- Update AXON-AI docs and planning.

## Non-Goals

- No real Prontipagos calls.
- No provider sync jobs.
- No real money movement.
- No card processor changes.
- No production enablement.
- No marking CFE/Telmex/Telcel or any seed service as payable without provider confirmation.

