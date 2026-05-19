# Durable Decisions

Updated: 2026-05-19

## ADR-001 - Treat FondixPay as a Production-Intended Mobile Product

Decision: FondixPay will be governed as a production-intended mobile application, even though the current implementation is MVP mock/dev.

Rationale: Financial product behavior requires early discipline around scope, auditability, security, validation, and future operations.

## ADR-002 - Preserve Current Stack

Decision: Keep Expo/React Native/TypeScript for mobile and FastAPI/SQLAlchemy for backend during Phase 1.

Rationale: The repo already has working initial implementation. This phase is governance-only.

## ADR-003 - Current Payment Flow Is Mock/Dev

Decision: The current payment, receipt, and provider flows are mock/dev only.

Rationale: No real provider, ledger, reconciliation, audit log, or compliance controls are implemented.

## ADR-004 - No Real Payments Before Hardening

Decision: Real payments will not be connected until architecture, security, auditability, validation, and provider selection are completed.

Rationale: Real money movement without controls creates unacceptable product, legal, and operational risk.

## ADR-005 - Audit Required for Future Financial Actions

Decision: Every future action that alters balance, payment, receipt, service state, provider response, or administrative state must produce an audit log.

Rationale: Financial actions must be traceable and reviewable.

## ADR-006 - No Real Secrets in Repo

Decision: Real credentials, API keys, tokens, passwords, private URLs, and signing material must not be committed.

Rationale: Secret exposure creates direct security and compliance risk.

## ADR-007 - AXON-AI Architect / Builder Is Official

Decision: AXON-AI Architect / Builder is the official project methodology.

Rationale: The handoff must be durable and file-based, not dependent on chat context.

## ADR-008 - UI/UX Reference

Decision: Future UI/UX work must align with `fondix.png` if that asset is added under the repo or `references/`.

Rationale: Visual direction must be explicit before production polish.

Current asset status: `fondix.png` was not found in this repo during Phase 1 inspection.
