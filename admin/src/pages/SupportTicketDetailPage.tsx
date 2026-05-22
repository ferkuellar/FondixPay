import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DetailRow } from "../components/DetailRow";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { SupportTicket } from "../types/admin";
import { formatDate } from "../utils/format";

export function SupportTicketDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.ticket(id), [api, id]);
  const [status, setStatus] = useState<SupportTicket["status"]>("pending");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("medium");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const update = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Actualizar este ticket?")) return;
    try {
      await api.updateTicket(id, { status, priority });
      setFormError(null);
      reload();
    } catch (updateError) {
      setFormError(updateError instanceof Error ? updateError.message : "No se pudo actualizar ticket.");
    }
  };

  const addNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Agregar nota interna segura?")) return;
    try {
      await api.addTicketNote(id, { note, is_internal: true });
      setNote("");
      setFormError(null);
      reload();
    } catch (noteError) {
      setFormError(noteError instanceof Error ? noteError.message : "No se pudo agregar nota.");
    }
  };

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Ticket no disponible" message={error ?? "No existe el ticket."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Ticket #{data.id}</h1>
          <p>{data.subject}</p>
        </div>
      </header>
      <article className="panel">
        <dl>
          <DetailRow label="Estado" value={<StatusBadge value={data.status} />} />
          <DetailRow label="Prioridad" value={<StatusBadge value={data.priority} />} />
          <DetailRow label="Categoria" value={data.category} />
          <DetailRow label="user_id" value={data.user_id ?? "No asociado"} />
          <DetailRow label="payment_id" value={data.payment_id ?? "No asociado"} />
          <DetailRow label="receipt_id" value={data.receipt_id ?? "No asociado"} />
          <DetailRow label="Descripcion" value={data.description ?? "Sin descripcion"} />
          <DetailRow label="Actualizado" value={formatDate(data.updated_at)} />
        </dl>
      </article>
      {hasPermission("admin.support_tickets.update") ? (
        <div className="split-panels">
          <form className="panel form-grid" onSubmit={update}>
            <h2>Actualizar</h2>
            <label>
              Estado
              <select value={status} onChange={(event) => setStatus(event.target.value as SupportTicket["status"])}>
                <option value="open">open</option>
                <option value="pending">pending</option>
                <option value="resolved">resolved</option>
                <option value="closed">closed</option>
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
            <button className="button" type="submit">Guardar</button>
          </form>
          <form className="panel form-grid" onSubmit={addNote}>
            <h2>Nota interna</h2>
            <label>
              Nota segura
              <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} required />
            </label>
            <button className="button" type="submit">Agregar nota</button>
          </form>
        </div>
      ) : null}
      {formError ? <ErrorState title="Operacion no aplicada" message={formError} /> : null}
      <article className="panel">
        <h2>Notas</h2>
        {data.notes.length ? (
          <div className="note-list">
            {data.notes.map((item) => (
              <div className="note" key={item.id}>
                <strong>{item.is_internal ? "Interna" : "Visible"}</strong>
                <p>{item.note}</p>
                <small>{formatDate(item.created_at)} · actor {item.author_id}</small>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay notas.</p>
        )}
      </article>
    </section>
  );
}
