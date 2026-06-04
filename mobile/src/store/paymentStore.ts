import { create } from 'zustand';

import type {
  Payment,
  PaymentDisplayStatus,
  PaymentRecoveryContext,
  PaymentStatus,
  ReceiptStatus,
  SavedService,
} from '../types';
import { calculatePaymentBreakdown } from '../utils/money';
import { usePaymentMethodStore } from './paymentMethodStore';
import { useServiceStore } from './serviceStore';

type PaymentState = {
  paymentAmount: number;
  payments: Payment[];
  paymentStatus: PaymentStatus;
  historyError?: string;
  isHistoryLoading: boolean;
  mockScenario: Exclude<PaymentStatus, 'idle' | 'processing'>;
  selectedService?: SavedService;
  createRecoveryContext: (serviceId: string, status: PaymentStatus) => PaymentRecoveryContext;
  getPayment: (paymentId: string) => Payment | undefined;
  payService: (serviceId: string) => Payment;
  recordRecoveryAttempt: (recovery: PaymentRecoveryContext) => Payment;
  resetPayment: () => void;
  setMockScenario: (scenario: Exclude<PaymentStatus, 'idle' | 'processing'>) => void;
  selectService: (serviceId: string) => void;
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentAmount: 0,
  payments: [],
  paymentStatus: 'idle',
  isHistoryLoading: false,
  mockScenario: 'succeeded',
  createRecoveryContext: (serviceId, status) => {
    const service = useServiceStore.getState().getService(serviceId);
    const selectedPaymentMethod = usePaymentMethodStore.getState().getSelectedPaymentMethod();
    if (!service || !selectedPaymentMethod) {
      throw new Error('No se pudo preparar el contexto de recuperación');
    }

    const breakdown = calculatePaymentBreakdown(service.amountDue);
    const paymentId = `mock_recovery_${Date.now()}`;
    return {
      paymentId,
      serviceId,
      amountMinor: breakdown.amountMinor,
      feeMinor: breakdown.feeMinor,
      totalMinor: breakdown.totalMinor,
      currency: breakdown.currency,
      serviceName: service.alias,
      providerName: service.provider.displayName,
      methodLabel: selectedPaymentMethod.label,
      status,
      reason:
        status === 'timeout'
          ? 'provider_timeout_mock'
          : status === 'duplicate_blocked'
            ? 'duplicate_attempt_mock'
            : status === 'failed'
              ? 'method_unavailable_mock'
              : 'unknown_mock',
      requestId: `req_mock_${Date.now()}`,
      correlationId: `corr_mock_${serviceId}_${Date.now()}`,
    };
  },
  getPayment: (paymentId) => get().payments.find((payment) => payment.id === paymentId),
  payService: (serviceId) => {
    const service = useServiceStore.getState().getService(serviceId);
    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    const selectedPaymentMethod = usePaymentMethodStore.getState().getSelectedPaymentMethod();
    if (!selectedPaymentMethod) {
      throw new Error('Método de pago requerido');
    }

    const breakdown = calculatePaymentBreakdown(service.amountDue);
    set({ paymentAmount: service.amountDue, paymentStatus: 'processing', selectedService: service });

    const payment: Payment = {
      id: `${Date.now()}`,
      serviceName: service.alias,
      providerName: service.provider.displayName,
      amount: service.amountDue,
      amountMinor: breakdown.amountMinor,
      feeMinor: breakdown.feeMinor,
      totalMinor: breakdown.totalMinor,
      currency: breakdown.currency,
      feeLabel: breakdown.feeLabel,
      feeDescription: breakdown.feeDescription,
      isMock: breakdown.isMock,
      paymentMethodId: selectedPaymentMethod.id,
      paymentMethodLabel: selectedPaymentMethod.label,
      paymentMethodIsMock: selectedPaymentMethod.isMock,
      status: 'succeeded',
      receiptStatus: 'generated',
      receiptId: `receipt_${Date.now()}`,
      mockReference: `FP-${Date.now()}`,
      paidAt: new Date().toISOString(),
      folio: `FP-${Date.now()}`,
    };

    useServiceStore.getState().markServicePaid(serviceId);
    set((state) => ({ paymentStatus: 'succeeded', payments: [payment, ...state.payments] }));
    return payment;
  },
  recordRecoveryAttempt: (recovery) => {
    const receiptStatus: ReceiptStatus =
      recovery.status === 'pending' || recovery.status === 'timeout' ? 'pending' : 'unavailable';
    const displayStatus: PaymentDisplayStatus =
      recovery.status === 'processing' || recovery.status === 'idle' ? 'pending' : recovery.status;
    const payment: Payment = {
      id: recovery.paymentId,
      serviceName: recovery.serviceName,
      providerName: recovery.providerName,
      amount: recovery.amountMinor / 100,
      amountMinor: recovery.amountMinor,
      feeMinor: recovery.feeMinor,
      totalMinor: recovery.totalMinor,
      currency: recovery.currency,
      feeLabel: 'Comisión FondixPay',
      feeDescription: 'Comisión demo visible antes de continuar la simulación.',
      isMock: true,
      paymentMethodLabel: recovery.methodLabel,
      paymentMethodIsMock: true,
      status: displayStatus,
      receiptStatus,
      mockReference: recovery.paymentId,
      correlationId: recovery.correlationId,
      requestId: recovery.requestId,
      paidAt: new Date().toISOString(),
      folio: recovery.paymentId,
    };

    set((state) => ({ paymentStatus: recovery.status, payments: [payment, ...state.payments] }));
    return payment;
  },
  resetPayment: () => set({ paymentAmount: 0, paymentStatus: 'idle', selectedService: undefined }),
  setMockScenario: (mockScenario) => set({ mockScenario }),
  selectService: (serviceId) => {
    const service = useServiceStore.getState().getService(serviceId);
    set({ paymentAmount: service?.amountDue ?? 0, paymentStatus: 'idle', selectedService: service });
  },
}));
