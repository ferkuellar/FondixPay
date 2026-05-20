export type RootStackParamList = {
  Onboarding: undefined;
  PhoneLogin: undefined;
  OtpVerification: { phone: string };
  AccountCreated: undefined;
  Home: undefined;
  AddService: undefined;
  ServiceDetail: { serviceId: string };
  ConfirmPayment: { serviceId: string };
  PaymentMethods: { serviceId?: string };
  AddPaymentMethodMock: { serviceId?: string };
  PaymentSuccess: { paymentId: string };
  History: undefined;
  Profile: undefined;
};

export type PaymentMethodType = 'demo' | 'card_mock' | 'spei_mock' | 'cash_mock';

export type PaymentMethodStatus = 'active' | 'unavailable' | 'pending';

export type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  label: string;
  description: string;
  displayLast4?: string;
  isDefault: boolean;
  isMock: boolean;
  status: PaymentMethodStatus;
};

export type Provider = {
  id: string;
  name: string;
  displayName: string;
  category: string;
  iconKey: string;
  integrationType: string;
  isActive: boolean;
  sortOrder: number;
  icon: string;
};

export type SavedService = {
  id: string;
  provider: Provider;
  alias: string;
  reference: string;
  amountDue: number;
  dueText: string;
};

export type Payment = {
  id: string;
  serviceName: string;
  providerName: string;
  amount: number;
  amountMinor: number;
  feeMinor: number;
  totalMinor: number;
  currency: string;
  feeLabel: string;
  feeDescription: string;
  isMock: boolean;
  paymentMethodId?: string;
  paymentMethodLabel?: string;
  paymentMethodIsMock?: boolean;
  status: 'SUCCESS';
  paidAt: string;
  folio: string;
};
