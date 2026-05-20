# UX/Product Audit

Updated: 2026-05-20

## Executive Summary

FondixPay is visually moving in the right direction for a mobile-first service payment app. The current UI system is coherent enough for internal validation without real money.

The product is not ready for commercial production or real payments. The main blockers are not visual polish; they are product trust, payment transparency, recovery, and fintech-readiness controls.

Commercial production remains **BLOCKED** until the critical UX/Product risks are resolved and aligned with ledger, audit, auth, and provider decisions.

## General Diagnosis

The app already communicates a simple flow: open the app, see pending services, pay, and receive proof. That is the right product direction.

The gap is that a real payment experience needs explicit fee disclosure, explicit payment method ownership, clear failure handling, and user trust signals before money movement. Without those elements, users may not understand what they are paying, how they are paying, what happens if something fails, or how to get help.

## Current Level

| Area | Level | Notes |
| --- | --- | --- |
| Visual | Solid | Mobile-first screens and component system are coherent for MVP validation. |
| Product | Incomplete | Payment method, fee transparency, support, and recovery paths are not complete. |
| Fintech readiness | Not ready | Ledger, audit, payment idempotency, fee disclosure, and provider compliance are pending. |
| Production readiness | Blocked | Commercial launch with real money is not acceptable yet. |

## Top 5 Critical Findings

### 1. Fee Is Not Visible Before Payment Confirmation

FondixPay commission must be visible before payment confirmation. The user must see service amount, FondixPay fee, and final total before confirming. The same values must be reflected in the confirmation and receipt.

Impact: surprise fees, chargeback/reclamation risk, user distrust, and commercial launch blocker.

### 2. OTP Mockup Shows 4 Digits While Code Uses 6

The codebase uses 6-digit OTP (`123456` in development). Any 4-digit OTP mockup is obsolete. For a fintech-like flow, 4 digits is not acceptable as the product direction.

Impact: inconsistent product specification, weaker perceived security, and implementation/design drift.

### 3. Payment Method Flow Is Missing

The UI may show a card or selected method, but there is no complete add/select/manage payment method flow. Real payment screens cannot assume a preselected method without the user having an explicit setup path.

Impact: conversion risk, user anxiety, support load, and real-payment blocker.

### 4. Payment Error and Recovery Path Is Missing

Real payment flow must support clear failed-payment states, retry, change method, and support. It must tell the user whether a charge happened or not.

Impact: double-payment attempts, support escalation, financial ambiguity, and trust loss.

### 5. Trust Signals Are Insufficient

Splash/onboarding should communicate real trust requirements: who operates the service, how data is protected, when fees are shown, how support works, and what security controls exist. Trust signals cannot be decorative only.

Impact: low confidence for non-bancarized or cautious users, lower activation, and higher support burden.

## Medium Problems

- Support/reclamation flow is not defined.
- Payment method setup could create abandonment if it is introduced without clear copy and states.
- History needs filters and clearer status separation before scale.
- Receipts need stronger proof semantics: view, download, share, and verification context.
- Long flows like add service need stepper/progress clarity.
- Service list needs search and an "other" path for growth.

## Minor Problems

- Some microcopy is still generic and should be tied to payment certainty.
- Empty/loading/error states exist visually, but product-specific guidance can be stronger.
- Onboarding trust copy should be tested with users 30-65.
- Receipt copy should distinguish mock/dev receipt from real proof before provider integration.

## Recommendations

1. Keep internal validation without real money moving.
2. Resolve fee disclosure before any real payment provider work.
3. Keep OTP design at 6 digits and remove 4-digit references from future design handoffs.
4. Design payment method setup/selection before enabling real payments.
5. Design payment failure and recovery paths before provider integration.
6. Define trust-signal copy as product requirements, not visual decoration.
7. Tie all payment-related UX to future audit events and ledger entries.

## Release Recommendation

| Release Type | Recommendation | Conditions |
| --- | --- | --- |
| Commercial production | BLOCKED | Resolve critical UX/Product risks, ledger, audit, auth/session, provider, and compliance gates. |
| Closed beta | PASS WITH CONDITIONS | No real money unless critical payment UX risks and backend safety gates are closed. |
| Internal validation without real money | PASS | Continue mock/dev validation with explicit disclaimers. |

## Recommended Decision

Resolve the 5 critical UX/Product findings before the first real payment. No provider integration should start until fee transparency, payment method flow, payment recovery, trust signals, audit, and ledger foundations are accepted.
