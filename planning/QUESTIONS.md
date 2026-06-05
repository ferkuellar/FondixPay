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
- Which document should become the canonical environment source: `docs/ENVIRONMENTS.md`, `docs/ENVIRONMENT.md`, or both with different purposes? Sprint 018 answer: `docs/ENVIRONMENTS.md` is canonical; `docs/ENVIRONMENT.md` is a pointer.
- Which mock payment success screens or copy blocks must be reviewed before real Tekae runtime is approved?
- Which historical Prontipagos/card processor docs should be archived, labeled historical, or cleaned in a future documentation cleanup sprint?
- Which secret scanning command or tool should become the standard local validation step?
- Which owner approves transition from mock/provider-disabled mode to Tekae sandbox mode after Sprint 011 passes?
- Which support channel should users see while Tekae remains blocked and payment runtime is unavailable?
- Should `.env.example` remove historical Prontipagos/card placeholders in a future cleanup sprint, or keep them labeled as superseded until runtime cleanup?

## Sprint 013 Environment And Mock Copy Questions

- Should `docs/ENVIRONMENT.md` remain the canonical current-state environment source while `docs/ENVIRONMENTS.md` remains the tier matrix? Sprint 018 answer: no. `docs/ENVIRONMENTS.md` is canonical; `docs/ENVIRONMENT.md` is a pointer.
- Should future staging target ECS/RDS, optional EC2, or another lower-cost design after dev apply is validated?
- Which exact mobile payment copy should be changed first: success screen title, service-card status, transaction history status, receipt detail status, or WhatsApp receipt messaging?
- Should future cleanup change only user-facing copy, or also internal mock status names such as `paid`, `succeeded`, `confirmed`, and `PaymentSuccess`?
- Should historical Prontipagos references in README, older planning, and CRM/Admin labels be archived, relabeled, or removed in a dedicated cleanup sprint?
- Should the historical WhatsApp template name `fondix_pago_exitoso` be renamed after the official Tekae receipt/comprobante model is approved?

## Sprint 016B Visual QA Questions

- Should `ReceiptDetail` replace visible internal English demo labels such as `Prueba: Succeeded` and `Estado Demo: Mock Succeeded` with Spanish user-facing labels such as `Prueba registrada` and `Estado demo: registrado` before a user pilot? Sprint 017 answer: yes. The visible ReceiptDetail proof labels were polished to Spanish demo copy before pilot, without renaming internal states.

## Sprint 018 Environment Strategy Questions

- What cloud provider/account will host backend DEV, STAGING, and PROD?
- Will STAGING use Tekae sandbox credentials, and who owns obtaining them?
- What is the final production domain/API domain strategy?
- What secrets manager will be used for STAGING and PROD?
- What database platform will be used for each environment?
- What mobile build profiles will map to DEV/STAGING/PROD?
- What observability/logging provider will be used?
- What is the rollback strategy for backend and mobile releases?
- What is the production support owner and escalation path?

## Sprint 019 Tekae Readiness Questions

- Who owns obtaining Tekae sandbox credentials and swagger/test URL?
- What are the exact Tekae sandbox base URLs?
- What are the exact Tekae production base URLs?
- What is the approved mobile rendering strategy: WebView, browser, redirect, embed, or another option?
- What secure network path is required for PROD token generation: VPN, VPC, private connectivity, allowlist, or other?
- Which `UserCustomer` identifier should FONDIXPAY send, and what PII constraints apply?
- What exact Tekae error response formats must be mapped?
- What timeout and retry recommendations does Tekae provide for `cipherData` and `generateTokenCiphered`?
- Does FONDIXPAY need to store provider session metadata, and if yes which redacted fields?
- Which audit fields are required for Tekae session creation attempts?
- What support process applies to failed, expired, duplicate, maintenance, unavailable, or invalid-config sessions?
- Which branding/personalization settings should FONDIXPAY request: colors, logo, banners, chat URL, FAQ link, promo field, cobranding receipt?
- Is the Tekae receipt/comprobante sufficient, or does FONDIXPAY also need an internal receipt/proof?
- How should catalog coverage by state, national service, `menu`, `categoria`, and `carrier` map to Tekae launch parameters?

## Sprint 020 Service Coverage And Geolocation Questions

- What source of truth will define service coverage by state?
- Who owns Tekae catalog normalization?
- Does Tekae provide explicit state coverage per service, or must FONDIXPAY define it?
- Should unsupported states show national services only or block service browsing?
- Should users be allowed to manually override GPS state? Sprint 020 design answer: yes; implementation approval remains future.
- Should selected state be stored locally only or in backend profile?
- What reverse geocoding provider will be used?
- What location permission copy is approved?
- Should city-level filtering be required later for metro areas like Torreon/Gomez Palacio?
- How often will catalog coverage be reviewed or synchronized?
- How will national services be tested in STAGING?
- Should future APIs expose only `MX-*` codes, or accept both canonical `MX-*` and existing short codes during migration?

## Sprint 021 Tekae Catalog Normalization Questions

- Is `C:\Users\ferna\OneDrive\Escritorio\FondixPayDocs\fondixpay_tekae_catalog_normalized.xlsx` the official Tekae catalog file, or a FONDIXPAY-normalized planning artifact?
- What are the official Tekae catalog columns and stable identifiers?
- Is `tekae_product_number` globally stable and unique enough for provider mapping?
- Does Tekae provide explicit state coverage per service?
- Who owns manual coverage assignment when Tekae coverage is missing?
- Is `MX-ALL` the approved stored representation for national services, or should `NATIONAL` be canonical with `MX-ALL` as an API convention?
- What internal categories should FONDIXPAY expose to users at launch?
- Should FONDIXPAY store logo/icon mapping per service?
- How often will the Tekae catalog be refreshed?
- What is the source of truth for catalog versioning?
- What validation threshold is required before exposing normalized services in STAGING?
- Should future APIs expose only `MX-*` codes, or accept both canonical `MX-*` and current short codes during migration?

## Sprint 026 Mobile Dependency And Tekae NDA Questions

- What Expo SDK version should be the next approved mobile dependency remediation target?
- Should mobile dependency audit become a CI warning, a blocking release gate, or a manual release checklist item?
- Who approves Expo/React Native upgrade risk before changing package versions?
- Which Tekae materials may be summarized as derived non-sensitive notes, and who approves those summaries?
- What secure external location is the official source of truth for the Tekae NDA, manuals, real catalog files, and other confidential provider materials?
- Should confidential Tekae material access be logged or reviewed before STAGING/PROD implementation work?

## Sprint 027 Public Catalog Coverage API Questions

- Should the future implementation add `GET /api/catalog/services?state=MX-CHH` or evolve the existing `GET /service-catalog?state_code=MX-CHH` endpoint?
- What exact database migration will replace current short `state_code` storage with canonical `MX-*` storage?
- Who approves the removal of legacy short-code input compatibility after migration?
- What final FONDIXPAY service category taxonomy should be public at launch?
- What STAGING validation threshold is required before mobile stops depending on local/demo coverage metadata?
- Which support/admin view should explain hidden service reasons without exposing Tekae provider metadata?
