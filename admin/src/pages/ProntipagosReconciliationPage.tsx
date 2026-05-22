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
      </article>
    </section>
  );
}
