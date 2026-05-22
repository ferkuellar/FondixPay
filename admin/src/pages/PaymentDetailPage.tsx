import { useAdminApi } from "../api/useAdminApi";
import { DetailRow } from "../components/DetailRow";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import { formatDate, formatMoney } from "../utils/format";

export function PaymentDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.payment(id), [api, id]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Pago no disponible" message={error ?? "No existe el pago."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Pago #{data.id}</h1>
          <p>La vista separa pago, card processor mock, Prontipagos mock y recibo.</p>
        </div>
        {data.receipt_id ? <a className="button button-link" href={`#/receipts/${data.receipt_id}`}>Abrir recibo</a> : null}
      </header>
      <div className="split-panels">
        <article className="panel">
          <h2>Breakdown</h2>
          <dl>
            <DetailRow label="Monto servicio" value={formatMoney(data.amount_minor, data.currency)} />
            <DetailRow label="Comision" value={formatMoney(data.fee_minor, data.currency)} />
            <DetailRow label="Total" value={formatMoney(data.total_minor, data.currency)} />
            <DetailRow label="Estado pago" value={<StatusBadge value={data.status} />} />
            <DetailRow label="Sandbox/mock" value={data.is_mock ? "Si" : "No"} />
          </dl>
        </article>
        <article className="panel">
          <h2>Estados operativos</h2>
          <dl>
            <DetailRow label="Card status" value={<StatusBadge value={data.card_status} />} />
            <DetailRow label="Prontipagos status" value={<StatusBadge value={data.service_payment_status} />} />
            <DetailRow label="Receipt status" value={<StatusBadge value={data.receipt_status} />} />
            <DetailRow label="Correlation ID" value={<RedactedValue>{data.correlation_id ?? "No disponible"}</RedactedValue>} />
            <DetailRow label="Provider reference" value={<RedactedValue>{data.provider_reference ?? "Limitada por rol/backend"}</RedactedValue>} />
          </dl>
        </article>
      </div>
      <article className="panel">
        <h2>Servicio</h2>
        <dl>
          <DetailRow label="Proveedor" value={data.service_provider_name} />
          <DetailRow label="Servicio" value={data.service_name} />
          <DetailRow label="Referencia" value={<RedactedValue>{data.service_reference_masked}</RedactedValue>} />
          <DetailRow label="user_id" value={data.user_id} />
          <DetailRow label="Fecha" value={formatDate(data.created_at)} />
        </dl>
      </article>
    </section>
  );
}
