import { useState, type FormEvent } from "react";

import { useAdminAuth } from "../auth/AdminAuthProvider";
import { isAdminRole } from "../auth/permissions";
import type { AdminRole } from "../types/admin";

const ROLES: AdminRole[] = ["SUPPORT", "FINANCE", "ADMIN", "AUDITOR", "SUPER_ADMIN"];

export function LoginPage() {
  const { signIn, devAuthEnabled, role } = useAdminAuth();
  const [token, setToken] = useState("");
  const [devRole, setDevRole] = useState<AdminRole>(isAdminRole(role) ? role : "SUPER_ADMIN");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token.trim()) {
      setError("Pega un bearer token emitido por el backend para continuar.");
      return;
    }
    try {
      signIn(token.trim(), devAuthEnabled ? devRole : undefined);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "No se pudo iniciar la sesion.");
    }
  };

  return (
    <div className="login-shell">
      <section className="login-panel">
        <div>
          <strong>FondixPay CRM Admin</strong>
          <h1>Acceso operativo interno</h1>
          <p>
            La consola consume endpoints protegidos `/admin/*`. Pega un token admin vigente. El modo dev auth solo
            controla navegacion local; el backend sigue autorizando cada request.
          </p>
        </div>
        <form onSubmit={submit}>
          <label>
            Bearer token
            <textarea value={token} onChange={(event) => setToken(event.target.value)} rows={5} autoComplete="off" />
          </label>
          {devAuthEnabled ? (
            <label>
              Rol de desarrollo
              <select value={devRole} onChange={(event) => setDevRole(event.target.value as AdminRole)}>
                {ROLES.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          ) : (
            <p className="inline-warning">Dev auth deshabilitado. El backend debe devolver rol/permisos en una fase futura.</p>
          )}
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="button">
            Entrar al CRM
          </button>
        </form>
      </section>
    </div>
  );
}
