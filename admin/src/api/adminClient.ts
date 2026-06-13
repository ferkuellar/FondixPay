import type {
  AdminNotificationDelivery,
  AdminPayment,
  AdminReceipt,
  AdminSearchResponse,
  AdminUser,
  AuditEvent,
  ChatbotConversation,
  ChatbotFallback,
  ChatbotFaq,
  ChatbotIntent,
  ChatbotKnowledgeEntry,
  ChatbotSetting,
  ChatOperationsMetrics,
  DashboardSummary,
  DisputeCase,
  FraudSignal,
  ManualReviewCase,
  ReconciliationSummary,
  SupportTicket,
} from "../types/admin";
import type { ApiErrorBody } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

type TokenProvider = () => string | null;

export function createAdminClient(getToken: TokenProvider) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });

    if (!response.ok) {
      let payload: ApiErrorBody | null = null;
      try {
        payload = (await response.json()) as ApiErrorBody;
      } catch {
        payload = null;
      }
      const message =
        response.status === 401
          ? "Sesion admin no valida. Revisa el token."
          : response.status === 403
            ? "El backend rechazo esta operacion por permisos."
            : payload?.detail ?? payload?.error ?? payload?.message ?? "No se pudo consultar el backend admin.";
      throw new AdminApiError(message, response.status);
    }

    return (await response.json()) as T;
  }

  const query = (params: Record<string, string | number | undefined | null>) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.set(key, String(value));
      }
    });
    const value = search.toString();
    return value ? `?${value}` : "";
  };

  return {
    dashboard: () => request<DashboardSummary>("/admin/dashboard"),
    users: (params: { q?: string }) => request<AdminUser[]>(`/admin/users${query(params)}`),
    user: (id: string) => request<AdminUser>(`/admin/users/${id}`),
    payments: (params: { status?: string; user_id?: string; correlation_id?: string }) =>
      request<AdminPayment[]>(`/admin/payments${query(params)}`),
    payment: (id: string) => request<AdminPayment>(`/admin/payments/${id}`),
    receipts: (params: { user_id?: string; payment_id?: string }) =>
      request<AdminReceipt[]>(`/admin/receipts${query(params)}`),
    receipt: (id: string) => request<AdminReceipt>(`/admin/receipts/${id}`),
    auditEvents: (params: { event_type?: string; actor_id?: string; entity_id?: string; correlation_id?: string }) =>
      request<AuditEvent[]>(`/admin/audit-events${query(params)}`),
    notificationDeliveries: (params: { status?: string; template_name?: string; user_id?: string }) =>
      request<AdminNotificationDelivery[]>(`/admin/notifications/deliveries${query(params)}`),
    notificationDelivery: (id: string) =>
      request<AdminNotificationDelivery>(`/admin/notifications/deliveries/${id}`),
    search: (params: { q: string; type?: string }) =>
      request<AdminSearchResponse>(`/admin/search${query(params)}`),
    cardReconciliation: () => request<ReconciliationSummary>("/admin/reconciliation/card"),
    prontipagosReconciliation: () => request<ReconciliationSummary>("/admin/reconciliation/prontipagos"),
    manualReview: () => request<ManualReviewCase[]>("/admin/manual-review"),
    manualReviewCase: (id: string) => request<ManualReviewCase>(`/admin/manual-review/${id}`),
    updateManualReviewCase: (id: string, payload: Partial<ManualReviewCase> & { note?: string }) =>
      request<ManualReviewCase>(`/admin/manual-review/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    fraudSignals: (params: { status?: string; severity?: string; payment_id?: string }) =>
      request<FraudSignal[]>(`/admin/fraud/signals${query(params)}`),
    fraudSignal: (id: string) => request<FraudSignal>(`/admin/fraud/signals/${id}`),
    createFraudSignal: (payload: Partial<FraudSignal>) =>
      request<FraudSignal>("/admin/fraud/signals", { method: "POST", body: JSON.stringify(payload) }),
    updateFraudSignalStatus: (id: string, payload: Pick<FraudSignal, "status"> & { resolution?: string }) =>
      request<FraudSignal>(`/admin/fraud/signals/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
    disputes: (params: { status?: string; case_type?: string; payment_id?: string }) =>
      request<DisputeCase[]>(`/admin/disputes${query(params)}`),
    dispute: (id: string) => request<DisputeCase>(`/admin/disputes/${id}`),
    createDispute: (payload: Partial<DisputeCase>) =>
      request<DisputeCase>("/admin/disputes", { method: "POST", body: JSON.stringify(payload) }),
    updateDisputeStatus: (id: string, payload: Pick<DisputeCase, "status"> & { assigned_to?: number | null }) =>
      request<DisputeCase>(`/admin/disputes/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
    addDisputeEvidence: (
      id: string,
      payload: {
        evidence_type: string;
        title: string;
        description?: string;
        storage_reference?: string;
        source_entity_type?: string;
        source_entity_id?: string;
      },
    ) =>
      request<DisputeCase>(`/admin/disputes/${id}/evidence`, { method: "POST", body: JSON.stringify(payload) }),
    tickets: () => request<SupportTicket[]>("/admin/support/tickets"),
    ticket: (id: string) => request<SupportTicket>(`/admin/support/tickets/${id}`),
    createTicket: (payload: Partial<SupportTicket>) =>
      request<SupportTicket>("/admin/support/tickets", { method: "POST", body: JSON.stringify(payload) }),
    updateTicket: (id: string, payload: Partial<SupportTicket> & { resolution_note?: string }) =>
      request<SupportTicket>(`/admin/support/tickets/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    addTicketNote: (id: string, payload: { note: string; is_internal: boolean }) =>
      request<SupportTicket>(`/admin/support/tickets/${id}/notes`, { method: "POST", body: JSON.stringify(payload) }),
    chatbotFaqs: () => request<ChatbotFaq[]>("/admin/chat/faqs"),
    createChatbotFaq: (payload: Partial<ChatbotFaq>) =>
      request<ChatbotFaq>("/admin/chat/faqs", { method: "POST", body: JSON.stringify(payload) }),
    updateChatbotFaq: (id: number, payload: Partial<ChatbotFaq>) =>
      request<ChatbotFaq>(`/admin/chat/faqs/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    enableChatbotFaq: (id: number) => request<ChatbotFaq>(`/admin/chat/faqs/${id}/enable`, { method: "POST" }),
    disableChatbotFaq: (id: number) => request<ChatbotFaq>(`/admin/chat/faqs/${id}/disable`, { method: "POST" }),
    chatbotIntents: () => request<ChatbotIntent[]>("/admin/chat/intents"),
    createChatbotIntent: (payload: Partial<ChatbotIntent>) =>
      request<ChatbotIntent>("/admin/chat/intents", { method: "POST", body: JSON.stringify(payload) }),
    updateChatbotIntent: (id: number, payload: Partial<ChatbotIntent>) =>
      request<ChatbotIntent>(`/admin/chat/intents/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    enableChatbotIntent: (id: number) => request<ChatbotIntent>(`/admin/chat/intents/${id}/enable`, { method: "POST" }),
    disableChatbotIntent: (id: number) => request<ChatbotIntent>(`/admin/chat/intents/${id}/disable`, { method: "POST" }),
    chatbotKnowledge: () => request<ChatbotKnowledgeEntry[]>("/admin/chat/knowledge"),
    createChatbotKnowledge: (payload: Partial<ChatbotKnowledgeEntry>) =>
      request<ChatbotKnowledgeEntry>("/admin/chat/knowledge", { method: "POST", body: JSON.stringify(payload) }),
    updateChatbotKnowledge: (id: number, payload: Partial<ChatbotKnowledgeEntry>) =>
      request<ChatbotKnowledgeEntry>(`/admin/chat/knowledge/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    enableChatbotKnowledge: (id: number) =>
      request<ChatbotKnowledgeEntry>(`/admin/chat/knowledge/${id}/enable`, { method: "POST" }),
    disableChatbotKnowledge: (id: number) =>
      request<ChatbotKnowledgeEntry>(`/admin/chat/knowledge/${id}/disable`, { method: "POST" }),
    chatbotConversations: () => request<ChatbotConversation[]>("/admin/chat/conversations"),
    chatbotConversation: (id: string) => request<ChatbotConversation>(`/admin/chat/conversations/${id}`),
    chatbotFallbacks: () => request<ChatbotFallback[]>("/admin/chat/fallbacks"),
    chatbotSettings: () => request<ChatbotSetting[]>("/admin/chat/settings"),
    updateChatbotSetting: (key: string, value: Record<string, unknown>) =>
      request<ChatbotSetting>(`/admin/chat/settings/${key}`, { method: "PATCH", body: JSON.stringify({ value }) }),
    chatTest: (payload: { system: string; messages: Array<{ role: string; content: string }>; model?: string }) =>
      request<{ content: string; model: string }>("/admin/chat/test", { method: "POST", body: JSON.stringify(payload) }),
    chatOperationsMetrics: () => request<ChatOperationsMetrics>("/admin/chat/operations/metrics"),
    chatOperationsConversations: (params: {
      status?: string;
      severity?: string;
      source?: string;
      assigned_to?: string;
      has_ticket?: string;
      escalated?: string;
      q?: string;
    }) => request<ChatbotConversation[]>(`/admin/chat/operations/conversations${query(params)}`),
    chatOperationsConversation: (id: string) => request<ChatbotConversation>(`/admin/chat/operations/conversations/${id}`),
    createChatOperationsTicket: (id: string, payload: { title?: string; summary?: string; priority?: string; assigned_to?: number | null }) =>
      request<SupportTicket>(`/admin/chat/operations/conversations/${id}/ticket`, { method: "POST", body: JSON.stringify(payload) }),
    escalateChatConversation: (id: string) =>
      request<ChatbotConversation>(`/admin/chat/operations/conversations/${id}/escalate`, { method: "POST" }),
    assignChatConversation: (id: string, assigned_to?: number | null) =>
      request<ChatbotConversation>(`/admin/chat/operations/conversations/${id}/assign`, { method: "POST", body: JSON.stringify({ assigned_to }) }),
    updateChatConversationSeverity: (id: string, payload: { severity: string; note?: string }) =>
      request<ChatbotConversation>(`/admin/chat/operations/conversations/${id}/severity`, { method: "POST", body: JSON.stringify(payload) }),
    addChatConversationNote: (id: string, body: string) =>
      request<ChatbotConversation>(`/admin/chat/operations/conversations/${id}/notes`, { method: "POST", body: JSON.stringify({ body }) }),
    reviewChatConversation: (id: string) =>
      request<ChatbotConversation>(`/admin/chat/operations/conversations/${id}/review`, { method: "POST" }),
    markChatTicketFirstResponse: (ticketId: number) =>
      request<SupportTicket>(`/admin/chat/operations/tickets/${ticketId}/first-response`, { method: "POST" }),
    updateChatTicketStatus: (ticketId: number, targetStatus: "resolved" | "closed" | "reopened", note: string) =>
      request<SupportTicket>(`/admin/chat/operations/tickets/${ticketId}/${targetStatus}`, { method: "POST", body: JSON.stringify({ note }) }),
  };
}
