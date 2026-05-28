export type AdminRole = "SUPPORT" | "FINANCE" | "ADMIN" | "AUDITOR" | "SUPER_ADMIN";

export type Permission =
  | "admin.dashboard.view"
  | "admin.users.list"
  | "admin.users.view"
  | "admin.payments.list"
  | "admin.payments.view"
  | "admin.receipts.list"
  | "admin.receipts.view"
  | "admin.notifications.list"
  | "admin.notifications.view"
  | "admin.audit.list"
  | "admin.reconciliation.card.view"
  | "admin.reconciliation.prontipagos.view"
  | "admin.manual_review.list"
  | "admin.manual_review.view"
  | "admin.manual_review.update"
  | "admin.fraud_signals.list"
  | "admin.fraud_signals.view"
  | "admin.fraud_signals.update"
  | "admin.disputes.list"
  | "admin.disputes.view"
  | "admin.disputes.update"
  | "admin.search.view"
  | "admin.support_tickets.list"
  | "admin.support_tickets.create"
  | "admin.support_tickets.update";

export type RequestState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export type DashboardSummary = {
  users_count: number;
  payments_count: number;
  payments_succeeded_count: number;
  payments_pending_count: number;
  payments_failed_count: number;
  receipts_generated_count: number;
  receipts_pending_count: number | null;
  manual_review_open_count: number;
  support_tickets_open_count: number;
  card_reconciliation_status: string;
  prontipagos_reconciliation_status: string;
  note?: string | null;
};

export type AdminUser = {
  id: number;
  phone: string;
  name?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  recent_payment_ids?: number[];
  receipt_ids?: number[];
};

export type AdminPayment = {
  id: number;
  user_id: number;
  user_service_id: number;
  service_name: string;
  service_provider_name: string;
  service_reference_masked: string;
  status: string;
  amount_minor: number;
  fee_minor: number;
  total_minor: number;
  currency: string;
  provider_reference?: string | null;
  receipt_id?: number | null;
  created_at: string;
  paid_at?: string | null;
  is_mock: boolean;
  card_status?: string;
  service_payment_status?: string;
  receipt_status?: string;
  correlation_id?: string | null;
};

export type AdminReceipt = {
  id: number;
  payment_id: number;
  user_id: number;
  folio: string;
  message: string;
  amount_minor: number;
  fee_minor: number;
  total_minor: number;
  currency: string;
  payment_status: string;
  provider_reference?: string | null;
  created_at: string;
  is_mock: boolean;
  proof_status?: string;
  receipt_status?: string;
  correlation_id?: string | null;
};

export type SupportTicketNote = {
  id: number;
  author_id: number;
  note: string;
  is_internal: boolean;
  created_at: string;
};

export type SupportTicket = {
  id: number;
  user_id?: number | null;
  payment_id?: number | null;
  receipt_id?: number | null;
  manual_review_case_id?: number | null;
  correlation_id?: string | null;
  status: "open" | "pending" | "waiting_user" | "waiting_internal" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category:
    | "payment_failed"
    | "payment_pending"
    | "receipt_missing"
    | "prontipagos_issue"
    | "duplicate_charge_claim"
    | "pending_payment"
    | "account_access"
    | "card_issue"
    | "other";
  subject: string;
  description?: string | null;
  assigned_to?: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  notes: SupportTicketNote[];
};

export type ManualReviewCase = {
  id: number;
  case_type:
    | "card_success_prontipagos_failed"
    | "card_success_prontipagos_pending"
    | "prontipagos_timeout"
    | "prontipagos_pending"
    | "receipt_unavailable"
    | "duplicate_attempt"
    | "duplicate_charge_claim"
    | "amount_mismatch"
    | "chargeback_suspected"
    | "user_claims_not_paid"
    | "provider_timeout"
    | "provider_status_unknown"
    | "reconciliation_mismatch"
    | "other";
  status:
    | "open"
    | "assigned"
    | "investigating"
    | "waiting_provider"
    | "waiting_user"
    | "resolved"
    | "escalated"
    | "closed";
  severity: "low" | "medium" | "high" | "urgent";
  user_id?: number | null;
  payment_id?: number | null;
  receipt_id?: number | null;
  support_ticket_id?: number | null;
  card_reference?: string | null;
  provider_reference?: string | null;
  correlation_id?: string | null;
  assigned_to?: number | null;
  summary: string;
  resolution?: string | null;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
};

export type FraudSignal = {
  id: number;
  signal_type: string;
  severity: "low" | "medium" | "high" | "urgent";
  status: "open" | "reviewed" | "dismissed" | "escalated";
  entity_type: string;
  entity_id: string;
  user_id?: number | null;
  payment_id?: number | null;
  transaction_id?: number | null;
  reason: string;
  metadata_json?: Record<string, unknown> | null;
  created_by: number;
  created_at: string;
  reviewed_at?: string | null;
  reviewed_by?: number | null;
  resolution?: string | null;
};

export type DisputeEvidence = {
  id: number;
  dispute_case_id: number;
  evidence_type: string;
  title: string;
  description?: string | null;
  storage_reference?: string | null;
  source_entity_type?: string | null;
  source_entity_id?: string | null;
  created_at: string;
  created_by: number;
};

export type DisputeCase = {
  id: number;
  case_type: "dispute" | "chargeback";
  status: "OPEN" | "UNDER_REVIEW" | "EVIDENCE_GATHERING" | "SUBMITTED" | "WON" | "LOST" | "CLOSED" | "CANCELED";
  payment_id?: number | null;
  transaction_id?: number | null;
  user_id?: number | null;
  provider_transaction_id?: string | null;
  card_processor_reference?: string | null;
  amount_minor?: number | null;
  currency: string;
  reason_code?: string | null;
  summary: string;
  opened_at: string;
  due_at?: string | null;
  closed_at?: string | null;
  assigned_to?: number | null;
  created_by: number;
  updated_by?: number | null;
  updated_at: string;
  evidence: DisputeEvidence[];
};

export type AuditEvent = {
  id: number;
  event_type: string;
  actor_type: string;
  actor_id?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  result: string;
  request_id?: string | null;
  correlation_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export type AdminNotificationDelivery = {
  id: number;
  user_id: number;
  channel: string;
  notification_type: string;
  template_name: string;
  entity_type: string;
  entity_id: string;
  recipient_masked: string;
  status: string;
  provider_name?: string | null;
  provider_message_id?: string | null;
  error_code?: string | null;
  error_message_safe?: string | null;
  created_at: string;
  updated_at: string;
  metadata_json?: Record<string, unknown> | null;
};

export type ReconciliationSummary = {
  provider_type: "card_processor" | "prontipagos";
  status: "not_implemented" | "ready_for_sandbox" | "partial";
  summary: {
    total_count: number;
    matched_count: number;
    mismatch_count: number;
    pending_count: number;
    manual_review_count: number;
  };
  items: Record<string, unknown>[];
  message: string;
  production_ready: boolean;
};

export type AdminSearchResult = {
  entity_type: "user" | "payment" | "receipt" | "ticket" | "manual_review" | "correlation" | "provider_reference";
  entity_id: number | string;
  label: string;
  status?: string | null;
  correlation_id?: string | null;
  provider_reference?: string | null;
};

export type AdminSearchResponse = {
  query: string;
  type?: string | null;
  results: AdminSearchResult[];
};
