# Provider Boundaries

This document defines the architectural boundary between FONDIXPAY and Tekae.

## Core Rule

Tekae is the approved payment provider. FONDIXPAY is not a fintech and does not build payment infrastructure. FONDIXPAY only embeds Tekae payment capabilities.

## Tekae Owns

- Payment processing.
- Transaction authorization.
- Payment method handling.
- Provider-side transaction execution.
- Payment infrastructure.
- Provider settlement and provider-side payment state.
- Any card handling, vaulting, tokenization, or acquiring capability exposed by Tekae.

## FONDIXPAY Owns

- Mobile and web UX.
- User authentication into FONDIXPAY.
- Backend generation of Tekae SSO tokens after the contract is approved.
- CRM and support workflows.
- Notifications and user-facing status copy.
- Receipt/history presentation based on approved Tekae evidence.
- Operational analytics and audit references that do not become a ledger balance.

## Forbidden FONDIXPAY Scope

FONDIXPAY must never implement:

- Card vault.
- Wallet.
- Ledger balance.
- Tokenization.
- Acquiring.
- SPEI processor.
- Banking core.

## Backend Boundary

The backend may broker access to Tekae by generating SSO tokens and enforcing FONDIXPAY authentication, authorization, audit, and redaction rules.

The backend must not:

- Accept or store PAN, CVV, card tokens, or raw payment credentials.
- Tokenize cards.
- Hold stored value or expose wallet balance.
- Acquire transactions.
- Process SPEI.
- Maintain a banking ledger or ledger balance.
- Reconstruct Tekae payment rails in FONDIXPAY code.

## Implementation Rule

If a feature requires FONDIXPAY to duplicate Tekae functionality, the feature is out of scope. Escalate to planning and update architecture documentation instead of writing application code.
