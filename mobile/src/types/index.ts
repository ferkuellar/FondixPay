export type RootStackParamList = {
  Onboarding: undefined;
  PhoneLogin: undefined;
  OtpVerification: { phone: string };
  AccountCreated: undefined;
  Home: undefined;
  Account: undefined;
  Movements: undefined;
  AddService: undefined;
  ServiceDetail: { serviceId: string };
  ConfirmPayment: { serviceId: string };
  PaymentMethods: { serviceId?: string };
  AddPaymentMethodMock: { serviceId?: string };
  PaymentFailed: { recovery: PaymentRecoveryContext };
  PaymentPending: { recovery: PaymentRecoveryContext };
  SupportPlaceholder: { recovery: PaymentRecoveryContext };
  PaymentSuccess: { paymentId: string };
  ProviderCallback: undefined;
  ReceiptDetail: { paymentId: string };
  Notifications: undefined;
  History: undefined;
  Profile: undefined;
};

export type PaymentMethodType = 'card_mock';

export type PaymentMethodStatus = 'active' | 'unavailable' | 'pending';

export type ProviderReadinessState =
  | 'PROVIDER_DISABLED'
  | 'PROVIDER_UNAVAILABLE'
  | 'PROVIDER_PENDING'
  | 'PROVIDER_TIMEOUT'
  | 'PROVIDER_FAILED'
  | 'PROVIDER_SUCCEEDED'
  | 'PROVIDER_MANUAL_REVIEW';

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

export type PaymentStatus =
  | 'idle'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'pending'
  | 'timeout'
  | 'duplicate_blocked';

export type PaymentFailureReason =
  | 'insufficient_funds_mock'
  | 'method_unavailable_mock'
  | 'provider_timeout_mock'
  | 'network_error_mock'
  | 'duplicate_attempt_mock'
  | 'unknown_mock';

export type PaymentRecoveryAction = 'retry' | 'change_method' | 'contact_support' | 'view_status' | 'go_home';

export type PaymentRecoveryContext = {
  paymentId: string;
  serviceId: string;
  amountMinor: number;
  feeMinor: number;
  totalMinor: number;
  currency: string;
  serviceName: string;
  providerName: string;
  methodLabel: string;
  status: PaymentStatus;
  reason: PaymentFailureReason;
  requestId?: string;
  correlationId?: string;
};

export type PaymentDisplayStatus = 'succeeded' | 'failed' | 'pending' | 'timeout' | 'duplicate_blocked';

export type ReceiptStatus = 'generated' | 'pending' | 'unavailable' | 'voided';
export type ProofStatus = 'confirmed' | 'pending' | 'review' | 'unavailable';
export type NotificationStatus = 'read' | 'unread';
export type NotificationType =
  | 'general'
  | 'payment.succeeded'
  | 'payment.pending'
  | 'payment.failed'
  | 'payment.timeout'
  | 'receipt.generated'
  | 'receipt.pending'
  | 'receipt.unavailable';

export type ReceiptProof = {
  id: string;
  paymentId: string;
  receiptId?: string;
  serviceName: string;
  serviceProviderName: string;
  serviceReferenceMasked: string;
  amountMinor: number;
  feeMinor: number;
  totalMinor: number;
  currency: string;
  paymentStatus: string;
  providerStatus: string;
  receiptStatus: ReceiptStatus;
  proofStatus: ProofStatus;
  cardLabelSafe?: string;
  cardLast4?: string;
  providerReference?: string;
  internalReference: string;
  correlationId?: string;
  isMock: boolean;
  isSandbox: boolean;
  issuedAt: string;
  confirmedAt?: string;
  disclaimer: string;
  unavailableReason?: string;
};

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  status: NotificationStatus;
  createdAt: string;
};

export type NotificationPreference = {
  id: string;
  channel: 'whatsapp';
  notificationType: 'payment_receipt';
  enabled: boolean;
  consentedAt?: string;
  revokedAt?: string;
  source: string;
};

export type TransactionHistoryFilter = 'all' | 'succeeded' | 'pending' | 'failed';

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

export type CoverageStatus =
  | 'available'
  | 'unavailable'
  | 'coming_soon'
  | 'provider_pending'
  | 'temporarily_disabled'
  | 'maintenance'
  | 'deprecated'
  | 'unknown'
  | 'to_confirm';

export type ProviderCapabilityStatus = 'confirmed' | 'pending' | 'rejected' | 'unavailable' | 'unknown' | 'to_confirm';

export type CoverageMode = 'NATIONAL' | 'STATE' | 'CITY_FUTURE' | 'DISABLED' | 'UNKNOWN_REVIEW_REQUIRED';

export type PublicServiceCoverage = {
  mode: 'NATIONAL' | 'STATE';
  states: string[];
  label?: string;
};

export type ServiceCategory = {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
};

export type ServiceCatalogItem = {
  id: string;
  displayName: string;
  slug: string;
  category: string;
  iconKey: string;
  description?: string;
  isNational: boolean;
  coverage?: PublicServiceCoverage;
  coverageMode?: CoverageMode;
  coverageStates?: string[];
  isActive?: boolean;
  isUserFacing?: boolean;
  coverageStatus: CoverageStatus;
  providerCapabilityStatus?: ProviderCapabilityStatus;
  visibleOnMobile: boolean;
  payableInMobile: boolean;
  referenceOnly: boolean;
  disclaimer: string;
};

export type CoverageMapState = {
  stateCode: string;
  stateName: string;
  referenceServices: ServiceCatalogItem[];
  payableServices: ServiceCatalogItem[];
  referenceOnly: boolean;
  paymentAvailabilityNotGuaranteed: boolean;
  disclaimer: string;
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
  status: PaymentDisplayStatus;
  receiptStatus: ReceiptStatus;
  receiptId?: string;
  movementId?: number;
  mockReference: string;
  correlationId?: string;
  requestId?: string;
  paidAt: string;
  folio: string;
};

export type AccountStatus = 'demo' | 'active' | 'restricted' | 'suspended' | 'closed';

export type Account = {
  id: number;
  accountType: string;
  status: AccountStatus;
  currency: string;
  isDemo: boolean;
  createdAt: string;
};

export type Balance = {
  accountId: number;
  availableMinor: number;
  pendingMinor: number;
  heldMinor: number;
  simulatedMinor: number;
  currency: string;
  isDemo: boolean;
  isRealMoney: boolean;
  label: string;
  disclaimer: string;
  asOf: string;
};

export type MovementType =
  | 'demo_credit'
  | 'demo_debit'
  | 'service_payment'
  | 'fee_charge'
  | 'payment_reversal'
  | 'adjustment';

export type MovementDirection = 'credit' | 'debit';

export type Movement = {
  id: number;
  type: MovementType;
  direction: MovementDirection;
  amountMinor: number;
  currency: string;
  status: string;
  description: string;
  isDemo: boolean;
  createdAt: string;
};
