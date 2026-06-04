# Mock Payment Copy Review

Status: Sprint 013 documentation/review only. No runtime files were modified.

This review records mock payment wording that could be misunderstood as real provider-confirmed success. It does not change mobile, backend, admin, endpoint, webhook, migration, credential, `.env`, or infrastructure behavior.

## Scope

Reviewed documentation and source text for wording around:

- `pago exitoso`
- `payment successful`
- `paid`
- `pagado`
- `success`
- `Prontipagos`
- Tekae runtime-enabled claims

FONDIXPAY remains not fintech. Tekae remains the approved provider. Tekae runtime remains blocked until Sprint 011 contract readiness passes. Prontipagos remains permanently removed.

## Findings

| Area | Current wording or pattern | Risk | Future recommendation |
| --- | --- | --- | --- |
| `mobile/src/screens/payments/PaymentSuccessScreen.tsx` | Primary success screen uses wording such as `Ya quedo pagado`, `Total pagado`, and saved-payment success language. | SEV-1 | Replace user-facing mock success language with `Simulacion registrada`, `Pago demo guardado`, or `Total de la simulacion` until provider-confirmed evidence exists. |
| `mobile/src/screens/payments/PaymentSuccessScreen.tsx` | WhatsApp receipt copy can imply a receipt will be sent after success. | SEV-2 | Clarify that any current receipt is mock/dev and non-provider-confirmed. Future WhatsApp copy must depend on provider-confirmed receipt rules. |
| `mobile/src/store/serviceStore.ts` and `mobile/src/components/ServiceCard.tsx` | Mock state uses `paid`, `pagado`, `Al corriente`, and `Listo`. | SEV-1 | Present mock-settled state as demo-only or pending provider verification. Do not imply the external utility account is current. |
| `mobile/src/components/TransactionHistoryCard.tsx` | Uses `Pagado demo`. | SEV-2 | Safer future copy: `Demo registrado` or `Simulacion registrada`, with a visible note that no provider confirmation exists. |
| `mobile/src/screens/payments/ReceiptDetailScreen.tsx` | Mock receipt state can contain `confirmed`/`confirmedAt` semantics. | SEV-2 | Avoid provider-confirmed naming in user-facing copy until Tekae evidence rules are official. |
| `.env.example` | Historical WhatsApp template name includes `fondix_pago_exitoso`. | SEV-2 | Keep as documentation debt for now. Future notification copy should avoid implying real payment success unless provider confirmation exists. |
| `README.md` and older docs/planning | Historical Prontipagos and card-processor references remain. | SEV-2 | Clean or archive in a future documentation cleanup sprint while preserving the durable decision that Prontipagos is permanently removed. |
| `admin/src/` CRM/Admin screens | Historical reconciliation/status labels include Prontipagos and paid/success terminology. | SEV-2 | Future admin copy cleanup should label old provider references as historical or replace them after approved Tekae runtime design. |

## Copy Guardrails

Avoid in mock/dev flows:

- `pago exitoso`
- `ya quedo pagado`
- `payment successful`
- `paid`
- `pagado`
- `al corriente`
- `comprobante confirmado`
- `proveedor confirmado`

Preferred mock/dev language:

- `simulacion registrada`
- `pago demo guardado`
- `flujo demo completado`
- `total de la simulacion`
- `comprobante mock/dev`
- `sin confirmacion real del proveedor`
- `pendiente de evidencia del proveedor`

For future Tekae runtime, final success language is allowed only after official Tekae material defines sufficient evidence for payment status, receipt/comprobante retrieval, reconciliation, and transaction/reference mapping.

## Future UI Cleanup Backlog

- Rename or relabel mock user-facing success screens so they do not imply real payment completion.
- Separate mock local state from provider-confirmed state in future UI copy.
- Review `PaymentSuccess`, receipt detail, transaction history, service cards, and CRM/Admin reconciliation labels.
- Decide whether internal enum names can remain unchanged while UI copy is corrected, or whether a future runtime sprint should refactor state naming.
- Review WhatsApp receipt template names and user-facing notification copy after the official provider-confirmed receipt model is approved.

## Non-Goals

- No mobile runtime edits.
- No backend runtime edits.
- No admin runtime edits.
- No endpoint or webhook changes.
- No migrations.
- No provider credentials.
- No Terraform or deployment behavior changes.
