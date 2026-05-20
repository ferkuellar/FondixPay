# Phase 5E — Payment Method UX Mock Implementation Requirements

## Goal
Implement a mobile-only mock/dev payment method UX so users can add, select, and change a simulated payment method before confirming a mock payment.

## In Scope
- Local Zustand payment method state.
- Payment methods screen.
- Add demo payment method screen.
- Confirmation screen selected method requirement.
- Service detail method status.
- Payment success and receipt method disclosure where viable.
- AXON-AI documentation updates.

## Out of Scope
- Real providers.
- Prontipagos integration.
- PAN/CVV capture or storage.
- Backend payment method models.
- Real charges, wallet, KYC, or reconciliation.

## Acceptance Summary
- No phantom payment method remains in the payment flow.
- Mock methods are explicitly labeled as demo and no real charge.
- Payment confirmation requires a selected method.
- Existing fee transparency remains visible.
