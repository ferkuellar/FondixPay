import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DetailRow } from "../components/DetailRow";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { ManualReviewCase } from "../types/admin";
import { formatDate } from "../utils/format";

export function ManualReviewDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.manualReviewCase(id), [api, id]);
  const [status, setStatus] = useState<ManualReviewCase["status"]>("investigating");
  const [resolution, setResolution] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Actualizar caso de revision manual?")) return;
    try {
      await api.updateManualReviewCase(id, { status, resolution: resolution || undefined, note: note || undefined });
      setNote("");
      setFormError(null);
      reload();
    } catch (updateError) {
      setFormError(updateError instanceof Error ? updateError.message : "No se pudo actualizar el caso.");
    }
  };

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Caso no disponible" message={error ?? "No existe el caso."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Caso manual #{data.id}</h1>
          <p>{data.case_type}</p>
        </div>
      </header>
      <article className="panel">
        <dl>
          <DetailRow label="Estado" value={<StatusBadge value={data.status} />} />
          <DetailRow label="Severidad" value={<StatusBadge value={data.severity} />} />
          <DetailRow label="user_id" value={data.user_id ?? "No asociado"} />
          <DetailRow label="payment_id" value={data.payment_id ?? "No asociado"} />
          <DetailRow label="receipt_id" value={data.receipt_id ?? "No asociado"} />
          <DetailRow label="support_ticket_id" value={data.support_ticket_id ?? "No asociado"} />
          <DetailRow label="Resumen" value={data.summary} />
          <DetailRow label="Provider reference" value={<RedactedValue>{data.provider_reference ?? "Limitada por backend"}</RedactedValue>} />
          <DetailRow label="Card reference" value={<RedactedValue>{data.card_reference ?? "No disponible"}</RedactedValue>} />
          <DetailRow label="Correlation ID" value={<RedactedValue>{data.correlation_id ?? "No disponible"}</RedactedValue>} />
          <DetailRow label="Resolucion" value={data.resolution ?? "Sin resolucion"} />
          <DetailRow label="Actualizado" value={formatDate(data.updated_at)} />
          <DetailRow label="Cerrado" value={data.closed_at ? formatDate(data.closed_at) : "No cerrado"} />
        </dl>
      </article>
      {hasPermission("admin.manual_review.update") ? (
        <form className="panel form-grid" onSubmit={submit}>
          <h2>Actualizar caso</h2>
          <label>
            Estado
            <select value={status} onChange={(event) => setStatus(event.target.value as ManualReviewCase["status"])}>
              <option value="open">open</option>
              <option value="assigned">assigned</option>
              <option value="investigating">investigating</option>
              <option value="waiting_provider">waiting_provider</option>
              <option value="waiting_user">waiting_user</option>
              <option value="resolved">resolved</option>
              <option value="escalated">escalated</option>
              <option value="closed">closed</option>
            </select>
          </label>
          <label>
            Resolucion segura
            <textarea
              value={resolution}
              onChange={(event) => setResolution(event.target.value)}
              rows={4}
              required={status === "resolved" || status === "closed"}
            />
          </label>
          <label>
            Nota de revision
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
          </label>
          <button className="button" type="submit">Guardar revision</button>
        </form>
      ) : null}
      {formError ? <ErrorState title="Operacion no aplicada" message={formError} /> : null}
    </section>
  );
}
