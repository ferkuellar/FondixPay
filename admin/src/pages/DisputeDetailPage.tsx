import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DetailRow } from "../components/DetailRow";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { DisputeCase } from "../types/admin";
import { formatDate, formatMoney } from "../utils/format";

export function DisputeDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.dispute(id), [api, id]);
  const [status, setStatus] = useState<DisputeCase["status"]>("UNDER_REVIEW");
  const [assignedTo, setAssignedTo] = useState("");
  const [evidence, setEvidence] = useState({
    evidence_type: "payment_summary",
    title: "",
    description: "",
    storage_reference: "",
    source_entity_type: "Payment",
    source_entity_id: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const updateStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Actualizar estado del caso?")) return;
    try {
      await api.updateDisputeStatus(id, { status, assigned_to: assignedTo ? Number(assignedTo) : null });
      setFormError(null);
      reload();
    } catch (updateError) {
      setFormError(updateError instanceof Error ? updateError.message : "No se pudo actualizar el caso.");
    }
  };

  const addEvidence = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Agregar evidencia interna?")) return;
    try {
      await api.addDisputeEvidence(id, {
        evidence_type: evidence.evidence_type,
        title: evidence.title,
        description: evidence.description || undefined,
        storage_reference: evidence.storage_reference || undefined,
        source_entity_type: evidence.source_entity_type || undefined,
        source_entity_id: evidence.source_entity_id || undefined,
      });
      setEvidence({ ...evidence, title: "", description: "", storage_reference: "", source_entity_id: "" });
      setFormError(null);
      reload();
    } catch (evidenceError) {
      setFormError(evidenceError instanceof Error ? evidenceError.message : "No se pudo agregar evidencia.");
    }
  };

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Caso no disponible" message={error ?? "No existe el caso."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Caso #{data.id}</h1>
          <p>{data.case_type}</p>
        </div>
      </header>
      <article className="panel">
        <dl>
          <DetailRow label="Estado" value={<StatusBadge value={data.status} />} />
          <DetailRow label="payment_id" value={data.payment_id ?? "No asociado"} />
          <DetailRow label="user_id" value={data.user_id ?? "No asociado"} />
          <DetailRow label="transaction_id" value={data.transaction_id ?? "No asociado"} />
          <DetailRow label="Monto" value={data.amount_minor == null ? "No disponible" : formatMoney(data.amount_minor, data.currency)} />
          <DetailRow label="Reason code" value={data.reason_code ?? "No disponible"} />
          <DetailRow label="Provider transaction" value={<RedactedValue>{data.provider_transaction_id ?? "No disponible"}</RedactedValue>} />
          <DetailRow label="Card reference" value={<RedactedValue>{data.card_processor_reference ?? "No disponible"}</RedactedValue>} />
          <DetailRow label="Resumen" value={data.summary} />
          <DetailRow label="Asignado a" value={data.assigned_to ?? "No asignado"} />
          <DetailRow label="Abierto" value={formatDate(data.opened_at)} />
          <DetailRow label="Vence" value={data.due_at ? formatDate(data.due_at) : "No definido"} />
          <DetailRow label="Cerrado" value={data.closed_at ? formatDate(data.closed_at) : "No cerrado"} />
        </dl>
      </article>
      {hasPermission("admin.disputes.update") ? (
        <form className="panel form-grid" onSubmit={updateStatus}>
          <h2>Actualizar estado</h2>
          <label>
            Estado
            <select value={status} onChange={(event) => setStatus(event.target.value as DisputeCase["status"])}>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="EVIDENCE_GATHERING">EVIDENCE_GATHERING</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="WON">WON</option>
              <option value="LOST">LOST</option>
              <option value="CLOSED">CLOSED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </label>
          <label>
            assigned_to
            <input value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} inputMode="numeric" />
          </label>
          <button className="button" type="submit">Guardar estado</button>
        </form>
      ) : null}
      {hasPermission("admin.disputes.update") ? (
        <form className="panel form-grid" onSubmit={addEvidence}>
          <h2>Agregar evidencia</h2>
          <label>
            Tipo
            <select
              value={evidence.evidence_type}
              onChange={(event) => setEvidence({ ...evidence, evidence_type: event.target.value })}
            >
              <option value="payment_summary">payment_summary</option>
              <option value="receipt">receipt</option>
              <option value="provider_confirmation">provider_confirmation</option>
              <option value="card_processor_reference">card_processor_reference</option>
              <option value="support_note">support_note</option>
              <option value="manual_review">manual_review</option>
              <option value="reconciliation">reconciliation</option>
              <option value="customer_communication">customer_communication</option>
              <option value="other">other</option>
            </select>
          </label>
          <label>
            Titulo
            <input value={evidence.title} onChange={(event) => setEvidence({ ...evidence, title: event.target.value })} required />
          </label>
          <label>
            Storage reference
            <input
              value={evidence.storage_reference}
              onChange={(event) => setEvidence({ ...evidence, storage_reference: event.target.value })}
            />
          </label>
          <label>
            source_entity_type
            <input
              value={evidence.source_entity_type}
              onChange={(event) => setEvidence({ ...evidence, source_entity_type: event.target.value })}
            />
          </label>
          <label>
            source_entity_id
            <input value={evidence.source_entity_id} onChange={(event) => setEvidence({ ...evidence, source_entity_id: event.target.value })} />
          </label>
          <label>
            Descripcion
            <textarea value={evidence.description} onChange={(event) => setEvidence({ ...evidence, description: event.target.value })} />
          </label>
          <button className="button" type="submit">Agregar evidencia</button>
        </form>
      ) : null}
      {formError ? <ErrorState title="Operacion no aplicada" message={formError} /> : null}
      <section className="panel">
        <h2>Evidencia</h2>
        {data.evidence.length === 0 ? <EmptyState title="Sin evidencia" message="Aun no hay evidencia agregada al caso." /> : null}
        {data.evidence.length > 0 ? (
          <div className="note-list">
            {data.evidence.map((item) => (
              <article className="note" key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.evidence_type}</p>
                <small>{formatDate(item.created_at)}</small>
                <p>{item.description ?? "Sin descripcion"}</p>
                <RedactedValue>{item.storage_reference ?? "Sin storage reference"}</RedactedValue>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}
