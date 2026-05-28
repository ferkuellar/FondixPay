import { useAdminAuth } from "../auth/AdminAuthProvider";

type TopbarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  environment: "DEV" | "STAGING" | "PRODUCTION";
  onEnvironmentChange: (value: "DEV" | "STAGING" | "PRODUCTION") => void;
};

export function Topbar({ theme, onToggleTheme, environment, onEnvironmentChange }: TopbarProps) {
  const { role, logout, devAuthEnabled } = useAdminAuth();
  const envLabel = environment === "DEV" ? "DEV / SANDBOX" : environment;

  return (
    <header className="topbar">
      <div>
        <input aria-label="Buscar en CRM" className="topbar-search" placeholder="Buscar usuarios, pagos, tickets..." />
      </div>
      <div className="topbar-actions">
        <button type="button" className="icon-button" onClick={onToggleTheme} aria-label="Cambiar tema">
          {theme === "dark" ? "☾" : "☼"}
        </button>
        <button type="button" className="icon-button bell-button" aria-label="Notificaciones">🔔</button>
        <select className="environment-select" value={environment} onChange={(event) => onEnvironmentChange(event.target.value as "DEV" | "STAGING" | "PRODUCTION")}>
          <option value="DEV">DEV</option>
          <option value="STAGING">STAGING</option>
          <option value="PRODUCTION">PRODUCTION</option>
        </select>
        <span className="environment-pill">● {envLabel}</span>
        <span className="role-pill">{role ?? "Sin rol"}</span>
        <button type="button" className="button button-quiet" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  );
}
