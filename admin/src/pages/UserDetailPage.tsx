import { useAdminApi } from "../api/useAdminApi";
import { DetailRow } from "../components/DetailRow";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import { formatDate } from "../utils/format";

export function UserDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.user(id), [api, id]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Usuario no disponible" message={error ?? "No existe el usuario."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Usuario #{data.id}</h1>
          <p>Detalle limitado por rol. El backend no expone secretos ni perfil completo.</p>
        </div>
      </header>
      <article className="panel">
        <dl>
          <DetailRow label="Telefono" value={<RedactedValue>{data.phone}</RedactedValue>} />
          <DetailRow label="Nombre" value={data.name ?? "Sin nombre"} />
          <DetailRow label="Rol" value={data.role} />
          <DetailRow label="Estado" value={<StatusBadge value={data.is_active ? "active" : "closed"} />} />
          <DetailRow label="Alta" value={formatDate(data.created_at)} />
        </dl>
      </article>
      <div className="split-panels">
        <article className="panel">
          <h2>Pagos recientes</h2>
          {data.recent_payment_ids?.length ? (
            <div className="reference-list">
              {data.recent_payment_ids.map((paymentId) => <a key={paymentId} href={`#/payments/${paymentId}`}>payment_id {paymentId}</a>)}
            </div>
          ) : (
            <EmptyState title="Sin pagos recientes" message="El backend no devolvio pagos asociados." />
          )}
        </article>
        <article className="panel">
          <h2>Recibos</h2>
          {data.receipt_ids?.length ? (
            <div className="reference-list">
              {data.receipt_ids.map((receiptId) => <a key={receiptId} href={`#/receipts/${receiptId}`}>receipt_id {receiptId}</a>)}
            </div>
          ) : (
            <EmptyState title="Sin recibos" message="Consulta recibos por payment_id cuando exista evidencia." />
          )}
        </article>
      </div>
    </section>
  );
}
