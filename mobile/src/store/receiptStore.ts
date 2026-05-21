import { create } from 'zustand';

import { getPaymentProof, getReceiptDetail, getReceipts } from '../services/receiptsApi';
import type { ReceiptProof } from '../types';
import { useAuthStore } from './authStore';

type ReceiptState = {
  receipts: ReceiptProof[];
  selectedReceipt?: ReceiptProof;
  isLoading: boolean;
  error?: string;
  fetchReceipts: () => Promise<void>;
  fetchReceiptDetail: (receiptId: string) => Promise<void>;
  fetchPaymentProof: (paymentId: string) => Promise<void>;
  clearSelectedReceipt: () => void;
  setLocalProof: (proof: ReceiptProof) => void;
};

export const useReceiptStore = create<ReceiptState>((set) => ({
  receipts: [],
  isLoading: false,
  clearSelectedReceipt: () => set({ selectedReceipt: undefined, error: undefined }),
  fetchReceipts: async () => {
    set({ error: undefined, isLoading: true });
    try {
      const token = requireToken();
      const receiptRows = await getReceipts(token);
      const receipts = await Promise.all(receiptRows.map((receipt) => getReceiptDetail(token, String(receipt.id))));
      set({ receipts });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'No pudimos cargar comprobantes.' });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchReceiptDetail: async (receiptId) => runProofLoad(set, () => getReceiptDetail(requireToken(), receiptId)),
  fetchPaymentProof: async (paymentId) => runProofLoad(set, () => getPaymentProof(requireToken(), paymentId)),
  setLocalProof: (selectedReceipt) => set({ selectedReceipt, error: undefined }),
}));

async function runProofLoad(
  set: (next: Partial<ReceiptState>) => void,
  load: () => Promise<ReceiptProof>,
) {
  set({ error: undefined, isLoading: true });
  try {
    const selectedReceipt = await load();
    set({ selectedReceipt });
  } catch (error) {
    set({ error: error instanceof Error ? error.message : 'No pudimos cargar el comprobante.' });
  } finally {
    set({ isLoading: false });
  }
}

function requireToken() {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('Inicia sesion para consultar comprobantes.');
  return token;
}
