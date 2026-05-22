import { useAdminApi } from "../api/useAdminApi";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { ManualReviewCase } from "../types/admin";
import { formatDate } from "../utils/format";

export function ManualReviewPage() {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.manualReview(), [api]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Revision manual</h1>
          <p>Casos ambiguos. Resolver no reescribe ledger ni confirma proveedores.</p>
        </div>
      </header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Cola no disponible" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin casos" message="No hay casos manuales abiertos en la cola." /> : null}
      {data && data.length > 0 ? (
        <DataTable<ManualReviewCase>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "case_id", render: (row) => row.id },
            { key: "type", header: "Tipo", render: (row) => row.case_type },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.status} /> },
            { key: "severity", header: "Severidad", render: (row) => <StatusBadge value={row.severity} /> },
            { key: "payment", header: "payment_id", render: (row) => row.payment_id ?? "No asociado" },
            { key: "correlation", header: "correlation_id", render: (row) => <RedactedValue>{row.correlation_id ?? "No disponible"}</RedactedValue> },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
            { key: "action", header: "Accion", render: (row) => <a href={`#/manual-review/${row.id}`}>Abrir</a> },
          ]}
        />
      ) : null}
    </section>
  );
}
