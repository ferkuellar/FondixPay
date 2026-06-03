import { create } from 'zustand';

import { isDemoPaymentEnabled } from '../integrations/providerReadiness';
import type { PaymentMethod, PaymentMethodType } from '../types';

type PaymentMethodState = {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId?: string;
  addMockPaymentMethod: (type?: PaymentMethodType) => PaymentMethod;
  ensureDemoPaymentMethod: () => PaymentMethod | undefined;
  selectPaymentMethod: (methodId: string) => void;
  removePaymentMethod: (methodId: string) => void;
  getSelectedPaymentMethod: () => PaymentMethod | undefined;
  hasPaymentMethod: () => boolean;
};

const mockTemplates: Record<PaymentMethodType, Omit<PaymentMethod, 'id' | 'isDefault'>> = {
  card_mock: {
    type: 'card_mock',
    label: 'Tarjeta demo',
    description: 'Tarjeta simulada. No ingreses datos reales.',
    displayLast4: '0000',
    isMock: true,
    status: 'active',
  },
};

export const usePaymentMethodStore = create<PaymentMethodState>((set, get) => ({
  paymentMethods: [],
  selectedPaymentMethodId: undefined,
  addMockPaymentMethod: (type = 'card_mock') => {
    if (!isDemoPaymentEnabled()) {
      throw new Error('Demo payment methods are disabled outside dev/internal mode.');
    }

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
  ensureDemoPaymentMethod: () => {
    if (!isDemoPaymentEnabled()) {
      return undefined;
    }

    const current = get().getSelectedPaymentMethod() ?? get().paymentMethods.find((method) => method.status === 'active');
    if (current) {
      if (!get().selectedPaymentMethodId) {
        set({ selectedPaymentMethodId: current.id });
      }
      return current;
    }
    return get().addMockPaymentMethod('card_mock');
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
