export type RootStackParamList = {
  Onboarding: undefined;
  PhoneLogin: undefined;
  OtpVerification: { phone: string };
  AccountCreated: undefined;
  Home: undefined;
  AddService: undefined;
  ServiceDetail: { serviceId: string };
  ConfirmPayment: { serviceId: string };
  PaymentSuccess: { paymentId: string };
  History: undefined;
  Profile: undefined;
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
  status: 'SUCCESS';
  paidAt: string;
  folio: string;
};
