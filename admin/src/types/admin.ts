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
  | "admin.support_tickets.update"
  | "admin.chatbot.view"
  | "admin.chatbot.manage"
  | "admin.chatbot.settings.manage"
  | "admin.chatbot.conversations.view"
  | "admin.chatbot.fallbacks.review"
  | "admin.chat_ops.view"
  | "admin.chat_ops.manage"
  | "admin.chat_ops.assign"
  | "admin.chat_ops.severity.override"
  | "admin.chat_ops.notes.create"
  | "admin.chat_ops.first_response";

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
  conversation_id?: number | null;
  manual_review_case_id?: number | null;
  correlation_id?: string | null;
  ticket_number?: string | null;
  source?: string | null;
  status:
    | "open"
    | "pending"
    | "waiting_user"
    | "waiting_internal"
    | "resolved"
    | "closed"
    | "new"
    | "triaged"
    | "assigned"
    | "waiting_customer"
    | "waiting_internal_review"
    | "escalated"
    | "reopened";
  priority: "low" | "medium" | "high" | "urgent";
  severity?: "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4" | "SEV-5";
  category:
    | "payment_failed"
    | "payment_pending"
    | "receipt_missing"
    | "service_payment_issue"
    | "duplicate_charge_claim"
    | "pending_payment"
    | "account_access"
    | "card_issue"
    | "other";
  subject: string;
  title?: string | null;
  summary?: string | null;
  customer_message_excerpt?: string | null;
  description?: string | null;
  assigned_to?: number | null;
  created_by: number;
  sla_due_at?: string | null;
  first_response_at?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  reopened_at?: string | null;
  notes: SupportTicketNote[];
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

export type ChatbotFaq = {
  id: number;
  question: string;
  normalized_question: string;
  answer: string;
  category?: string | null;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: number | null;
  updated_by?: number | null;
};

export type ChatbotIntent = {
  id: number;
  name: string;
  description?: string | null;
  example_phrases: string[];
  response: string;
  severity_hint?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: number | null;
  updated_by?: number | null;
};

export type ChatbotKnowledgeEntry = {
  id: number;
  title: string;
  content: string;
  category?: string | null;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: number | null;
  updated_by?: number | null;
};

export type ChatbotSetting = {
  id: number;
  key: string;
  value?: Record<string, unknown> | null;
  updated_at: string;
  updated_by?: number | null;
};

export type ChatbotMessage = {
  id: number;
  conversation_id?: string;
  sender_type: "user" | "bot" | "system";
  message_text_masked: string;
  raw_message_stored: boolean;
  classification?: string | null;
  created_at: string;
};

export type ChatbotConversationEvent = {
  id: number;
  event_type: string;
  actor_id?: number | null;
  before_json?: Record<string, unknown> | null;
  after_json?: Record<string, unknown> | null;
  note?: string | null;
  created_at: string;
};

export type ChatbotInternalNote = {
  id: number;
  author_id: number;
  body: string;
  created_at: string;
};

export type ChatbotConversation = {
  id: string;
  session_id: string;
  source: string;
  page_url?: string | null;
  started_at: string;
  last_message_at: string;
  status: string;
  detected_intent?: string | null;
  confidence?: string | null;
  severity?: "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4" | "SEV-5";
  suggested_severity?: string | null;
  classification_reason?: string | null;
  ai_suggested_severity?: string | null;
  linked_ticket_id?: number | null;
  assigned_to?: number | null;
  escalation_status?: string;
  reviewed_at?: string | null;
  reviewed_by?: number | null;
  created_at: string;
  updated_at: string;
  messages?: ChatbotMessage[];
  events?: ChatbotConversationEvent[];
  internal_notes?: ChatbotInternalNote[];
};

export type ChatbotFallback = {
  id: number;
  conversation_id: string;
  message_id?: number | null;
  message_text_masked: string;
  reason: string;
  reviewed: boolean;
  created_at: string;
};

export type ChatOperationsMetrics = {
  total_conversations: number;
  active_conversations: number;
  bot_resolved_conversations: number;
  human_escalated_conversations: number;
  tickets_created: number;
  assigned_tickets: number;
  unassigned_tickets: number;
  sla_breached_tickets: number;
  fallback_rate: number;
  average_first_response_minutes?: number | null;
  average_resolution_minutes?: number | null;
  csat_average?: number | null;
  tickets_by_severity: Record<string, number>;
  tickets_by_status: Record<string, number>;
  top_intents: Array<Record<string, unknown>>;
  top_unresolved_questions: Array<Record<string, unknown>>;
};
