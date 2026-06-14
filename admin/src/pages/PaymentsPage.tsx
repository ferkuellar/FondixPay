import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { AdminPayment } from "../types/admin";
import { formatDate, formatMoney } from "../utils/format";

export function PaymentsPage() {
  const api = useAdminApi();
  const [draft, setDraft] = useState({ status: "", user_id: "", correlation_id: "" });
  const [filters, setFilters] = useState(draft);
  const { data, error, loading } = useAdminResource(() => api.payments(filters), [api, filters]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters({ ...draft });
  };

  return (
    <section className="page">
      <header className="page-header stacked">
        <div>
          <h1>Pagos</h1>
          <p>Detalle separa card status, servicio status, recibo y correlation_id.</p>
        </div>
        <form className="filters" onSubmit={submit}>
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="">Todos los estados</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
          <input value={draft.user_id} onChange={(event) => setDraft({ ...draft, user_id: event.target.value })} placeholder="user_id" />
          <input value={draft.correlation_id} onChange={(event) => setDraft({ ...draft, correlation_id: event.target.value })} placeholder="correlation_id" />
          <button className="button" type="submit">Filtrar</button>
        </form>
      </header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Pagos no disponibles" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin pagos" message="No hay pagos para estos filtros." /> : null}
      {data && data.length > 0 ? (
        <DataTable<AdminPayment>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "payment", header: "payment_id", render: (row) => row.id },
            { key: "user", header: "user_id", render: (row) => row.user_id },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.status} /> },
            { key: "amount", header: "Monto", render: (row) => formatMoney(row.amount_minor, row.currency) },
            { key: "fee", header: "Comision", render: (row) => formatMoney(row.fee_minor, row.currency) },
            { key: "total", header: "Total", render: (row) => formatMoney(row.total_minor, row.currency) },
            { key: "provider", header: "Proveedor", render: (row) => row.service_provider_name },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
            { key: "action", header: "Estado card/servicio", render: (row) => <a href={`#/payments/${row.id}`}>Ver detalle</a> },
          ]}
        />
      ) : null}
    </section>
  );
}
