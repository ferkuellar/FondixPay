
# FONDIXPAY Harness System

Version: 3.0

Purpose:
Protect FONDIXPAY from scope creep, unsafe financial implementations, and architectural drift while embedding Tekae payment capabilities.

## Non-Negotiable Position

- FONDIXPAY is not a fintech.
- FONDIXPAY is not a bank.
- FONDIXPAY is not a wallet.
- FONDIXPAY is not a card processor, acquirer, SPEI processor, or banking core.
- Tekae is the approved payment provider.
- FONDIXPAY only embeds Tekae payment capabilities.

## Approved Harness Shape

- Mobile and web surfaces may expose FONDIXPAY UX around Tekae-approved payment flows.
- Backend may generate Tekae SSO tokens after an approved integration sprint defines the contract.
- Backend may store operational references needed for support, receipts, history, audit, and CRM visibility.
- Backend must not become the payment processor or financial source of truth.

## Forbidden Implementations

Never implement:

- Card vault.
- Wallet.
- Ledger balance.
- Tokenization.
- Acquiring.
- SPEI processor.
- Banking core.

## Builder Gate

Before implementing any payment-related behavior, confirm:

1. The sprint explicitly targets Tekae.
2. The Tekae contract is documented.
3. The work embeds Tekae capabilities instead of recreating them.
4. No forbidden implementation is introduced.
5. Secrets, provider credentials, and private URLs remain outside the repository.

If any condition fails, stop and update documentation or planning artifacts only.

## Related Documents

- `docs/PROVIDER_BOUNDARIES.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/integrations/TEKAE.md`
- `planning/TEKAE_DECISIONS.md`
