import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { RedactedValue } from "../components/RedactedValue";
import { StatusBadge } from "../components/StatusBadge";
import type { AdminSearchResponse } from "../types/admin";

const SEARCH_TYPES = [
  { label: "Todos", value: "" },
  { label: "Usuario", value: "user" },
  { label: "Pago", value: "payment" },
  { label: "Recibo", value: "receipt" },
  { label: "Ticket", value: "ticket" },
  { label: "Revision manual", value: "manual_review" },
  { label: "Correlation ID", value: "correlation" },
  { label: "Provider reference", value: "provider_reference" },
];

export function SearchPage() {
  const api = useAdminApi();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [result, setResult] = useState<AdminSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setResult(await api.search({ q: query, type: type || undefined }));
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "No se pudo buscar referencias.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Busqueda operacional</h1>
          <p>Busca user_id, payment_id, receipt_id, ticket, manual review, correlation_id o provider_reference segura.</p>
        </div>
      </header>
      <form className="panel form-grid" onSubmit={submit}>
        <label>
          Referencia
          <input value={query} onChange={(event) => setQuery(event.target.value)} required minLength={1} />
        </label>
        <label>
          Tipo
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {SEARCH_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      {error ? <ErrorState title="Busqueda no disponible" message={error} /> : null}
      {result && !result.results.length ? (
        <EmptyState title="Sin resultados" message="No se encontro una entidad operacional con esa referencia." />
      ) : null}
      {result?.results.length ? (
        <article className="panel">
          <h2>Resultados</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>ID</th>
                  <th>Etiqueta</th>
                  <th>Estado</th>
                  <th>Correlation ID</th>
                  <th>Provider reference</th>
                </tr>
              </thead>
              <tbody>
                {result.results.map((item, index) => (
                  <tr key={`${item.entity_type}-${item.entity_id}-${index}`}>
                    <td>{item.entity_type}</td>
                    <td>{item.entity_id}</td>
                    <td>{item.label}</td>
                    <td>{item.status ? <StatusBadge value={item.status} /> : "No disponible"}</td>
                    <td>
                      <RedactedValue>{item.correlation_id ?? "No disponible"}</RedactedValue>
                    </td>
                    <td>
                      <RedactedValue>{item.provider_reference ?? "No disponible"}</RedactedValue>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ) : null}
    </section>
  );
}
