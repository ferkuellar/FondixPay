import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import { useAdminApi } from "../api/useAdminApi";

export function DashboardPage() {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.dashboard(), [api]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Dashboard no disponible" message={error ?? "No hay resumen."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Dashboard operativo</h1>
          <p>Contadores backend para el CRM mock/sandbox. No indican produccion lista.</p>
        </div>
      </header>
      <div className="stats-grid">
        <StatCard label="Usuarios" value={data.users_count} />
        <StatCard label="Pagos" value={data.payments_count} />
        <StatCard label="Pagos exitosos" value={data.payments_succeeded_count} />
        <StatCard label="Pagos pendientes" value={data.payments_pending_count} />
        <StatCard label="Pagos fallidos" value={data.payments_failed_count} />
        <StatCard label="Recibos generados" value={data.receipts_generated_count} />
        <StatCard label="Recibos pendientes" value={data.receipts_pending_count ?? "Pendiente"} hint="Requiere estado persistido." />
        <StatCard label="Revision manual" value={data.manual_review_open_count} />
        <StatCard label="Tickets abiertos" value={data.support_tickets_open_count} />
      </div>
      <div className="split-panels">
        <article className="panel">
          <h2>Conciliacion</h2>
          <dl>
            <div className="detail-row">
              <dt>Tarjeta</dt>
              <dd><StatusBadge value={data.card_reconciliation_status} /></dd>
            </div>
          </dl>
        </article>
        <article className="panel">
          <h2>Nota operacional</h2>
          <p>{data.note ?? "Usa pagos, recibos y audit logs para investigar referencias seguras."}</p>
        </article>
      </div>
    </section>
  );
}
