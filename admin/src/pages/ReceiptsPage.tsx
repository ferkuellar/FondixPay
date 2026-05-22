import { useMemo, useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { AdminReceipt } from "../types/admin";
import { formatDate, formatMoney } from "../utils/format";

export function ReceiptsPage() {
  const api = useAdminApi();
  const [draft, setDraft] = useState({ user_id: "", payment_id: "", status: "" });
  const [filters, setFilters] = useState(draft);
  const { data, error, loading } = useAdminResource(
    () => api.receipts({ user_id: filters.user_id, payment_id: filters.payment_id }),
    [api, filters.user_id, filters.payment_id],
  );
  const rows = useMemo(
    () => (filters.status ? data?.filter((receipt) => receipt.payment_status === filters.status) ?? [] : data ?? []),
    [data, filters.status],
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters({ ...draft });
  };

  return (
    <section className="page">
      <header className="page-header stacked">
        <div>
          <h1>Recibos</h1>
          <p>Recibos seguros; el proof status y correlation_id se consultan en detalle.</p>
        </div>
        <form className="filters" onSubmit={submit}>
          <input value={draft.user_id} onChange={(event) => setDraft({ ...draft, user_id: event.target.value })} placeholder="user_id" />
          <input value={draft.payment_id} onChange={(event) => setDraft({ ...draft, payment_id: event.target.value })} placeholder="payment_id" />
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
            <option value="">Estado pago</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
          <button className="button" type="submit">Filtrar</button>
        </form>
      </header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Recibos no disponibles" message={error} /> : null}
      {!loading && !error && rows.length === 0 ? <EmptyState title="Sin recibos" message="No hay recibos visibles con estos filtros." /> : null}
      {rows.length ? (
        <DataTable<AdminReceipt>
          rows={rows}
          getRowKey={(row) => row.id}
          columns={[
            { key: "receipt", header: "receipt_id", render: (row) => row.id },
            { key: "payment", header: "payment_id", render: (row) => row.payment_id },
            { key: "status", header: "Estado pago", render: (row) => <StatusBadge value={row.payment_status} /> },
            { key: "folio", header: "Folio", render: (row) => row.folio },
            { key: "total", header: "Total", render: (row) => formatMoney(row.total_minor, row.currency) },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
            { key: "action", header: "Accion", render: (row) => <a href={`#/receipts/${row.id}`}>Ver proof</a> },
          ]}
        />
      ) : null}
    </section>
  );
}
