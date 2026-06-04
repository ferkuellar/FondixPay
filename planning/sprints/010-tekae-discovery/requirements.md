# Sprint 010 — Tekae Discovery Requirements

## Objective

Define the approved Tekae integration model for FONDIXPAY before any implementation.

FONDIXPAY must integrate Tekae as the approved payment/service capability provider without positioning FONDIXPAY as a fintech and without building production payment code prematurely.

## Context

- Prontipagos is permanently removed.
- Tekae is the approved provider.
- FONDIXPAY is not a fintech.
- FONDIXPAY is a mobile/service platform that uses Tekae payment/service capabilities.
- Mobile app React Native + Expo already works.
- Backend FastAPI + Alembic is being stabilized.
- Current Tekae documentation describes SSO into Tekae Business responsive platform.

## In Scope

- Audit Tekae documents.
- Define App → Backend → Tekae flow.
- Define security boundaries.
- Define internal session and transaction states.
- Identify webhook gaps.
- Define reconciliation requirements.
- Define backend integration responsibilities.
- Define mobile UX requirements for Tekae launch.
- Define open questions for Tekae.
- Define acceptance criteria for future implementation sprint.

## Out of Scope

- No production code.
- No database migrations.
- No Tekae credential configuration.
- No real payment execution.
- No frontend WebView implementation.
- No webhook endpoint implementation.
- No production deployment.
- No financial/legal claims that FONDIXPAY is a fintech.

## Functional Requirements

FR-001: Backend must be the only component allowed to generate Tekae SSO sessions.

FR-002: Mobile app must request a Tekae session from FONDIXPAY backend, not from Tekae directly.

FR-003: Backend must create an internal Tekae session record before requesting Tekae token generation.

FR-004: Backend must support Tekae SSO parameters:

- UserCustomer
- uid
- password
- redirect
- menu
- categoria
- carrier
- blockview

FR-005: Backend must map FONDIXPAY categories to Tekae menu values:

- null = Home
- "1" = Tiempo Aire
- "2" = Pago de Servicios
- "3" = Entretenimiento

FR-006: Backend must return only the minimum launch payload to mobile:

- internal session ID
- Tekae URL
- expiration timestamp
- launch mode

FR-007: FONDIXPAY must not mark payment as successful only because Tekae was opened.

FR-008: FONDIXPAY must support unknown/pending provider outcome states.

FR-009: Admin/support must eventually see Tekae sessions, user, timestamps, status, and reconciliation status without seeing secrets.

FR-010: Reconciliation requirements must be documented before implementation.

## Non-Functional Requirements

NFR-001: Tekae credentials must never be exposed to frontend or committed to repository.

NFR-002: Tekae tokens and full URLs must be redacted in logs.

NFR-003: Every Tekae session attempt must generate an audit event.

NFR-004: Token TTL must respect Tekae’s 20-minute expiration.

NFR-005: Production architecture must account for Tekae VPN/VPC requirement.

NFR-006: Integration must be idempotency-aware.

NFR-007: Errors shown to users must be safe, short, and non-technical.

NFR-008: Webhook handling, once available, must be signature-verified and idempotent.

## Business Rules

BR-001: FONDIXPAY is not the payment processor.

BR-002: Tekae is the approved provider.

BR-003: FONDIXPAY must describe itself as a platform/app using Tekae capabilities.

BR-004: Payment confirmation must come from Tekae evidence, not mobile UI assumption.

BR-005: Unknown outcomes must route to pending confirmation/manual review.

BR-006: No real payment implementation until Tekae answers webhook, reconciliation, and production connectivity questions.
