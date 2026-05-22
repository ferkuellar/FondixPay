import { useAdminApi } from "../api/useAdminApi";
import { DetailRow } from "../components/DetailRow";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import { formatDate, formatMoney } from "../utils/format";

export function ReceiptDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.receipt(id), [api, id]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState title="Recibo no disponible" message={error ?? "No existe el recibo."} />;

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Recibo #{data.id}</h1>
          <p>Prueba mock/sandbox operativa. No es comprobante fiscal.</p>
        </div>
        <a className="button button-link" href={`#/payments/${data.payment_id}`}>Abrir pago</a>
      </header>
      <div className="split-panels">
        <article className="panel">
          <h2>Proof status</h2>
          <dl>
            <DetailRow label="Receipt status" value={<StatusBadge value={data.receipt_status} />} />
            <DetailRow label="Proof status" value={<StatusBadge value={data.proof_status} />} />
            <DetailRow label="Payment status" value={<StatusBadge value={data.payment_status} />} />
            <DetailRow label="Mock" value={data.is_mock ? "Si" : "No"} />
          </dl>
        </article>
        <article className="panel">
          <h2>Referencias seguras</h2>
          <dl>
            <DetailRow label="Folio" value={<RedactedValue>{data.folio}</RedactedValue>} />
            <DetailRow label="Provider reference" value={<RedactedValue>{data.provider_reference ?? "Limitada por backend"}</RedactedValue>} />
            <DetailRow label="Correlation ID" value={<RedactedValue>{data.correlation_id ?? "No disponible"}</RedactedValue>} />
            <DetailRow label="Fecha" value={formatDate(data.created_at)} />
          </dl>
        </article>
      </div>
      <article className="panel">
        <h2>Breakdown</h2>
        <dl>
          <DetailRow label="Monto servicio" value={formatMoney(data.amount_minor, data.currency)} />
          <DetailRow label="Comision" value={formatMoney(data.fee_minor, data.currency)} />
          <DetailRow label="Total" value={formatMoney(data.total_minor, data.currency)} />
          <DetailRow label="Mensaje backend" value={data.message} />
        </dl>
      </article>
    </section>
  );
}
