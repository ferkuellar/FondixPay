# Open Questions

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
