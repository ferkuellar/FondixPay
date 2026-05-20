import { create } from 'zustand';

import type { PaymentMethod, PaymentMethodType } from '../types';

type PaymentMethodState = {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId?: string;
  addMockPaymentMethod: (type?: PaymentMethodType) => PaymentMethod;
  selectPaymentMethod: (methodId: string) => void;
  removePaymentMethod: (methodId: string) => void;
  getSelectedPaymentMethod: () => PaymentMethod | undefined;
  hasPaymentMethod: () => boolean;
};

const mockTemplates: Record<PaymentMethodType, Omit<PaymentMethod, 'id' | 'isDefault'>> = {
  demo: {
    type: 'demo',
    label: 'Método demo',
    description: 'Pago simulado sin cargo real.',
    isMock: true,
    status: 'active',
  },
  card_mock: {
    type: 'card_mock',
    label: 'Tarjeta demo',
    description: 'Tarjeta simulada. No ingreses datos reales.',
    displayLast4: '0000',
    isMock: true,
    status: 'active',
  },
  spei_mock: {
    type: 'spei_mock',
    label: 'SPEI demo',
    description: 'Transferencia simulada para validar el flujo.',
    isMock: true,
    status: 'active',
  },
  cash_mock: {
    type: 'cash_mock',
    label: 'Efectivo demo',
    description: 'Pago en tienda simulado, sin cargo real.',
    isMock: true,
    status: 'active',
  },
};

export const usePaymentMethodStore = create<PaymentMethodState>((set, get) => ({
  paymentMethods: [],
  selectedPaymentMethodId: undefined,
  addMockPaymentMethod: (type = 'demo') => {
    const template = mockTemplates[type];
    const method: PaymentMethod = {
      ...template,
      id: `pm_mock_${Date.now()}`,
      isDefault: get().paymentMethods.length === 0,
    };

    set((state) => ({
      paymentMethods: [method, ...state.paymentMethods],
      selectedPaymentMethodId: method.id,
    }));

    return method;
  },
  selectPaymentMethod: (methodId) => {
    const method = get().paymentMethods.find((item) => item.id === methodId);
    if (!method || method.status !== 'active') {
      return;
    }
    set({ selectedPaymentMethodId: methodId });
  },
  removePaymentMethod: (methodId) => {
    set((state) => {
      const paymentMethods = state.paymentMethods.filter((method) => method.id !== methodId);
      const selectedPaymentMethodId =
        state.selectedPaymentMethodId === methodId ? paymentMethods[0]?.id : state.selectedPaymentMethodId;
      return { paymentMethods, selectedPaymentMethodId };
    });
  },
  getSelectedPaymentMethod: () => {
    const { paymentMethods, selectedPaymentMethodId } = get();
    return paymentMethods.find((method) => method.id === selectedPaymentMethodId);
  },
  hasPaymentMethod: () => get().paymentMethods.length > 0,
}));
