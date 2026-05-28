import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DetailRow } from "../components/DetailRow";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { FraudSignal } from "../types/admin";
import { formatDate } from "../utils/format";

export function FraudSignalDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.fraudSignal(id), [api, id]);
  const [status, setStatus] = useState<FraudSignal["status"]>("reviewed");
  const [resolution, setResolution] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Actualizar senal de fraude?")) return;
    try {
      await api.updateFraudSignalStatus(id, { status, resolution });
      setResolution("");
      setFormError(null);
      reload();
    } catch (updateError) {
      setFormError(updateError instanceof Error ? updateError.message : "No se pudo actualizar la senal.");
    }
  };

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Senal no disponible" message={error ?? "No existe la senal."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Senal #{data.id}</h1>
          <p>{data.signal_type}</p>
        </div>
      </header>
      <article className="panel">
        <dl>
          <DetailRow label="Estado" value={<StatusBadge value={data.status} />} />
          <DetailRow label="Severidad" value={<StatusBadge value={data.severity} />} />
          <DetailRow label="Entidad" value={`${data.entity_type}:${data.entity_id}`} />
          <DetailRow label="user_id" value={data.user_id ?? "No asociado"} />
          <DetailRow label="payment_id" value={data.payment_id ?? "No asociado"} />
          <DetailRow label="transaction_id" value={data.transaction_id ?? "No asociado"} />
          <DetailRow label="Razon" value={data.reason} />
          <DetailRow label="Resolucion" value={data.resolution ?? "Sin resolucion"} />
          <DetailRow label="Creado por" value={data.created_by} />
          <DetailRow label="Creado" value={formatDate(data.created_at)} />
          <DetailRow label="Revisado por" value={data.reviewed_by ?? "No revisado"} />
          <DetailRow label="Revisado" value={data.reviewed_at ? formatDate(data.reviewed_at) : "No revisado"} />
        </dl>
      </article>
      {hasPermission("admin.fraud_signals.update") ? (
        <form className="panel form-grid" onSubmit={submit}>
          <h2>Actualizar revision</h2>
          <label>
            Estado
            <select value={status} onChange={(event) => setStatus(event.target.value as FraudSignal["status"])}>
              <option value="reviewed">reviewed</option>
              <option value="dismissed">dismissed</option>
              <option value="escalated">escalated</option>
            </select>
          </label>
          <label>
            Resolucion interna
            <textarea value={resolution} onChange={(event) => setResolution(event.target.value)} required />
          </label>
          <button className="button" type="submit">Guardar revision</button>
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      ) : null}
    </section>
  );
}
