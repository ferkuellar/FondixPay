import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { SupportTicket } from "../types/admin";
import { formatDate } from "../utils/format";

export function SupportTicketsPage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.tickets(), [api]);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("receipt_missing");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("medium");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Crear ticket de soporte con contexto seguro?")) return;
    try {
      await api.createTicket({ subject, category, priority });
      setSubject("");
      setFormError(null);
      reload();
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "No se pudo crear ticket.");
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Tickets de soporte</h1>
          <p>Escritura controlada para soporte. No incluyas PAN, CVV, tokens ni secretos en notas.</p>
        </div>
      </header>
      {hasPermission("admin.support_tickets.create") ? (
        <form className="panel form-grid" onSubmit={submit}>
          <h2>Crear ticket</h2>
          <label>
            Asunto
            <input value={subject} onChange={(event) => setSubject(event.target.value)} minLength={3} required />
          </label>
          <label>
            Categoria
            <select value={category} onChange={(event) => setCategory(event.target.value as SupportTicket["category"])}>
              <option value="payment_failed">payment_failed</option>
              <option value="receipt_missing">receipt_missing</option>
              <option value="pending_payment">pending_payment</option>
              <option value="account_access">account_access</option>
              <option value="card_issue">card_issue</option>
              <option value="other">other</option>
            </select>
          </label>
          <label>
            Prioridad
            <select value={priority} onChange={(event) => setPriority(event.target.value as SupportTicket["priority"])}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="urgent">urgent</option>
            </select>
          </label>
          {formError ? <p className="form-error">{formError}</p> : null}
          <button className="button" type="submit">Crear ticket</button>
        </form>
      ) : null}
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Tickets no disponibles" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin tickets" message="No hay tickets visibles para este rol." /> : null}
      {data && data.length > 0 ? (
        <DataTable<SupportTicket>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "ticket_id", render: (row) => row.id },
            { key: "subject", header: "Asunto", render: (row) => row.subject },
            { key: "category", header: "Categoria", render: (row) => row.category },
            { key: "priority", header: "Prioridad", render: (row) => <StatusBadge value={row.priority} /> },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.status} /> },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
            { key: "action", header: "Accion", render: (row) => <a href={`#/tickets/${row.id}`}>Abrir</a> },
          ]}
        />
      ) : null}
    </section>
  );
}
