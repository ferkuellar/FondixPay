import { useAdminApi } from "../api/useAdminApi";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";

export function ProntipagosReconciliationPage() {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.prontipagosReconciliation(), [api]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Conciliacion Prontipagos no disponible" message={error ?? "Sin datos."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Conciliacion Prontipagos</h1>
          <p>Leg de pago del servicio. No es el procesador de tarjeta.</p>
        </div>
      </header>
      <article className="panel placeholder-panel">
        <StatusBadge value={data.status} />
        <h2>{data.message}</h2>
        <p>No hay conciliacion real de proveedor, receipt missing ni amount mismatch productivo todavia.</p>
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

function DetailLine({ label, value }: { label: string | number; value: string | number }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
