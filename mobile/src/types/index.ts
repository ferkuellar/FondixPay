export type RootStackParamList = {
  Onboarding: undefined;
  PhoneLogin: undefined;
  OtpVerification: { phone: string };
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
  category: string;
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
  status: 'SUCCESS';
  paidAt: string;
  folio: string;
};
