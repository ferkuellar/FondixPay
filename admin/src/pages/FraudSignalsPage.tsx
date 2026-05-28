import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { FraudSignal } from "../types/admin";
import { formatDate } from "../utils/format";

export function FraudSignalsPage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    signal_type: "duplicate_payment_attempt",
    severity: "medium",
    entity_type: "Payment",
    entity_id: "",
    payment_id: "",
    reason: "",
  });
  const { data, error, loading, reload } = useAdminResource(
    () => api.fraudSignals({ status, severity, payment_id: paymentId }),
    [api, status, severity, paymentId],
  );

  const createSignal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Crear senal de fraude para revision humana?")) return;
    try {
      await api.createFraudSignal({
        signal_type: draft.signal_type,
        severity: draft.severity as FraudSignal["severity"],
        entity_type: draft.entity_type,
        entity_id: draft.entity_id,
        payment_id: draft.payment_id ? Number(draft.payment_id) : null,
        reason: draft.reason,
      });
      setDraft({ ...draft, entity_id: "", payment_id: "", reason: "" });
      setFormError(null);
      reload();
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "No se pudo crear la senal.");
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Senales de fraude</h1>
          <p>Reglas explicables para revision interna. No bloquean usuarios ni cambian estados de pago.</p>
        </div>
      </header>
      <form className="panel form-grid">
        <h2>Filtros</h2>
        <label>
          Estado
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todos</option>
            <option value="open">open</option>
            <option value="reviewed">reviewed</option>
            <option value="dismissed">dismissed</option>
            <option value="escalated">escalated</option>
          </select>
        </label>
        <label>
          Severidad
          <select value={severity} onChange={(event) => setSeverity(event.target.value)}>
            <option value="">Todas</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="urgent">urgent</option>
          </select>
        </label>
        <label>
          payment_id
          <input value={paymentId} onChange={(event) => setPaymentId(event.target.value)} inputMode="numeric" />
        </label>
      </form>
      {hasPermission("admin.fraud_signals.update") ? (
        <form className="panel form-grid" onSubmit={createSignal}>
          <h2>Crear senal manual</h2>
          <label>
            Tipo
            <input
              value={draft.signal_type}
              onChange={(event) => setDraft({ ...draft, signal_type: event.target.value })}
              required
            />
          </label>
          <label>
            Severidad
            <select value={draft.severity} onChange={(event) => setDraft({ ...draft, severity: event.target.value })}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="urgent">urgent</option>
            </select>
          </label>
          <label>
            Entidad
            <input
              value={draft.entity_type}
              onChange={(event) => setDraft({ ...draft, entity_type: event.target.value })}
              required
            />
          </label>
          <label>
            entity_id
            <input value={draft.entity_id} onChange={(event) => setDraft({ ...draft, entity_id: event.target.value })} required />
          </label>
          <label>
            payment_id
            <input value={draft.payment_id} onChange={(event) => setDraft({ ...draft, payment_id: event.target.value })} inputMode="numeric" />
          </label>
          <label>
            Razon interna
            <textarea value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} required />
          </label>
          <button className="button" type="submit">Crear senal</button>
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      ) : null}
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Senales no disponibles" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin senales" message="No hay senales con los filtros actuales." /> : null}
      {data && data.length > 0 ? (
        <DataTable<FraudSignal>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "signal_id", render: (row) => row.id },
            { key: "type", header: "Tipo", render: (row) => row.signal_type },
            { key: "severity", header: "Severidad", render: (row) => <StatusBadge value={row.severity} /> },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.status} /> },
            { key: "entity", header: "Entidad", render: (row) => `${row.entity_type}:${row.entity_id}` },
            { key: "payment", header: "payment_id", render: (row) => row.payment_id ?? "No asociado" },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
            { key: "action", header: "Accion", render: (row) => <a href={`#/fraud-signals/${row.id}`}>Abrir</a> },
          ]}
        />
      ) : null}
    </section>
  );
}
