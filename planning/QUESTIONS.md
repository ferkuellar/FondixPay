# Open Questions

## Sprint 010 Tekae Discovery Questions

- What exact Tekae webhook events exist, if any?
- Does Tekae provide a transaction query API after SSO launch?
- What Tekae reconciliation or settlement reports are available?
- Which identifiers connect a FONDIXPAY Tekae session to a Tekae transaction?
- What are Tekae terminal success, failure, pending, canceled, timeout, and unknown states?
- What signature, replay protection, and idempotency requirements apply to Tekae callbacks or webhooks?
- What production VPN/VPC topology does Tekae require?
- What sandbox Swagger, base URL, and credentials are available?
- What is the supported token/session expiration behavior beyond the documented 20-minute TTL?
- Which Tekae errors are safe to show to users after translation?
- Which Tekae evidence is sufficient to mark a payment successful?
- Which Tekae evidence is sufficient to generate a receipt?
- What exact sandbox URL should FONDIXPAY use?
- Which Tekae provider transaction/reference fields must FONDIXPAY persist safely?
- What receipt/comprobante retrieval rules does Tekae support after SSO launch?
- Which fields connect a Tekae receipt/comprobante to a FONDIXPAY session, user, service, and payment record?

## Sprint 010 Documentation Debt Follow-Up

- Clean or archive historical Prontipagos/card-processor references that predate the Tekae provider decision.
- Preserve the durable decision that Prontipagos is permanently removed while avoiding broad historical cleanup inside Sprint 010.

## Historical Questions

The following questions predate Sprint 010 and may need cleanup because Prontipagos/card-processor assumptions are superseded by Tekae.

- Will FondixPay only pay services, or will it also keep demo account/balance UX for testing without making it a payment method?
- Will the MVP handle only direct card payments while balance remains demo/non-payable?
- Which card processor will be used in Mexico?
- Which tokenization and provider-vault model will the card processor require?
- Which card authorization and 3DS/auth challenge paths are required?
- Is KYC required?
- What transaction limits apply?
- Which administrative users will exist at launch?
- Which actions require human approval?
- What personal data will be stored?
- What is the first publishable mobile version?
- Will receipts need fiscal, provider, or internal verification semantics?
- What retention policy applies to payment, receipt, and audit records?
# Phase 5F Payment Recovery Questions

- What exact payment states does Prontipagos return?
- Does Prontipagos support later status lookup by provider reference?
- Does Prontipagos return an external folio?
- Does Prontipagos support reversals or refunds?
- How long does real confirmation usually take?
- Which provider errors are retry-safe?
- Which provider errors require support/manual review?
- What data does support need for a payment clarification?
- What refund/reversal policy will FondixPay adopt?
- Which notifications should be sent to the user during pending/recovery states?
- What SLA should support use for `paid_pending_receipt`?
- Which states should block a new payment for the same service reference?

# Phase 10X.1 Chatbot Questions

- Who approves public chatbot FAQ, intent, and knowledge-base content before production publication?
- Which official authenticated support channel should the public chatbot route private cases to at launch?
- Should the chatbot public endpoint use IP/session rate limiting in app middleware, edge middleware, or both?
- Will an AI provider be approved later, or should Phase 10X.2 remain FAQ/rule-only?
- What retention period applies to masked chatbot conversations and fallback records?

## Sprint 012 Dev Readiness Internal Questions

- Should the first shared dev backend run only through local/Docker plus CI, or should the optional AWS dev EC2 host be enabled later?
- If AWS dev compute is enabled, which CIDRs may access SSH and backend port `8000`?
- Should future staging use ECS/RDS as described in older environment strategy, or a cheaper intermediate design?
- Which document should become the canonical environment source: `docs/ENVIRONMENTS.md`, `docs/ENVIRONMENT.md`, or both with different purposes?
- Which mock payment success screens or copy blocks must be reviewed before real Tekae runtime is approved?
- Which historical Prontipagos/card processor docs should be archived, labeled historical, or cleaned in a future documentation cleanup sprint?
- Which secret scanning command or tool should become the standard local validation step?
- Which owner approves transition from mock/provider-disabled mode to Tekae sandbox mode after Sprint 011 passes?
- Which support channel should users see while Tekae remains blocked and payment runtime is unavailable?
- Should `.env.example` remove historical Prontipagos/card placeholders in a future cleanup sprint, or keep them labeled as superseded until runtime cleanup?
