import type { ReceiptProof } from '../types';
import { apiRequest } from './api';

type ReceiptProofApiResponse = {
  id: string;
  payment_id: number;
  receipt_id?: number;
  service_name: string;
  service_provider_name: string;
  service_reference_masked: string;
  amount_minor: number;
  fee_minor: number;
  total_minor: number;
  currency: string;
  payment_status: string;
  provider_status: string;
  receipt_status: ReceiptProof['receiptStatus'];
  proof_status: ReceiptProof['proofStatus'];
  card_label_safe?: string;
  card_last4?: string;
  provider_reference?: string;
  internal_reference: string;
  correlation_id?: string;
  is_mock: boolean;
  is_sandbox: boolean;
  issued_at: string;
  confirmed_at?: string;
  disclaimer: string;
  unavailable_reason?: string;
};

function authorization(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function mapProof(proof: ReceiptProofApiResponse): ReceiptProof {
  return {
    id: proof.id,
    paymentId: String(proof.payment_id),
    receiptId: proof.receipt_id ? String(proof.receipt_id) : undefined,
    serviceName: proof.service_name,
    serviceProviderName: proof.service_provider_name,
    serviceReferenceMasked: proof.service_reference_masked,
    amountMinor: proof.amount_minor,
    feeMinor: proof.fee_minor,
    totalMinor: proof.total_minor,
    currency: proof.currency,
    paymentStatus: proof.payment_status,
    providerStatus: proof.provider_status,
    receiptStatus: proof.receipt_status,
    proofStatus: proof.proof_status,
    cardLabelSafe: proof.card_label_safe,
    cardLast4: proof.card_last4,
    providerReference: proof.provider_reference,
    internalReference: proof.internal_reference,
    correlationId: proof.correlation_id,
    isMock: proof.is_mock,
    isSandbox: proof.is_sandbox,
    issuedAt: proof.issued_at,
    confirmedAt: proof.confirmed_at,
    disclaimer: proof.disclaimer,
    unavailableReason: proof.unavailable_reason,
  };
}

export async function getReceipts(token: string) {
  return apiRequest<Array<{ id: number }>>('/receipts', { headers: authorization(token) });
}

export async function getReceiptDetail(token: string, receiptId: string): Promise<ReceiptProof> {
  const proof = await apiRequest<ReceiptProofApiResponse>(`/receipts/${receiptId}`, { headers: authorization(token) });
  return mapProof(proof);
}

export async function getPaymentProof(token: string, paymentId: string): Promise<ReceiptProof> {
  const proof = await apiRequest<ReceiptProofApiResponse>(`/payments/${paymentId}/proof`, {
    headers: authorization(token),
  });
  return mapProof(proof);
}
