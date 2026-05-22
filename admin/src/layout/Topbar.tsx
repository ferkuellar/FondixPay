import { useAdminAuth } from "../auth/AdminAuthProvider";

export function Topbar() {
  const { role, logout, devAuthEnabled } = useAdminAuth();

  return (
    <header className="topbar">
      <div>
        <strong>Operacion interna</strong>
        <span>{devAuthEnabled ? "DEV AUTH habilitado. No usar en produccion." : "Token admin requerido."}</span>
      </div>
      <div className="topbar-actions">
        <span className="environment-pill">DEV / SANDBOX</span>
        <span className="role-pill">{role ?? "Sin rol"}</span>
        <button type="button" className="button button-quiet" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  );
}
