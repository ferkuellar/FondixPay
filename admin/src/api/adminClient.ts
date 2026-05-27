import type {
  AdminPayment,
  AdminReceipt,
  AdminSearchResponse,
  AdminUser,
  AuditEvent,
  DashboardSummary,
  ManualReviewCase,
  ReconciliationSummary,
  SupportTicket,
} from "../types/admin";
import type { ApiErrorBody } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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
    search: (params: { q: string; type?: string }) =>
      request<AdminSearchResponse>(`/admin/search${query(params)}`),
    cardReconciliation: () => request<ReconciliationSummary>("/admin/reconciliation/card"),
    prontipagosReconciliation: () => request<ReconciliationSummary>("/admin/reconciliation/prontipagos"),
    manualReview: () => request<ManualReviewCase[]>("/admin/manual-review"),
    manualReviewCase: (id: string) => request<ManualReviewCase>(`/admin/manual-review/${id}`),
    updateManualReviewCase: (id: string, payload: Partial<ManualReviewCase> & { note?: string }) =>
      request<ManualReviewCase>(`/admin/manual-review/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    tickets: () => request<SupportTicket[]>("/admin/support/tickets"),
    ticket: (id: string) => request<SupportTicket>(`/admin/support/tickets/${id}`),
    createTicket: (payload: Partial<SupportTicket>) =>
      request<SupportTicket>("/admin/support/tickets", { method: "POST", body: JSON.stringify(payload) }),
    updateTicket: (id: string, payload: Partial<SupportTicket> & { resolution_note?: string }) =>
      request<SupportTicket>(`/admin/support/tickets/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    addTicketNote: (id: string, payload: { note: string; is_internal: boolean }) =>
      request<SupportTicket>(`/admin/support/tickets/${id}/notes`, { method: "POST", body: JSON.stringify(payload) }),
  };
}
