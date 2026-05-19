import { create } from 'zustand';

import type { Payment, SavedService } from '../types';
import { useServiceStore } from './serviceStore';

type PaymentState = {
  paymentAmount: number;
  payments: Payment[];
  paymentStatus: 'idle' | 'processing' | 'success';
  selectedService?: SavedService;
  getPayment: (paymentId: string) => Payment | undefined;
  payService: (serviceId: string) => Payment;
  resetPayment: () => void;
  selectService: (serviceId: string) => void;
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentAmount: 0,
  payments: [],
  paymentStatus: 'idle',
  getPayment: (paymentId) => get().payments.find((payment) => payment.id === paymentId),
  payService: (serviceId) => {
    const service = useServiceStore.getState().getService(serviceId);
    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    set({ paymentAmount: service.amountDue, paymentStatus: 'processing', selectedService: service });

    const payment: Payment = {
      id: `${Date.now()}`,
      serviceName: service.alias,
      providerName: service.provider.displayName,
      amount: service.amountDue,
      status: 'SUCCESS',
      paidAt: new Date().toISOString(),
      folio: `FP-${Date.now()}`,
    };

    useServiceStore.getState().markServicePaid(serviceId);
    set((state) => ({ paymentStatus: 'success', payments: [payment, ...state.payments] }));
    return payment;
  },
  resetPayment: () => set({ paymentAmount: 0, paymentStatus: 'idle', selectedService: undefined }),
  selectService: (serviceId) => {
    const service = useServiceStore.getState().getService(serviceId);
    set({ paymentAmount: service?.amountDue ?? 0, paymentStatus: 'idle', selectedService: service });
  },
}));
