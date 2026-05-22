import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { AuditEvent } from "../types/admin";
import { formatDate } from "../utils/format";
import { detectSensitiveLeak } from "../utils/redaction";

export function AuditLogsPage() {
  const api = useAdminApi();
  const [draft, setDraft] = useState({ event_type: "", actor_id: "", entity_id: "", correlation_id: "" });
  const [filters, setFilters] = useState(draft);
  const { data, error, loading } = useAdminResource(() => api.auditEvents(filters), [api, filters]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters({ ...draft });
  };

  return (
    <section className="page">
      <header className="page-header stacked">
        <div>
          <h1>Audit logs</h1>
          <p>Solo lectura. Metadata sensible se bloquea visualmente si aparece una clave prohibida.</p>
        </div>
        <form className="filters" onSubmit={submit}>
          <input value={draft.event_type} onChange={(event) => setDraft({ ...draft, event_type: event.target.value })} placeholder="event_type" />
          <input value={draft.actor_id} onChange={(event) => setDraft({ ...draft, actor_id: event.target.value })} placeholder="actor_id" />
          <input value={draft.entity_id} onChange={(event) => setDraft({ ...draft, entity_id: event.target.value })} placeholder="entity_id" />
          <input value={draft.correlation_id} onChange={(event) => setDraft({ ...draft, correlation_id: event.target.value })} placeholder="correlation_id" />
          <button className="button" type="submit">Filtrar</button>
        </form>
      </header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Audit logs no disponibles" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin eventos" message="No hay eventos visibles para estos filtros." /> : null}
      {data && data.length > 0 ? (
        <DataTable<AuditEvent>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "event_id", render: (row) => row.id },
            { key: "event", header: "Evento", render: (row) => row.event_type },
            { key: "actor", header: "Actor", render: (row) => `${row.actor_type}:${row.actor_id ?? "-"}` },
            { key: "entity", header: "Entidad", render: (row) => `${row.entity_type ?? "-"}:${row.entity_id ?? "-"}` },
            { key: "result", header: "Resultado", render: (row) => <StatusBadge value={row.result} /> },
            { key: "correlation", header: "Correlation", render: (row) => <RedactedValue>{row.correlation_id ?? "-"}</RedactedValue> },
            {
              key: "metadata",
              header: "Metadata",
              render: (row) => detectSensitiveLeak(row.metadata) ? "[REDACTED UI BLOCK]" : JSON.stringify(row.metadata ?? {}),
            },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
          ]}
        />
      ) : null}
    </section>
  );
}
