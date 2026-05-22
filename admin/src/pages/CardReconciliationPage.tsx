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
          <p>Leg del futuro card processor. Separado de Prontipagos.</p>
        </div>
      </header>
      <article className="panel placeholder-panel">
        <StatusBadge value={data.status} />
        <h2>{data.message}</h2>
        <p>No hay reportes reales de cargos, capturas, declinaciones ni mismatches en esta fase.</p>
      </article>
    </section>
  );
}
