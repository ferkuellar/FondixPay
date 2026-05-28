import { useEffect, useState, type ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("fondix_admin_theme") === "dark" ? "dark" : "light"));
  const [environment, setEnvironment] = useState<"DEV" | "STAGING" | "PRODUCTION">(() => (localStorage.getItem("fondix_admin_environment") as "DEV" | "STAGING" | "PRODUCTION" | null) ?? "DEV");
  const [bannerHidden, setBannerHidden] = useState(() => localStorage.getItem("fondix_admin_dev_banner_hidden") === "true");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fondix_admin_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fondix_admin_environment", environment);
  }, [environment]);

  const showDevBanner = environment !== "PRODUCTION" && !bannerHidden;

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="workspace">
        <Topbar
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          environment={environment}
          onEnvironmentChange={setEnvironment}
        />
        {showDevBanner ? (
          <div className="dev-auth-banner">
            <span>Operación interna · DEV AUTH habilitado. No usar en producción.</span>
            <button type="button" onClick={() => {
              localStorage.setItem("fondix_admin_dev_banner_hidden", "true");
              setBannerHidden(true);
            }} aria-label="Ocultar aviso">×</button>
          </div>
        ) : null}
        <main>{children}</main>
      </div>
    </div>
  );
}
