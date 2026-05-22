export type AdminRole = "SUPPORT" | "FINANCE" | "ADMIN" | "AUDITOR" | "SUPER_ADMIN";

export type Permission =
  | "admin.dashboard.view"
  | "admin.users.list"
  | "admin.users.view"
  | "admin.payments.list"
  | "admin.payments.view"
  | "admin.receipts.list"
  | "admin.receipts.view"
  | "admin.audit.list"
  | "admin.reconciliation.card.view"
  | "admin.reconciliation.prontipagos.view"
  | "admin.manual_review.list"
  | "admin.manual_review.view"
  | "admin.manual_review.update"
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
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "payment_failed" | "receipt_missing" | "pending_payment" | "account_access" | "card_issue" | "other";
  subject: string;
  description?: string | null;
  assigned_to?: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  notes: SupportTicketNote[];
};

export type ManualReviewCase = {
  id: number;
  case_type:
    | "card_success_prontipagos_failed"
    | "prontipagos_pending"
    | "receipt_unavailable"
    | "duplicate_attempt"
    | "amount_mismatch"
    | "chargeback_suspected"
    | "user_claims_not_paid"
    | "provider_timeout"
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
  card_reference?: string | null;
  provider_reference?: string | null;
  correlation_id?: string | null;
  assigned_to?: number | null;
  resolution?: string | null;
  created_at: string;
  updated_at: string;
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

export type ReconciliationSummary = {
  status: "not_implemented";
  provider: "card" | "prontipagos";
  message: string;
};
