import { useAdminApi } from "../api/useAdminApi";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";

export function CardReconciliationPage() {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.cardReconciliation(), [api]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Conciliacion tarjeta no disponible" message={error ?? "Sin datos."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Conciliacion de tarjeta</h1>
          <p>Conciliacion del card processor. El proveedor de servicios se define en un sprint futuro.</p>
        </div>
      </header>
      <article className="panel placeholder-panel">
        <StatusBadge value={data.status} />
        <h2>{data.message}</h2>
        <p>No hay reportes reales de cargos, capturas, declinaciones ni mismatches en esta fase.</p>
        <dl>
          <DetailLine label="Proveedor" value={data.provider_type} />
          <DetailLine label="Produccion lista" value={data.production_ready ? "Si" : "No"} />
          <DetailLine label="Mismatches" value={data.summary.mismatch_count} />
          <DetailLine label="Pendientes" value={data.summary.pending_count} />
          <DetailLine label="Manual review" value={data.summary.manual_review_count} />
        </dl>
      </article>
    </section>
  );
}

function DetailLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
