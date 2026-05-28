import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { DisputeCase } from "../types/admin";
import { formatDate, formatMoney } from "../utils/format";

export function DisputesPage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const [status, setStatus] = useState("");
  const [caseType, setCaseType] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    case_type: "dispute",
    payment_id: "",
    user_id: "",
    amount_minor: "",
    reason_code: "",
    summary: "",
  });
  const { data, error, loading, reload } = useAdminResource(
    () => api.disputes({ status, case_type: caseType, payment_id: paymentId }),
    [api, status, caseType, paymentId],
  );

  const createCase = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Crear caso interno de disputa?")) return;
    try {
      await api.createDispute({
        case_type: draft.case_type as DisputeCase["case_type"],
        payment_id: draft.payment_id ? Number(draft.payment_id) : null,
        user_id: draft.user_id ? Number(draft.user_id) : null,
        amount_minor: draft.amount_minor ? Number(draft.amount_minor) : null,
        currency: "MXN",
        reason_code: draft.reason_code || null,
        summary: draft.summary,
      });
      setDraft({ ...draft, payment_id: "", user_id: "", amount_minor: "", reason_code: "", summary: "" });
      setFormError(null);
      reload();
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "No se pudo crear el caso.");
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Disputas y chargebacks</h1>
          <p>Casos internos para evidencia y seguimiento. No envian respuestas automaticas a redes de tarjeta.</p>
        </div>
      </header>
      <form className="panel form-grid">
        <h2>Filtros</h2>
        <label>
          Estado
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todos</option>
            <option value="OPEN">OPEN</option>
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
          Tipo
          <select value={caseType} onChange={(event) => setCaseType(event.target.value)}>
            <option value="">Todos</option>
            <option value="dispute">dispute</option>
            <option value="chargeback">chargeback</option>
          </select>
        </label>
        <label>
          payment_id
          <input value={paymentId} onChange={(event) => setPaymentId(event.target.value)} inputMode="numeric" />
        </label>
      </form>
      {hasPermission("admin.disputes.update") ? (
        <form className="panel form-grid" onSubmit={createCase}>
          <h2>Crear caso</h2>
          <label>
            Tipo
            <select value={draft.case_type} onChange={(event) => setDraft({ ...draft, case_type: event.target.value })}>
              <option value="dispute">dispute</option>
              <option value="chargeback">chargeback</option>
            </select>
          </label>
          <label>
            payment_id
            <input value={draft.payment_id} onChange={(event) => setDraft({ ...draft, payment_id: event.target.value })} inputMode="numeric" />
          </label>
          <label>
            user_id
            <input value={draft.user_id} onChange={(event) => setDraft({ ...draft, user_id: event.target.value })} inputMode="numeric" />
          </label>
          <label>
            amount_minor
            <input value={draft.amount_minor} onChange={(event) => setDraft({ ...draft, amount_minor: event.target.value })} inputMode="numeric" />
          </label>
          <label>
            reason_code
            <input value={draft.reason_code} onChange={(event) => setDraft({ ...draft, reason_code: event.target.value })} />
          </label>
          <label>
            Resumen
            <textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} required />
          </label>
          <button className="button" type="submit">Crear caso</button>
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      ) : null}
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Casos no disponibles" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin casos" message="No hay disputas con los filtros actuales." /> : null}
      {data && data.length > 0 ? (
        <DataTable<DisputeCase>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "case_id", render: (row) => row.id },
            { key: "type", header: "Tipo", render: (row) => row.case_type },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.status} /> },
            { key: "payment", header: "payment_id", render: (row) => row.payment_id ?? "No asociado" },
            { key: "amount", header: "Monto", render: (row) => (row.amount_minor == null ? "No disponible" : formatMoney(row.amount_minor, row.currency)) },
            { key: "reference", header: "Referencia", render: (row) => <RedactedValue>{row.provider_transaction_id ?? row.card_processor_reference ?? "No disponible"}</RedactedValue> },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.opened_at) },
            { key: "action", header: "Accion", render: (row) => <a href={`#/disputes/${row.id}`}>Abrir</a> },
          ]}
        />
      ) : null}
    </section>
  );
}
