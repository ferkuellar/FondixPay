import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import { formatDate } from "../utils/format";
import type { AdminUser } from "../types/admin";

export function UsersPage() {
  const api = useAdminApi();
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const { data, error, loading } = useAdminResource(() => api.users({ q: query }), [api, query]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(draft.trim());
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Busqueda por contexto seguro y telefono ya redactado segun rol backend.</p>
        </div>
        <form className="filters" onSubmit={submit}>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Buscar telefono o nombre" />
          <button className="button" type="submit">Buscar</button>
        </form>
      </header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="No se pudieron cargar usuarios" message={error} /> : null}
      {data && data.length === 0 ? <EmptyState title="Sin usuarios" message="No hay coincidencias para este filtro." /> : null}
      {data && data.length > 0 ? (
        <DataTable<AdminUser>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "user_id", render: (row) => row.id },
            { key: "phone", header: "Telefono", render: (row) => row.phone },
            { key: "name", header: "Nombre", render: (row) => row.name ?? "Sin nombre" },
            { key: "role", header: "Rol", render: (row) => row.role },
            { key: "state", header: "Estado", render: (row) => <StatusBadge value={row.is_active ? "active" : "closed"} /> },
            { key: "created", header: "Alta", render: (row) => formatDate(row.created_at) },
            { key: "action", header: "Accion", render: (row) => <a href={`#/users/${row.id}`}>Ver detalle</a> },
          ]}
        />
      ) : null}
    </section>
  );
}
