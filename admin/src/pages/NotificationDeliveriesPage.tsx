import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { AdminNotificationDelivery } from "../types/admin";
import { formatDate } from "../utils/format";

export function NotificationDeliveriesPage() {
  const api = useAdminApi();
  const [draft, setDraft] = useState({ status: "", template_name: "", user_id: "" });
  const [filters, setFilters] = useState(draft);
  const { data, error, loading } = useAdminResource(() => api.notificationDeliveries(filters), [api, filters]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters({ ...draft });
  };

  return (
    <section className="page">
      <header className="page-header stacked">
        <div>
          <h1>Notificaciones WhatsApp</h1>
          <p>Deliveries append-only del template fondix_pago_exitoso. Telefonos completos no se muestran.</p>
        </div>
        <form className="filters" onSubmit={submit}>
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="">Todos los estados</option>
            <option value="sent">sent</option>
            <option value="failed">failed</option>
            <option value="sending">sending</option>
            <option value="created">created</option>
          </select>
          <input
            value={draft.template_name}
            onChange={(event) => setDraft({ ...draft, template_name: event.target.value })}
            placeholder="template_name"
          />
          <input value={draft.user_id} onChange={(event) => setDraft({ ...draft, user_id: event.target.value })} placeholder="user_id" />
          <button className="button" type="submit">Filtrar</button>
        </form>
      </header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Deliveries no disponibles" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin deliveries" message="No hay entregas para estos filtros." /> : null}
      {data && data.length > 0 ? (
        <DataTable<AdminNotificationDelivery>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "template", header: "Template", render: (row) => row.template_name },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.status} /> },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
            { key: "recipient", header: "Destino", render: (row) => row.recipient_masked },
            { key: "entity", header: "Entidad", render: (row) => `${row.entity_type} ${row.entity_id}` },
            { key: "error", header: "Error seguro", render: (row) => row.error_message_safe ?? "-" },
          ]}
        />
      ) : null}
    </section>
  );
}
