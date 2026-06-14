import { useEffect, useRef, useState } from "react";

import { useAdminApi } from "../api/useAdminApi";
import type { AdminOperatorCreate, CategoryVolumePoint, HourlyTrafficPoint, PaymentTrendPoint } from "../api/adminClient";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { ChatOperationsPage } from "../pages/ChatOperationsPage";
import type { AdminPayment, AdminReceipt, AdminUser, AuditEvent, SupportTicket } from "../types/admin";
import { formatDate, formatMoney } from "../utils/format";
import "./crmVisual.css";

type ModuleKey =
  | "dashboard"
  | "users"
  | "payments"
  | "receipts"
  | "search"
  | "tickets"
  | "chat"
  | "reconciliation-tekae"
  | "audit-logs"
  | "bot-landing"
  | "admin-users";

type NavItem = {
  key: ModuleKey;
  label: string;
  icon: IconName;
  badge?: number;
  requiredRole?: string;
};

type IconName =
  | "dashboard"
  | "users"
  | "payments"
  | "receipts"
  | "search"
  | "tickets"
  | "chat"
  | "shield"
  | "fraud"
  | "disputes"
  | "recon"
  | "audit"
  | "bell"
  | "moon"
  | "sun"
  | "refresh"
  | "download"
  | "plus"
  | "eye"
  | "bot"
  | "check"
  | "arrowUp"
  | "arrowDn"
  | "sparkle"
  | "x";

const routes: Record<ModuleKey, string> = {
  dashboard: "/dashboard",
  users: "/users",
  payments: "/payments",
  receipts: "/receipts",
  search: "/search",
  tickets: "/tickets",
  chat: "/chat",
  "reconciliation-tekae": "/reconciliation/tekae",
  "audit-logs": "/audit-logs",
  "bot-landing": "/chatbot",
  "admin-users": "/admin-users",
};

const routeToKey: Record<string, ModuleKey> = Object.fromEntries(
  Object.entries(routes).map(([key, value]) => [value, key]),
) as Record<string, ModuleKey>;

const navGroups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Operación",
    items: [
      { key: "dashboard", label: "Dashboard", icon: "dashboard" },
      { key: "users", label: "Usuarios", icon: "users" },
      { key: "payments", label: "Pagos", icon: "payments" },
      { key: "receipts", label: "Recibos", icon: "receipts" },
      { key: "search", label: "Búsqueda", icon: "search" },
      { key: "tickets", label: "Tickets", icon: "tickets", badge: 23 },
      { key: "bot-landing", label: "Bot de Landing", icon: "bot" },
    ],
  },
  {
    title: "Finanzas",
    items: [
      { key: "reconciliation-tekae", label: "Conciliación Tekae", icon: "recon" },
    ],
  },
  {
    title: "Administración",
    items: [
      { key: "audit-logs", label: "Audit logs", icon: "audit" },
      { key: "admin-users", label: "Operadores", icon: "shield", requiredRole: "SUPER_ADMIN" },
    ],
  },
];


type BotIdentity = {
  name: string;
  tagline: string;
  tooltip: string;
  greeting: string;
};

type BotPill = {
  id: string;
  label: string;
  q: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const BOT_DEFAULT_PROMPT = `Eres el asistente virtual de FONDIX PAY, una app mexicana para pagar servicios del hogar.

Información clave:
- Servicios soportados: CFE (luz), agua (SACMEX, SIAPA y 28 organismos municipales), internet (Izzi, Totalplay, Megacable, Axtel, Telmex), gas (Gas Natural, Ecogas), tiempo aire (Telcel, Movistar, AT&T), streaming (Netflix, Spotify, Disney+, HBO Max, Prime Video), gobierno (predial, tenencia, multas, en 13 estados y 40+ municipios).
- Comisiones: $0 - sin comisión adicional sobre el monto del recibo.
- Cobertura: 32 estados de México, +200 servicios totales (38 nacionales + 162 locales/regionales).
- Tiempo de proceso: pago se aplica en segundos; comprobante por canal aprobado en pocos segundos.
- Cómo registrarte: descarga la app en App Store o Google Play, te registras con tu número de celular en 2 minutos.
- Métodos de pago: tarjeta débito/crédito mexicana.

Tono: coloquial mexicano, cercano y amable. Usa "tú", responde corto (1-3 oraciones), usa emojis ocasionalmente al final de frases positivas.

Si la pregunta no es sobre FONDIX PAY, redirige amablemente: "Ese tema sale del radar, pero si quieres saber de pagos de servicios soy todo oídos."`;

const botPillsInitial: BotPill[] = [
  { id: "p1", label: "Servicios disponibles", q: "¿Qué servicios puedo pagar?" },
  { id: "p2", label: "Comisiones", q: "¿Cuánto cobran de comisión?" },
  { id: "p3", label: "Cobertura", q: "¿En qué estados funciona?" },
  { id: "p4", label: "Cómo empezar", q: "¿Cómo me registro?" },
];



function currentPath() {
  return window.location.hash.replace(/^#/, "") || "/dashboard";
}

function keyFromPath(path: string): ModuleKey {
  return routeToKey[path] ?? "dashboard";
}

function setHashForKey(key: ModuleKey) {
  window.location.hash = routes[key];
}

export function CrmVisualApp() {
  const { logout, role, devAuthEnabled } = useAdminAuth();
  const [path, setPath] = useState(currentPath);
  const [theme, setTheme] = useState<"light" | "dark">(
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const [environment, setEnvironment] = useState<"DEV" | "STAGING" | "PRODUCTION">("DEV");
  const [showBanner, setShowBanner] = useState(() => localStorage.getItem("crm-dev-banner-hidden") !== "1");
  const activeKey = keyFromPath(path);

  useEffect(() => {
    const sync = () => setPath(currentPath());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const hideBanner = () => {
    localStorage.setItem("crm-dev-banner-hidden", "1");
    setShowBanner(false);
  };

  return (
    <div className="crm-shell">
      <aside className="crm-sidebar">
        <div className="crm-brand">
          <strong>FondixPay</strong>
          <span>CRM Admin</span>
        </div>
        <nav className="crm-nav" aria-label="Módulos CRM">
          {navGroups.map((group) => (
            <div className="crm-nav-group" key={group.title}>
              <div className="crm-nav-group-title">{group.title}</div>
              {group.items.filter((item) => !item.requiredRole || item.requiredRole === role).map((item) => (
                <a
                  className={`crm-nav-link ${activeKey === item.key ? "active" : ""}`}
                  href={`#${routes[item.key]}`}
                  key={item.key}
                  onClick={(event) => {
                    event.preventDefault();
                    setHashForKey(item.key);
                  }}
                >
                  <Icon name={item.icon} />
                  <span className="crm-nav-label">{item.label}</span>
                  {item.badge ? <span className="crm-nav-badge">{item.badge}</span> : null}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className="crm-user">
          <span className="crm-avatar">AV</span>
          <div>
            <strong>Ana Vega</strong>
            <span>ana.vega@fondix.mx</span>
          </div>
        </div>
      </aside>

      <section className="crm-main">
        <header className="crm-topbar">
          <div className="crm-search">
            <Icon name="search" />
            <input aria-label="Buscar" placeholder="Buscar transacción, usuario, ticket..." />
            <span className="crm-shortcut">⌘K</span>
          </div>
          <div className="crm-top-actions">
            <button className="crm-icon-btn" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Cambiar tema">
              <Icon name={theme === "dark" ? "sun" : "moon"} />
            </button>
            <button className="crm-icon-btn has-dot" type="button" aria-label="Notificaciones">
              <Icon name="bell" />
            </button>
            <select className="crm-select" style={{ width: 112, minHeight: 34 }} value={environment} onChange={(event) => setEnvironment(event.target.value as "DEV" | "STAGING" | "PRODUCTION")}>
              <option value="DEV">DEV</option>
              <option value="STAGING">STAGING</option>
              <option value="PRODUCTION">PRODUCTION</option>
            </select>
            <span className="crm-pill crm-env"><i className="crm-env-dot" />{environment === "DEV" ? "DEV / SANDBOX" : environment}</span>
            <span className="crm-pill crm-role">{role ?? "SUPER_ADMIN"}</span>
            <button className="crm-btn" type="button" onClick={() => logout()}>Salir</button>
          </div>
        </header>
        {showBanner && environment !== "PRODUCTION" && devAuthEnabled ? (
          <div className="crm-banner">
            <span>⚠ Operación interna · DEV AUTH habilitado. No usar en producción.</span>
            <button type="button" onClick={hideBanner} aria-label="Ocultar banner">×</button>
          </div>
        ) : null}
        <main className="crm-content">{renderView(activeKey)}</main>
      </section>
    </div>
  );
}

function renderView(key: ModuleKey) {
  switch (key) {
    case "dashboard":
      return <DashboardView />;
    case "users":
      return <UsersView />;
    case "payments":
      return <PaymentsView />;
    case "receipts":
      return <ReceiptsView />;
    case "search":
      return <SearchView />;
    case "tickets":
      return <TicketsView />;
    case "chat":
      return <ChatOperationsPage />;
    case "reconciliation-tekae":
      return <ReconciliationView title="Conciliación Tekae" subtitle="Cuadre entre pagos procesados por Tekae y comisiones correspondientes a FondixPay" />;
    case "audit-logs":
      return <AuditLogsView />;
    case "bot-landing":
      return <BotLandingView />;
    case "admin-users":
      return <AdminUsersView />;
  }
}

function ViewHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="crm-view-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div style={{ display: "flex", gap: 8 }}>{actions}</div> : null}
    </div>
  );
}

type DashboardAlert = { title: string; detail: string; tone: "danger" | "pending" | "info" };

function buildAlerts(summary: {
  payments_failed_count: number;
  payments_pending_count: number;
  manual_review_open_count: number;
  support_tickets_open_count: number;
  card_reconciliation_status: string;
}): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];
  if (summary.payments_failed_count > 0) {
    alerts.push({ title: `${summary.payments_failed_count} pagos fallidos`, detail: "Revisar en la vista de Pagos para diagnóstico.", tone: "danger" });
  }
  if (summary.payments_pending_count > 5) {
    alerts.push({ title: `${summary.payments_pending_count} pagos pendientes`, detail: "Volumen inusualmente alto de pagos sin confirmar.", tone: "pending" });
  }
  if (summary.manual_review_open_count > 0) {
    alerts.push({ title: `${summary.manual_review_open_count} casos en revisión manual`, detail: "Casos abiertos que requieren acción.", tone: "pending" });
  }
  if (summary.support_tickets_open_count > 3) {
    alerts.push({ title: `${summary.support_tickets_open_count} tickets abiertos`, detail: "Cola de soporte por encima del umbral de 3.", tone: "info" });
  }
  if (summary.card_reconciliation_status !== "ok" && summary.card_reconciliation_status !== "not_implemented") {
    alerts.push({ title: `Conciliación: ${summary.card_reconciliation_status}`, detail: "Revisar estado de conciliación con Tekae.", tone: "danger" });
  }
  return alerts;
}

const CATEGORY_LABELS: Record<string, string> = {
  ELECTRICITY: "Energía",
  PHONE: "Telefonía",
  INTERNET: "Internet",
  WATER: "Agua",
  GAS: "Gas",
  TV: "Televisión",
  OTHER: "Otros",
};

const CATEGORY_COLORS: Record<string, string> = {
  ELECTRICITY: "#f59e0b",
  PHONE: "#7c3aed",
  INTERNET: "#22c55e",
  WATER: "#0ea5e9",
  GAS: "#f97316",
  TV: "#ec4899",
  OTHER: "#94a3b8",
};

function TrendChart({ data }: { data: PaymentTrendPoint[] }) {
  const hasData = data.some((p) => p.count > 0);
  if (!hasData) {
    return <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--crm-muted)", fontSize: 13 }}>Sin actividad en este período</div>;
  }
  const counts = data.map((p) => p.count);
  const maxVal = Math.max(...counts, 1);
  const W = 676, H = 160, PAD = 10;
  const points = data.map((p, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((p.count / maxVal) * (H - PAD * 2));
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${H} ${points} ${W},${H}`;
  return (
    <div className="crm-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Pagos por día">
        <polygon points={area} fill="rgba(21,101,232,.12)" />
        <polyline points={points} fill="none" stroke="var(--crm-blue)" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

function HourlyChart({ data }: { data: HourlyTrafficPoint[] }) {
  const maxVal = Math.max(...data.map((p) => p.count), 1);
  const current = new Date().getHours();
  const hasData = data.some((p) => p.count > 0);
  return (
    <div className="crm-hourly">
      {data.map(({ hour, count }) => (
        <div className={`crm-hourly-col ${hour === current ? "current" : ""}`} key={hour}>
          <div className="crm-hourly-bar-wrap">
            <div
              className="crm-hourly-bar"
              style={{ height: hasData ? `${(count / maxVal) * 100}%` : "4%" }}
              title={`${hour}:00 · ${count} pagos`}
            />
          </div>
          <small>{hour % 6 === 0 ? hour : ""}</small>
        </div>
      ))}
    </div>
  );
}

const ADMIN_ROLES_LIST = ["SUPER_ADMIN", "ADMIN", "SUPPORT", "FINANCE", "AUDITOR"] as const;

function AdminUsersView() {
  const api = useAdminApi();
  const [operators, setOperators] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<AdminOperatorCreate>({ phone: "", role: "SUPPORT", name: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = () => {
    setLoading(true);
    setError(null);
    api.adminOperators()
      .then(setOperators)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const handleCreate = async () => {
    setFormError(null);
    if (!form.phone.trim()) { setFormError("El teléfono es obligatorio"); return; }
    setSaving(true);
    try {
      const created = await api.createAdminOperator({ ...form, name: form.name?.trim() || undefined });
      setOperators((prev) => [created, ...prev]);
      setForm({ phone: "", role: "SUPPORT", name: "" });
      setCreating(false);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Error al crear operador");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (op: AdminUser) => {
    try {
      const updated = await api.updateAdminOperatorStatus(op.id, !op.is_active);
      setOperators((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error al actualizar estado");
    }
  };

  return (
    <div className="crm-dashboard-stack">
      <ViewHeader
        title="Operadores admin"
        subtitle={loading ? "Cargando…" : `${operators.length} operador${operators.length !== 1 ? "es" : ""} registrados`}
        actions={
          <button className="crm-btn primary" onClick={() => { setCreating((v) => !v); setFormError(null); }}>
            <Icon name="plus" />{creating ? "Cancelar" : "Nuevo operador"}
          </button>
        }
      />

      {creating && (
        <Card title="Crear operador">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span>Teléfono *</span>
              <input
                className="crm-input"
                placeholder="5512345678"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                autoComplete="off"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span>Rol *</span>
              <select className="crm-select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                {ADMIN_ROLES_LIST.filter((r) => r !== "SUPER_ADMIN").map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span>Nombre (opcional)</span>
              <input
                className="crm-input"
                placeholder="Ana López"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <button className="crm-btn primary" onClick={handleCreate} disabled={saving} style={{ height: 36 }}>
              {saving ? "Guardando…" : "Crear"}
            </button>
          </div>
          {formError && <p style={{ color: "var(--crm-danger)", fontSize: 13, margin: "8px 0 0" }}>{formError}</p>}
        </Card>
      )}

      <Card title="Operadores activos">
        {loading ? (
          <div className="crm-loading">Cargando…</div>
        ) : error ? (
          <div style={{ color: "var(--crm-danger)", fontSize: 13, padding: "12px 0" }}>{error}</div>
        ) : operators.length === 0 ? (
          <div style={{ color: "var(--crm-muted)", fontSize: 13, padding: "12px 0", textAlign: "center" }}>
            No hay operadores registrados
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Teléfono</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Alta</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {operators.map((op) => (
                <tr key={op.id} style={{ opacity: op.is_active ? 1 : 0.5 }}>
                  <td><code style={{ fontSize: 12 }}>{op.phone}</code></td>
                  <td>{op.name ?? <span style={{ color: "var(--crm-muted)" }}>—</span>}</td>
                  <td><span className="crm-pill crm-role" style={{ fontSize: 11 }}>{op.role}</span></td>
                  <td>
                    <span className={`crm-badge ${op.is_active ? "success" : "danger"}`}>
                      {op.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--crm-muted)" }}>{formatDate(op.created_at)}</td>
                  <td>
                    <button
                      className="crm-btn"
                      style={{ fontSize: 12, padding: "4px 10px" }}
                      onClick={() => toggleStatus(op)}
                    >
                      {op.is_active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

function DashboardView() {
  const api = useAdminApi();
  const [summary, setSummary] = useState<{
    users_count: number;
    payments_count: number;
    payments_succeeded_count: number;
    payments_pending_count: number;
    payments_failed_count: number;
    support_tickets_open_count: number;
    manual_review_open_count: number;
    card_reconciliation_status: string;
    note?: string;
  } | null>(null);
  const [trend, setTrend] = useState<PaymentTrendPoint[]>([]);
  const [categories, setCategories] = useState<CategoryVolumePoint[]>([]);
  const [hourly, setHourly] = useState<HourlyTrafficPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    Promise.all([
      api.dashboard().then((data) => setSummary(data as typeof summary)).catch(() => {}),
      api.dashboardTrend().then(setTrend).catch(() => {}),
      api.dashboardCategoryVolume().then(setCategories).catch(() => {}),
      api.dashboardHourly().then(setHourly).catch(() => {}),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const successRate =
    summary && summary.payments_count > 0
      ? ((summary.payments_succeeded_count / summary.payments_count) * 100).toFixed(1) + "%"
      : "—";

  const activeAlerts = summary ? buildAlerts(summary) : [];
  const catMax = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="crm-dashboard-stack">
      <ViewHeader
        title="Dashboard"
        subtitle={loading ? "Cargando…" : `${summary?.payments_count ?? 0} pagos registrados · ${summary?.users_count ?? 0} usuarios`}
        actions={<button className="crm-btn" onClick={reload}><Icon name="refresh" />Actualizar</button>}
      />
      <div className="crm-kpi-grid">
        <Kpi label="Total pagos" value={loading ? "…" : String(summary?.payments_count ?? 0)} sub="todos los estados" />
        <Kpi label="Pagos exitosos" value={loading ? "…" : String(summary?.payments_succeeded_count ?? 0)} delta={successRate} sub="tasa de éxito" />
        <Kpi label="Pagos pendientes" value={loading ? "…" : String(summary?.payments_pending_count ?? 0)} deltaTone={summary && summary.payments_pending_count > 5 ? "danger" : "success"} />
        <Kpi label="Usuarios registrados" value={loading ? "…" : String(summary?.users_count ?? 0)} sub="total en plataforma" />
        <Kpi label="Tickets abiertos" value={loading ? "…" : String(summary?.support_tickets_open_count ?? 0)} deltaTone={summary && summary.support_tickets_open_count > 3 ? "danger" : "success"} sub="soporte activo" />
        <Kpi label="Revisión manual" value={loading ? "…" : String(summary?.manual_review_open_count ?? 0)} deltaTone={summary && summary.manual_review_open_count > 0 ? "danger" : "success"} sub="casos abiertos" />
      </div>
      <div className="crm-charts-row">
        <Card title="Pagos · últimos 30 días">
          {loading ? <div className="crm-loading">Cargando…</div> : <TrendChart data={trend} />}
        </Card>
        <Card title="Volumen por categoría">
          {loading ? <div className="crm-loading">Cargando…</div> : categories.length === 0 ? (
            <div style={{ color: "var(--crm-muted)", fontSize: 13, padding: "16px 0", textAlign: "center" }}>Sin pagos registrados</div>
          ) : (
            <div style={{ padding: "8px 0" }}>
              {categories.map((c) => (
                <Bar
                  key={c.category}
                  name={CATEGORY_LABELS[c.category] ?? c.category}
                  width={Math.round((c.count / catMax) * 100)}
                  color={CATEGORY_COLORS[c.category] ?? "#94a3b8"}
                  value={`${c.count} pago${c.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
      <div className="crm-charts-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Card title="Alertas operativas" action={activeAlerts.length > 0 ? <span className="crm-badge danger">{activeAlerts.length} activas</span> : <span className="crm-badge success">Nominal</span>}>
          <div className="crm-alert-list">
            {loading ? (
              <div style={{ color: "var(--crm-muted)", fontSize: 13, padding: "12px 0" }}>Cargando…</div>
            ) : activeAlerts.length === 0 ? (
              <div style={{ color: "var(--crm-muted)", fontSize: 13, padding: "12px 0", textAlign: "center" }}>No hay alertas activas</div>
            ) : activeAlerts.map((a) => (
              <Alert key={a.title} title={a.title} detail={a.detail} tone={a.tone} />
            ))}
          </div>
        </Card>
        <Card title="Tráfico por hora · hoy" action={<span style={{ fontSize: 12, color: "var(--crm-muted)" }}>CDMX · GMT-6</span>}>
          {loading ? <div className="crm-loading">Cargando…</div> : <HourlyChart data={hourly} />}
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, meta, delta, deltaTone = "success", sub, sparkline }: { label: string; value: string; meta?: string; delta?: string; deltaTone?: "success" | "danger"; sub?: string; sparkline?: React.ReactNode }) {
  return (
    <div className="crm-card crm-kpi">
      <label>{label}</label>
      <strong>{value}</strong>
      <span>
        {delta ? <b className={`crm-kpi-delta ${deltaTone === "danger" ? "danger" : ""}`}><Icon name={deltaTone === "danger" ? "arrowDn" : "arrowUp"} />{delta}</b> : null}
        {sub ?? meta}
      </span>
      {sparkline ? <div className="crm-kpi-sparkline">{sparkline}</div> : null}
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="crm-card">
      <div className="crm-card-head">
        <h3>{title}</h3>
        {action}
      </div>
      <div className="crm-card-pad">{children}</div>
    </section>
  );
}

function UsersView() {
  const api = useAdminApi();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    api.users({}).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const visible = users.filter((u) =>
    filter === "Todos" || (filter === "Activo" && u.is_active) || (filter === "Inactivo" && !u.is_active)
  );

  return (
    <>
      <ViewHeader
        title="Usuarios"
        subtitle={loading ? "Cargando…" : `${users.length} registrados`}
        actions={<button className="crm-btn"><Icon name="download" />Exportar CSV</button>}
      />
      <div className="crm-toolbar">
        <Segmented options={["Todos", "Activo", "Inactivo"]} value={filter} onChange={setFilter} />
        <span className="crm-result-count">{visible.length} resultados</span>
      </div>
      {loading ? <div className="crm-loading">Cargando usuarios…</div> : (
        <div className="crm-card crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Teléfono</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Pagos</th>
                <th>Registrado</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--crm-muted)", padding: 20 }}>Sin usuarios</td></tr>
              ) : visible.map((u) => (
                <tr key={u.id}>
                  <td><span className="crm-mono">{u.phone}</span></td>
                  <td>{u.name ?? "—"}</td>
                  <td>{u.role}</td>
                  <td>{statusCell(u.is_active ? "Activo" : "Inactivo")}</td>
                  <td className="crm-mono" style={{ textAlign: "right" }}>{u.recent_payment_ids?.length ?? 0}</td>
                  <td style={{ color: "var(--crm-muted)" }}>{formatDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function PaymentsView() {
  const api = useAdminApi();
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => {
    api.payments({}).then(setPayments).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusLabel: Record<string, string> = {
    succeeded: "Exitosa", pending: "Pendiente", failed: "Fallida",
    refunded: "Reembolsada", cancelled: "Cancelada", processing: "Procesando",
  };

  const filtered = payments.filter((p) => statusFilter === "Todos" || statusLabel[p.status] === statusFilter);

  return (
    <>
      <ViewHeader
        title="Pagos"
        subtitle={loading ? "Cargando…" : `${payments.length} transacciones`}
        actions={<button className="crm-btn"><Icon name="download" />Exportar CSV</button>}
      />
      <div className="crm-mini-grid">
        <MiniStat label="Total" value={loading ? "…" : String(payments.length)} />
        <MiniStat label="Exitosos" value={loading ? "…" : String(payments.filter((p) => p.status === "succeeded").length)} />
        <MiniStat label="Pendientes" value={loading ? "…" : String(payments.filter((p) => p.status === "pending").length)} accent="var(--crm-orange)" />
        <MiniStat label="Fallidos" value={loading ? "…" : String(payments.filter((p) => p.status === "failed").length)} accent="var(--crm-red)" />
      </div>
      <div className="crm-toolbar">
        <Segmented options={["Todos", "Exitosa", "Pendiente", "Fallida", "Reembolsada"]} value={statusFilter} onChange={setStatusFilter} />
      </div>
      {loading ? <div className="crm-loading">Cargando pagos…</div> : (
        <div className="crm-card crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Servicio</th>
                <th>Referencia</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th>Estado</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--crm-muted)", padding: 20 }}>Sin pagos</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="crm-mono">#{p.id}</span>
                    {p.is_mock ? <span className="crm-badge" style={{ fontSize: 10, marginLeft: 6 }}>mock</span> : null}
                  </td>
                  <td>{p.service_name}</td>
                  <td><span className="crm-mono">{p.service_reference_masked}</span></td>
                  <td className="crm-mono" style={{ textAlign: "right", fontWeight: 800 }}>{formatMoney(p.total_minor)}</td>
                  <td>{statusCell(statusLabel[p.status] ?? p.status)}</td>
                  <td style={{ color: "var(--crm-muted)" }}>{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function TableView({ title, subtitle, rows, columns, kind }: { title: string; subtitle: string; rows: string[][]; columns: string[]; kind?: "users" }) {
  return (
    <>
      <ViewHeader title={title} subtitle={subtitle} actions={<button className="crm-btn"><Icon name="download" />Exportar</button>} />
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input className="crm-input" style={{ maxWidth: 420 }} placeholder="Buscar por nombre, ID o referencia..." />
        <button className="crm-btn">Filtros</button>
      </div>
      <div className="crm-card crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`}>
                    {kind === "users" && index === 1 ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}><span className="crm-avatar">{row[2]}</span>{cell}</span>
                    ) : statusCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function statusCell(cell: string) {
  if (["Activo", "Exitosa", "Entregado", "Cuadrada"].includes(cell)) return <span className="crm-badge success">{cell}</span>;
  if (["Pendiente", "KYC pendiente"].includes(cell)) return <span className="crm-badge pending">{cell}</span>;
  if (["Fallida", "Bloqueado", "Rebotado", "Diferencia"].includes(cell)) return <span className="crm-badge danger">{cell}</span>;
  if (["Reembolsada", "Nivel 3", "SEV-2"].includes(cell)) return <span className="crm-badge purple">{cell}</span>;
  if (/^(usr_|tx_|REC-|TKT-|DSP-|FS-)/.test(cell)) return <span className="crm-mono">{cell}</span>;
  return cell;
}

function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="crm-segmented">
      {options.map((option) => (
        <button className={value === option ? "active" : ""} key={option} type="button" onClick={() => onChange(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

function KycBars({ level }: { level: number }) {
  return (
    <span className="crm-kyc-bars">
      {[1, 2, 3].map((item) => <span className={item <= level ? "active" : ""} key={item} />)}
    </span>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="crm-mini-stat">
      <span>{label}</span>
      <strong style={{ color: accent }}>{value}</strong>
    </div>
  );
}

function ChannelChip({ channel }: { channel: string }) {
  const color = channel === "chat" ? "var(--crm-blue)" : channel === "email" ? "var(--crm-purple)" : "var(--crm-green)";
  return <span className="crm-channel-chip"><i style={{ background: color }} />{channel === "chat" ? "Chat" : channel === "email" ? "Email" : channel}</span>;
}

function SearchView() {
  return (
    <>
      <ViewHeader title="Búsqueda global" subtitle="Busca en usuarios, pagos, recibos, tickets, disputas y señales de fraude" />
      <input className="crm-input" style={{ height: 54, fontSize: 16 }} placeholder="Buscar usuario, pago, recibo o ticket..." />
      <div className="crm-grid-even" style={{ marginTop: 18 }}>
        <Card title="Resultados recientes">
          {["usr_01022 · Carlos Ortiz Díaz", "tx_0847200 · Pago CFE", "TKT-4500 · Pago no aplicado", "DSP-08870 · Cargo no reconocido"].map((item) => <div className="crm-note" style={{ marginBottom: 8 }} key={item}>{item}</div>)}
        </Card>
        <Card title="Filtros rápidos">
          <div className="crm-pills">
            {["Usuarios", "Pagos", "Recibos", "Tickets", "Disputas", "Fraude"].map((item) => <span className="crm-small-pill" key={item}>{item}</span>)}
          </div>
        </Card>
      </div>
    </>
  );
}

type KanbanCol = { label: string; statuses: string[]; color: string };
const KANBAN_COLS: KanbanCol[] = [
  { label: "Nuevos", statuses: ["new", "open", "triaged"], color: "#1565e8" },
  { label: "En proceso", statuses: ["assigned", "pending", "escalated", "reopened"], color: "#f59e0b" },
  { label: "Esperando", statuses: ["waiting_user", "waiting_customer", "waiting_internal", "waiting_internal_review"], color: "#7c3aed" },
  { label: "Resueltos", statuses: ["resolved", "closed"], color: "#22c55e" },
];

function TicketsView() {
  const api = useAdminApi();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tickets().then(setTickets).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const open = tickets.filter((t) => !["resolved", "closed"].includes(t.status));

  return (
    <>
      <ViewHeader
        title="Tickets de soporte"
        subtitle={loading ? "Cargando…" : `${open.length} abiertos · ${tickets.length} total`}
        actions={<button className="crm-btn primary"><Icon name="plus" />Crear ticket</button>}
      />
      {loading ? <div className="crm-loading">Cargando tickets…</div> : (
        <div className="crm-kanban">
          {KANBAN_COLS.map(({ label, statuses, color }) => {
            const col = tickets.filter((t) => statuses.includes(t.status));
            return (
              <section key={label}>
                <div className="crm-kanban-head">
                  <span><i style={{ background: color }} />{label}</span>
                  <b>{col.length}</b>
                </div>
                {col.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  const sevColor = ticket.severity === "SEV-1" ? "var(--crm-red)" : ticket.severity === "SEV-2" ? "var(--crm-orange)" : "var(--crm-blue)";
  return (
    <div className="crm-ticket" style={{ borderLeftColor: sevColor }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span className="crm-mono">{ticket.ticket_number ?? `#${ticket.id}`}</span>
        <span className="crm-badge" style={{ fontSize: 10 }}>{ticket.severity ?? ticket.priority}</span>
      </div>
      <strong style={{ display: "block", fontSize: 13, marginTop: 8 }}>{ticket.subject}</strong>
      <div className="crm-ticket-user">
        <span>{ticket.category.replace(/_/g, " ")}</span>
        <small>{formatDate(ticket.created_at)}</small>
      </div>
      {ticket.sla_due_at && !["resolved", "closed"].includes(ticket.status) ? (
        <p style={{ color: "var(--crm-muted)", fontSize: 11, margin: "8px 0 0" }}>SLA: {formatDate(ticket.sla_due_at)}</p>
      ) : null}
    </div>
  );
}

function ReconciliationView({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <ViewHeader title={title} subtitle={subtitle} />
      <div className="crm-card" style={{ padding: 40, textAlign: "center" }}>
        <p style={{ fontSize: 36, margin: "0 0 12px" }}>🔧</p>
        <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>En construcción</h2>
        <p style={{ color: "var(--crm-muted)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
          Disponible cuando la integración con Tekae esté activa. No hay reportes reales de cargos, capturas ni mismatches en esta fase de desarrollo.
        </p>
      </div>
    </>
  );
}

function ReceiptsView() {
  const api = useAdminApi();
  const [receipts, setReceipts] = useState<AdminReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.receipts({}).then(setReceipts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ViewHeader title="Recibos" subtitle={loading ? "Cargando…" : `${receipts.length} comprobantes`} actions={<button className="crm-btn"><Icon name="download" />Exportar</button>} />
      {loading ? <div className="crm-loading">Cargando recibos…</div> : (
        <div className="crm-card crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr><th>Folio</th><th>Pago</th><th style={{ textAlign: "right" }}>Monto</th><th>Estado</th><th>Creado</th></tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--crm-muted)", padding: 20 }}>Sin recibos</td></tr>
              ) : receipts.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span className="crm-mono">{r.folio}</span>
                    {r.is_mock ? <span className="crm-badge" style={{ fontSize: 10, marginLeft: 6 }}>mock</span> : null}
                  </td>
                  <td><span className="crm-mono">#{r.payment_id}</span></td>
                  <td className="crm-mono" style={{ textAlign: "right" }}>{formatMoney(r.total_minor)}</td>
                  <td>{statusCell(r.receipt_status ?? r.payment_status)}</td>
                  <td style={{ color: "var(--crm-muted)" }}>{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function AuditLogsView() {
  const api = useAdminApi();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auditEvents({}).then(setEvents).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ViewHeader title="Audit logs" subtitle={loading ? "Cargando…" : `${events.length} eventos`} actions={<button className="crm-btn"><Icon name="download" />Exportar</button>} />
      {loading ? <div className="crm-loading">Cargando eventos…</div> : (
        <div className="crm-card crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr><th>Tiempo</th><th>Actor</th><th>Acción</th><th>Entidad</th><th>Resultado</th></tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--crm-muted)", padding: 20 }}>Sin eventos de auditoría</td></tr>
              ) : events.map((e) => (
                <tr key={e.id}>
                  <td style={{ color: "var(--crm-muted)" }}>{formatDate(e.created_at)}</td>
                  <td><span className="crm-mono">{e.actor_id ?? e.actor_type}</span></td>
                  <td>{e.event_type}</td>
                  <td>{e.entity_type ? <span className="crm-mono">{e.entity_type} {e.entity_id}</span> : "—"}</td>
                  <td>{statusCell(e.result)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

type TestMessage = { role: "user" | "assistant"; content: string };

function relativeTime(date: Date | null): string | null {
  if (!date) return null;
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "hace unos segundos";
  return `hace ${Math.floor(diff / 60)} min`;
}

function saveBtnText(state: SaveState): string {
  if (state === "saving") return "Guardando...";
  if (state === "saved") return "✓ Guardado";
  if (state === "error") return "Error al guardar";
  return "Guardar";
}

function BotLandingView() {
  const api = useAdminApi();
  const [identity, setIdentity] = useState<BotIdentity>({
    name: "FONDIX Bot",
    tagline: "En línea · responde al toque",
    tooltip: "¿Tienes dudas? Pregúntame 🤖",
    greeting: "¡Hola! Soy el bot de **FONDIX PAY** 🤖\nPuedes preguntarme sobre servicios, cobertura, comisiones o cómo registrarte. ¿En qué te ayudo?",
  });
  const [prompt, setPrompt] = useState(BOT_DEFAULT_PROMPT);
  const [pills, setPills] = useState(botPillsInitial);
  const [kb, setKb] = useState<import("../types/admin").ChatbotKnowledgeEntry[]>([]);
  const [kbLoading, setKbLoading] = useState(true);
  const [newKbOpen, setNewKbOpen] = useState(false);
  const [newKbTitle, setNewKbTitle] = useState("");
  const [newKbContent, setNewKbContent] = useState("");
  const [newKbCategory, setNewKbCategory] = useState("");
  const [newKbSaving, setNewKbSaving] = useState(false);
  const [faqs, setFaqs] = useState<import("../types/admin").ChatbotFaq[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [newFaqOpen, setNewFaqOpen] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [newFaqCategory, setNewFaqCategory] = useState("");
  const [newFaqSaving, setNewFaqSaving] = useState(false);
  const [newPillOpen, setNewPillOpen] = useState(false);
  const [newPillLabel, setNewPillLabel] = useState("");
  const [newPillQ, setNewPillQ] = useState("");
  const [topQuestions, setTopQuestions] = useState<{ intent: string; hits: number; escalated: number }[] | null>(null);
  const [modelHealth, setModelHealth] = useState<{
    model: string;
    api_configured: boolean;
    conversations_today: number;
    fallback_rate_pct: number;
    latency_p50_ms: number | null;
    latency_p95_ms: number | null;
  } | null>(null);
  const [testOpen, setTestOpen] = useState(false);
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [testInput, setTestInput] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [identitySave, setIdentitySave] = useState<SaveState>("idle");
  const [promptSave, setPromptSave] = useState<SaveState>("idle");
  const [pillsSave, setPillsSave] = useState<SaveState>("idle");
  const [identitySavedAt, setIdentitySavedAt] = useState<Date | null>(null);
  const [promptSavedAt, setPromptSavedAt] = useState<Date | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [pillsSavedAt, setPillsSavedAt] = useState<Date | null>(null);
  const [stats, setStats] = useState<{
    conversations_today: number;
    avg_messages_per_conversation: number;
    escalation_rate_pct: number;
  } | null>(null);
  const [publishState, setPublishState] = useState<SaveState>("idle");
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);

  const updateIdentity = (key: keyof BotIdentity, value: string) => {
    setIdentity((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => {
    api.chatbotSettings()
      .then((items) => {
        const get = (key: string): string | null => {
          const item = items.find((s) => s.key === key);
          if (item == null) return null;
          return (item.value as unknown as string) ?? null;
        };
        const name = get("bot.identity.name");
        const tagline = get("bot.identity.tagline");
        const tooltip = get("bot.identity.tooltip");
        const greeting = get("bot.identity.greeting");
        const systemPrompt = get("system_prompt");
        const pillsStr = get("bot.pills");
        setIdentity((cur) => ({
          name: name ?? cur.name,
          tagline: tagline ?? cur.tagline,
          tooltip: tooltip ?? cur.tooltip,
          greeting: greeting ?? cur.greeting,
        }));
        if (systemPrompt !== null) setPrompt(systemPrompt);
        if (pillsStr) {
          try {
            const parsed = JSON.parse(pillsStr) as Array<{ id: string; label: string; question: string }>;
            if (Array.isArray(parsed)) {
              setPills(parsed.map((p) => ({ id: p.id, label: p.label, q: p.question ?? "" })));
            }
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setSettingsLoading(false));
    api.chatbotStats()
      .then((s) => setStats(s))
      .catch(() => {});
    api.chatbotKnowledge()
      .then((items) => setKb(items))
      .catch(() => {})
      .finally(() => setKbLoading(false));
    api.chatbotTopQuestions()
      .then((q) => setTopQuestions(q))
      .catch(() => {});
    api.chatbotModelHealth()
      .then((h) => setModelHealth(h))
      .catch(() => {});
    api.chatbotFaqs()
      .then((items) => setFaqs(items))
      .catch(() => {})
      .finally(() => setFaqsLoading(false));
  }, []);

  async function saveIdentity() {
    setIdentitySave("saving");
    try {
      await Promise.all([
        api.updateChatbotSetting("bot.identity.name", identity.name as unknown as Record<string, unknown>),
        api.updateChatbotSetting("bot.identity.tagline", identity.tagline as unknown as Record<string, unknown>),
        api.updateChatbotSetting("bot.identity.tooltip", identity.tooltip as unknown as Record<string, unknown>),
        api.updateChatbotSetting("bot.identity.greeting", identity.greeting as unknown as Record<string, unknown>),
      ]);
      setIdentitySave("saved");
      setIdentitySavedAt(new Date());
      setTimeout(() => setIdentitySave("idle"), 2000);
    } catch {
      setIdentitySave("error");
    }
  }

  async function savePrompt() {
    setPromptSave("saving");
    setPromptError(null);
    try {
      await api.updateChatbotSetting("system_prompt", prompt as unknown as Record<string, unknown>);
      setPromptSave("saved");
      setPromptSavedAt(new Date());
      setTimeout(() => setPromptSave("idle"), 2000);
    } catch (err) {
      setPromptSave("error");
      setPromptError(err instanceof Error ? err.message : "Error al guardar");
      setTimeout(() => setPromptSave("idle"), 4000);
    }
  }

  async function savePills() {
    setPillsSave("saving");
    try {
      const payload = JSON.stringify(pills.map((p) => ({ id: p.id, label: p.label, question: p.q })));
      await api.updateChatbotSetting("bot.pills", payload as unknown as Record<string, unknown>);
      setPillsSave("saved");
      setPillsSavedAt(new Date());
      setTimeout(() => setPillsSave("idle"), 2000);
    } catch {
      setPillsSave("error");
    }
  }

  async function saveNewKbEntry() {
    if (!newKbTitle.trim() || !newKbContent.trim() || newKbSaving) return;
    setNewKbSaving(true);
    try {
      const created = await api.createChatbotKnowledge({
        title: newKbTitle.trim(),
        content: newKbContent.trim(),
        category: newKbCategory.trim() || undefined,
      });
      setKb((current) => [created, ...current]);
      setNewKbOpen(false);
      setNewKbTitle("");
      setNewKbContent("");
      setNewKbCategory("");
    } catch {
      // leave form open on error
    } finally {
      setNewKbSaving(false);
    }
  }

  async function saveNewFaq() {
    if (!newFaqQ.trim() || !newFaqA.trim() || newFaqSaving) return;
    setNewFaqSaving(true);
    try {
      const created = await api.createChatbotFaq({
        question: newFaqQ.trim(),
        answer: newFaqA.trim(),
        category: newFaqCategory.trim() || undefined,
      });
      setFaqs((current) => [...current, created]);
      setNewFaqOpen(false);
      setNewFaqQ("");
      setNewFaqA("");
      setNewFaqCategory("");
    } catch {
      // leave form open on error
    } finally {
      setNewFaqSaving(false);
    }
  }

  async function toggleFaqEntry(id: number, isActive: boolean) {
    try {
      const updated = isActive
        ? await api.disableChatbotFaq(id)
        : await api.enableChatbotFaq(id);
      setFaqs((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch {}
  }

  async function deleteFaqEntry(id: number) {
    try {
      await api.deleteChatbotFaq(id);
      setFaqs((current) => current.filter((item) => item.id !== id));
    } catch {}
  }

  async function toggleKbEntry(id: number, isActive: boolean) {
    try {
      const updated = isActive
        ? await api.disableChatbotKnowledge(id)
        : await api.enableChatbotKnowledge(id);
      setKb((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch {}
  }

  async function deleteKbEntry(id: number) {
    try {
      await api.deleteChatbotKnowledge(id);
      setKb((current) => current.filter((item) => item.id !== id));
    } catch {}
  }

  async function publishAll() {
    if (settingsLoading || publishState === "saving") return;
    setPublishState("saving");
    try {
      await Promise.all([
        api.updateChatbotSetting("bot.identity.name", identity.name as unknown as Record<string, unknown>),
        api.updateChatbotSetting("bot.identity.tagline", identity.tagline as unknown as Record<string, unknown>),
        api.updateChatbotSetting("bot.identity.tooltip", identity.tooltip as unknown as Record<string, unknown>),
        api.updateChatbotSetting("bot.identity.greeting", identity.greeting as unknown as Record<string, unknown>),
        api.updateChatbotSetting("system_prompt", prompt as unknown as Record<string, unknown>),
        api.updateChatbotSetting("bot.pills", JSON.stringify(pills.map((p) => ({ id: p.id, label: p.label, question: p.q }))) as unknown as Record<string, unknown>),
      ]);
      setPublishState("saved");
      setPublishedAt(new Date());
      setTimeout(() => setPublishState("idle"), 8000);
    } catch {
      setPublishState("error");
      setTimeout(() => setPublishState("idle"), 4000);
    }
  }

  function openTest() {
    setTestOpen(true);
    setTestMessages([]);
    setTestInput("");
    setTestError(null);
  }

  function closeTest() {
    setTestOpen(false);
  }

  async function sendTestMessage() {
    const content = testInput.trim();
    if (!content || testLoading) return;
    const next: TestMessage[] = [...testMessages, { role: "user", content }];
    setTestMessages(next);
    setTestInput("");
    setTestLoading(true);
    setTestError(null);
    setTimeout(() => {
      if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }, 0);
    try {
      const result = await api.chatTest({ system: prompt, messages: next });
      const withReply: TestMessage[] = [...next, { role: "assistant", content: result.content }];
      setTestMessages(withReply);
      setTimeout(() => {
        if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
      }, 0);
    } catch (err) {
      setTestError(err instanceof Error ? err.message : "No se pudo conectar con el bot. Verifica que el backend esté corriendo y que CHATBOT_AI_API_KEY esté configurado en .env.");
    } finally {
      setTestLoading(false);
    }
  }

  return (
    <>
      <ViewHeader
        title="Bot de Landing"
        subtitle={settingsLoading ? "Cargando configuración..." : "Configura la identidad, personalidad y respuestas del FONDIX Bot"}
        actions={
          <>
            <button className="crm-btn" type="button" onClick={openTest}><Icon name="eye" />Probar</button>
            <button
              className="crm-btn primary"
              type="button"
              disabled={settingsLoading || publishState === "saving"}
              onClick={() => void publishAll()}
            >
              <Icon name="check" />
              {publishState === "saving" ? "Publicando…" : "Publicar cambios"}
            </button>
          </>
        }
      />
      <div className="crm-mini-grid">
        <MiniStat label="Conversaciones · hoy" value={stats ? String(stats.conversations_today) : "—"} />
        <MiniStat label="Mensajes promedio" value={stats ? String(stats.avg_messages_per_conversation) : "—"} />
        <MiniStat label="Tasa de escalación" value={stats ? `${stats.escalation_rate_pct}%` : "—"} accent="var(--crm-red)" />
        <MiniStat label="CSAT" value="—" />
      </div>
      {publishState === "saved" && (
        <div className="crm-publish-banner crm-publish-banner--ok">
          <Icon name="check" />
          <span>Bot actualizado · cambios visibles en la landing en &lt; 60 s</span>
          {publishedAt && <span className="crm-publish-banner__time">{relativeTime(publishedAt)}</span>}
        </div>
      )}
      {publishState === "error" && (
        <div className="crm-publish-banner crm-publish-banner--error">
          <Icon name="x" />
          <span>Error al publicar — revisa la conexión con el backend</span>
        </div>
      )}
      <div className="crm-bot-grid">
        <section className="crm-bot-column">
          <Card
            title="Identidad y bienvenida"
            action={
              <div className="crm-card-actions">
                {identitySave === "error" && <span style={{ fontSize: 11, color: "var(--crm-red)" }}>Error al guardar</span>}
                {identitySavedAt && identitySave === "idle" && (
                  <span style={{ fontSize: 11, color: "var(--crm-muted)" }}>Guardado {relativeTime(identitySavedAt)}</span>
                )}
                <button
                  className={`crm-btn${identitySave === "saved" ? " primary" : ""}`}
                  type="button"
                  disabled={settingsLoading || identitySave === "saving"}
                  onClick={() => void saveIdentity()}
                >
                  <Icon name="check" />{saveBtnText(identitySave)}
                </button>
              </div>
            }
          >
            <div className="crm-form-grid bot-fields">
              <BotField label="Nombre del bot" value={identity.name} onChange={(value) => updateIdentity("name", value)} />
              <BotField label="Estado / tagline" value={identity.tagline} onChange={(value) => updateIdentity("tagline", value)} />
              <BotField label="Tooltip de invitación" value={identity.tooltip} onChange={(value) => updateIdentity("tooltip", value)} full />
              <BotField label="Mensaje de bienvenida" value={identity.greeting} onChange={(value) => updateIdentity("greeting", value)} full multiline />
            </div>
          </Card>
          <Card
            title="Personalidad · system prompt"
            action={
              <div className="crm-card-actions">
                <span className="crm-result-count">{prompt.length} chars</span>
                <button className="crm-icon-btn small" type="button" onClick={() => setPrompt(BOT_DEFAULT_PROMPT)} aria-label="Restaurar default">
                  <Icon name="refresh" />
                </button>
                {promptSave === "error" && (
                  <span style={{ fontSize: 11, color: "var(--crm-red)" }} title={promptError ?? undefined}>
                    {prompt.length > 20000 ? `Muy largo (${prompt.length} chars, máx 20 000)` : (promptError ?? "Error al guardar")}
                  </span>
                )}
                {promptSavedAt && promptSave === "idle" && (
                  <span style={{ fontSize: 11, color: "var(--crm-muted)" }}>{relativeTime(promptSavedAt)}</span>
                )}
                <button
                  className={`crm-btn${promptSave === "saved" ? " primary" : ""}`}
                  type="button"
                  disabled={settingsLoading || promptSave === "saving"}
                  onClick={() => void savePrompt()}
                >
                  {saveBtnText(promptSave)}
                </button>
              </div>
            }
          >
            <textarea className="crm-textarea crm-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            <div className="crm-pills" style={{ marginTop: 10 }}>
              {["Tono mexicano", "Respuestas cortas", "Emojis moderados", "Off-topic redirect"].map((pill) => <span className="crm-small-pill" key={pill}>{pill}</span>)}
            </div>
          </Card>
          <Card
            title="Respuestas guiadas"
            action={
              <div className="crm-card-actions">
                {pillsSave === "error" && <span style={{ fontSize: 11, color: "var(--crm-red)" }}>Error al guardar</span>}
                {pillsSavedAt && pillsSave === "idle" && (
                  <span style={{ fontSize: 11, color: "var(--crm-muted)" }}>Guardado {relativeTime(pillsSavedAt)}</span>
                )}
                <button
                  className={`crm-btn${pillsSave === "saved" ? " primary" : ""}`}
                  type="button"
                  disabled={settingsLoading || pillsSave === "saving"}
                  onClick={() => void savePills()}
                >
                  {saveBtnText(pillsSave)}
                </button>
              </div>
            }
          >
            <div className="crm-guided-list">
              {pills.map((pill) => (
                <div key={pill.id}>
                  <b>{pill.label}</b>
                  <span>{pill.q}</span>
                  <button type="button" onClick={() => setPills((current) => current.filter((item) => item.id !== pill.id))} aria-label={`Quitar ${pill.label}`}>×</button>
                </div>
              ))}
            </div>
            {newPillOpen && (
              <div className="crm-kb-new-form" style={{ marginTop: 12 }}>
                <input
                  className="crm-input"
                  placeholder="Etiqueta del botón (ej: Comisiones)"
                  value={newPillLabel}
                  onChange={(e) => setNewPillLabel(e.target.value)}
                />
                <input
                  className="crm-input"
                  placeholder="Pregunta que envía (ej: ¿Cuánto cobran de comisión?)"
                  value={newPillQ}
                  onChange={(e) => setNewPillQ(e.target.value)}
                />
                <div className="crm-kb-new-form__row">
                  <button
                    className="crm-btn primary"
                    type="button"
                    disabled={!newPillLabel.trim() || !newPillQ.trim()}
                    onClick={() => {
                      if (!newPillLabel.trim() || !newPillQ.trim()) return;
                      setPills((current) => [
                        ...current,
                        { id: `p${Date.now()}`, label: newPillLabel.trim(), q: newPillQ.trim() },
                      ]);
                      setNewPillLabel("");
                      setNewPillQ("");
                      setNewPillOpen(false);
                    }}
                  >
                    Agregar
                  </button>
                  <button className="crm-btn" type="button" onClick={() => setNewPillOpen(false)}>Cancelar</button>
                </div>
              </div>
            )}
            <button
              className="crm-btn"
              style={{ marginTop: 12 }}
              type="button"
              onClick={() => setNewPillOpen((open) => !open)}
            >
              <Icon name="plus" />Agregar pregunta guiada
            </button>
          </Card>
          <Card
            title={kbLoading ? "Base de conocimiento · …" : `Base de conocimiento · ${kb.length} entradas`}
            action={
              <button className="crm-btn" type="button" onClick={() => setNewKbOpen((open) => !open)}>
                <Icon name="plus" />Nueva entrada
              </button>
            }
          >
            {newKbOpen && (
              <div className="crm-kb-new-form">
                <input
                  className="crm-input"
                  placeholder="Título / pregunta"
                  value={newKbTitle}
                  onChange={(e) => setNewKbTitle(e.target.value)}
                />
                <textarea
                  className="crm-textarea"
                  placeholder="Contenido / respuesta"
                  rows={3}
                  value={newKbContent}
                  onChange={(e) => setNewKbContent(e.target.value)}
                />
                <div className="crm-kb-new-form__row">
                  <input
                    className="crm-input"
                    placeholder="Categoría (opcional)"
                    value={newKbCategory}
                    onChange={(e) => setNewKbCategory(e.target.value)}
                  />
                  <button
                    className="crm-btn primary"
                    type="button"
                    disabled={!newKbTitle.trim() || !newKbContent.trim() || newKbSaving}
                    onClick={() => void saveNewKbEntry()}
                  >
                    {newKbSaving ? "Guardando…" : "Guardar"}
                  </button>
                  <button className="crm-btn" type="button" onClick={() => setNewKbOpen(false)}>Cancelar</button>
                </div>
              </div>
            )}
            <div className="crm-table-wrap">
              <table className="crm-table crm-bot-kb-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Contenido</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {kb.map((entry) => (
                    <tr key={entry.id} style={{ opacity: entry.is_active ? 1 : 0.5 }}>
                      <td>{entry.title}</td>
                      <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.content}</td>
                      <td>{entry.category ? <span className="crm-badge neutral">{entry.category}</span> : <span className="crm-muted">—</span>}</td>
                      <td>
                        <button
                          className={`crm-badge ${entry.is_active ? "active" : "neutral"}`}
                          type="button"
                          style={{ cursor: "pointer", border: "none", background: "none", padding: 0 }}
                          onClick={() => void toggleKbEntry(entry.id, entry.is_active)}
                          title={entry.is_active ? "Desactivar" : "Activar"}
                        >
                          {entry.is_active ? "activa" : "inactiva"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="crm-icon-btn small"
                          type="button"
                          onClick={() => void deleteKbEntry(entry.id)}
                          aria-label={`Eliminar ${entry.title}`}
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!kbLoading && kb.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--crm-muted)", padding: "20px 0" }}>Sin entradas. Agrega la primera.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          <Card
            title={faqsLoading ? "Preguntas frecuentes · …" : `Preguntas frecuentes · ${faqs.length} activas en soporte`}
            action={
              <button className="crm-btn" type="button" onClick={() => setNewFaqOpen((open) => !open)}>
                <Icon name="plus" />Nueva FAQ
              </button>
            }
          >
            <p style={{ fontSize: 12, color: "var(--crm-muted)", margin: "0 0 10px" }}>
              Las FAQs activas se muestran dinámicamente en <strong>fondixpay.com/soporte</strong>. Los cambios se reflejan en &lt; 5 min.
            </p>
            {newFaqOpen && (
              <div className="crm-kb-new-form">
                <input
                  className="crm-input"
                  placeholder="Pregunta (ej: ¿Cuánto cuesta usar FONDIX PAY?)"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                />
                <textarea
                  className="crm-textarea"
                  placeholder="Respuesta"
                  rows={3}
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                />
                <div className="crm-kb-new-form__row">
                  <input
                    className="crm-input"
                    placeholder="Categoría (opcional, ej: pagos)"
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                  />
                  <button
                    className="crm-btn primary"
                    type="button"
                    disabled={!newFaqQ.trim() || !newFaqA.trim() || newFaqSaving}
                    onClick={() => void saveNewFaq()}
                  >
                    {newFaqSaving ? "Guardando…" : "Guardar"}
                  </button>
                  <button className="crm-btn" type="button" onClick={() => setNewFaqOpen(false)}>Cancelar</button>
                </div>
              </div>
            )}
            <div className="crm-table-wrap">
              <table className="crm-table crm-bot-kb-table">
                <thead>
                  <tr>
                    <th>Pregunta</th>
                    <th>Respuesta</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq) => (
                    <tr key={faq.id} style={{ opacity: faq.is_active ? 1 : 0.5 }}>
                      <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{faq.question}</td>
                      <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{faq.answer}</td>
                      <td>{faq.category ? <span className="crm-badge neutral">{faq.category}</span> : <span className="crm-muted">—</span>}</td>
                      <td>
                        <button
                          className={`crm-badge ${faq.is_active ? "active" : "neutral"}`}
                          type="button"
                          style={{ cursor: "pointer", border: "none", background: "none", padding: 0 }}
                          onClick={() => void toggleFaqEntry(faq.id, faq.is_active)}
                          title={faq.is_active ? "Desactivar (ocultar en soporte)" : "Activar (mostrar en soporte)"}
                        >
                          {faq.is_active ? "visible" : "oculta"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="crm-icon-btn small"
                          type="button"
                          onClick={() => void deleteFaqEntry(faq.id)}
                          aria-label={`Eliminar FAQ: ${faq.question}`}
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!faqsLoading && faqs.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--crm-muted)", padding: "20px 0" }}>
                      Sin FAQs. Las 8 preguntas del soporte están hardcodeadas — agrega FAQs aquí para reemplazarlas dinámicamente.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
        <section className="crm-sticky-column">
          <Card title="Vista previa en vivo">
            <BotPreview identity={identity} pills={pills} />
          </Card>
          <Card title="Top intents · 7 días">
            <div className="crm-top-questions">
              {topQuestions === null && (
                <span style={{ color: "var(--crm-muted)", fontSize: 13 }}>Cargando…</span>
              )}
              {topQuestions !== null && topQuestions.length === 0 && (
                <span style={{ color: "var(--crm-muted)", fontSize: 13 }}>Sin datos todavía</span>
              )}
              {topQuestions !== null && topQuestions.map((question, index) => {
                const rate = question.hits > 0 ? question.escalated / question.hits : 0;
                const maxHits = topQuestions[0]?.hits ?? 1;
                return (
                  <div className="crm-top-question" key={question.intent}>
                    <span className="crm-top-rank">{index + 1}</span>
                    <div>
                      <b>{question.intent}</b>
                      <small>
                        {question.hits} conv · <span className={rate > 0.2 ? "danger" : ""}>{question.escalated} escaladas</span>
                      </small>
                    </div>
                    <i><span style={{ width: `${(question.hits / maxHits) * 100}%` }} /></i>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card title="Salud del modelo">
            <div className="crm-bot-metrics">
              <BotMetric label="Modelo activo" value={modelHealth?.model ?? "—"} mono />
              <BotMetric
                label="API key"
                value={modelHealth == null ? "—" : modelHealth.api_configured ? "● configurada" : "⚠ no configurada"}
                mono
              />
              <BotMetric label="Conv. hoy" value={modelHealth != null ? String(modelHealth.conversations_today) : "—"} mono />
              <BotMetric label="Tasa de fallback" value={modelHealth != null ? `${modelHealth.fallback_rate_pct}%` : "—"} mono />
              <BotMetric
                label="Latencia p50"
                value={modelHealth?.latency_p50_ms != null ? `${(modelHealth.latency_p50_ms / 1000).toFixed(2)} s` : "—"}
                mono
              />
              <BotMetric
                label="Latencia p95"
                value={modelHealth?.latency_p95_ms != null ? `${(modelHealth.latency_p95_ms / 1000).toFixed(2)} s` : "—"}
                mono
              />
            </div>
          </Card>
        </section>
      </div>

      {testOpen ? (
        <div className="crm-bot-test-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeTest(); }}>
          <div className="crm-bot-test-modal">
            <div className="crm-bot-test-header">
              <span>
                <strong>{identity.name}</strong>
                <small style={{ marginLeft: 8, color: "var(--crm-muted)", fontSize: 11 }}>Prueba en vivo · prompt activo</small>
              </span>
              <button type="button" onClick={closeTest} aria-label="Cerrar">×</button>
            </div>
            <div className="crm-bot-test-thread" ref={threadRef}>
              {testMessages.length === 0 && !testError ? (
                <div className="crm-bot-test-empty">Escribe un mensaje para probar el bot con el prompt configurado.</div>
              ) : null}
              {testMessages.map((msg, index) => (
                <div key={index} className={`crm-bot-test-msg ${msg.role}`}>
                  <strong>{msg.role === "user" ? "Tú" : identity.name}</strong>
                  <p>{msg.content}</p>
                </div>
              ))}
              {testLoading ? (
                <div className="crm-bot-test-msg assistant crm-bot-test-typing">
                  <strong>{identity.name}</strong>
                  <p>···</p>
                </div>
              ) : null}
              {testError ? <div className="crm-bot-test-error">{testError}</div> : null}
            </div>
            <div className="crm-bot-test-input">
              <input
                className="crm-input"
                placeholder="Escribe tu pregunta..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendTestMessage(); } }}
                disabled={testLoading}
                autoFocus
              />
              <button
                className="crm-btn primary"
                type="button"
                onClick={() => void sendTestMessage()}
                disabled={testLoading || !testInput.trim()}
              >
                {testLoading ? "···" : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function BotField({ label, value, onChange, full, multiline }: { label: string; value: string; onChange: (value: string) => void; full?: boolean; multiline?: boolean }) {
  return (
    <label className={`crm-bot-field ${full ? "full" : ""}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea className="crm-textarea" value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="crm-input" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function BotMetric({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="crm-bot-metric">
      <span>{label}</span>
      <b className={mono ? "crm-mono" : ""}>{value}</b>
    </div>
  );
}

function BotPreview({ identity, pills }: { identity: BotIdentity; pills: BotPill[] }) {
  const greetingHtml = identity.greeting
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

  return (
    <div className="crm-bot-preview">
      <div className="crm-bot-widget">
        <div className="crm-bot-header">
          <div className="crm-bot-av">
            <svg viewBox="0 0 64 64" width="26" height="26" fill="none" aria-hidden="true">
              <rect x="14" y="14" width="36" height="30" rx="10" fill="#1565E8" />
              <rect x="19" y="19" width="26" height="20" rx="6" fill="#0A1628" />
              <circle cx="27" cy="29" r="3" fill="#5CB8FF" />
              <circle cx="37" cy="29" r="3" fill="#5CB8FF" />
              <path d="M28 34 Q32 37 36 34" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" fill="none" />
              <line x1="32" y1="6" x2="32" y2="14" stroke="#1565E8" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="32" cy="5" r="3" fill="#22C55E" />
            </svg>
          </div>
          <div>
            <strong>{identity.name}</strong>
            <small><span />{identity.tagline}</small>
          </div>
        </div>
        <div className="crm-bot-body">
          <div className="crm-bot-bubble" dangerouslySetInnerHTML={{ __html: greetingHtml }} />
        </div>
        <div className="crm-bot-suggested">
          {pills.map((pill) => <span className="crm-small-pill" key={pill.id}>{pill.label}</span>)}
        </div>
        <div className="crm-bot-input-preview">
          <span>Escribe tu pregunta...</span>
          <b>→</b>
        </div>
      </div>
    </div>
  );
}

function TableRows({ rows }: { rows: string[][] }) {
  return (
    <div className="crm-card crm-table-wrap" style={{ border: "0" }}>
      <table className="crm-table">
        <tbody>
          {rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{statusCell(cell)}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Alert({ title, detail, tone, time }: { title: string; detail: string; tone: "danger" | "pending" | "info"; time?: string }) {
  const color = tone === "danger" ? "var(--crm-red)" : tone === "pending" ? "var(--crm-orange)" : "var(--crm-blue-2)";
  return (
    <div className="crm-alert-item" style={{ borderLeftColor: color }}>
      <Icon name={tone === "info" ? "sparkle" : "fraud"} />
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      {time ? <small>{time}</small> : null}
    </div>
  );
}

function Bar({ name, width, color, value }: { name: string; width: number; color: string; value: string }) {
  return (
    <div className="crm-bar-row">
      <span>{name}</span>
      <span className="crm-bar-track"><span className="crm-bar-fill" style={{ width: `${width}%`, background: color }} /></span>
      <span className="crm-mono" style={{ textAlign: "right" }}>{value}</span>
    </div>
  );
}


function Icon({ name }: { name: IconName }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const p: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
    users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.4 2.7-5.5 6-5.5s6 2.1 6 5.5" /><circle cx="17" cy="9" r="2.4" /><path d="M15 14.5c2.5.2 5 1.8 5 4.5" /></>,
    payments: <><path d="M3 7h13l-3-3M21 17H8l3 3" /></>,
    receipts: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    tickets: <><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" /></>,
    chat: <><path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1 4.4A8 8 0 0 1 21 12z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
    fraud: <><path d="M12 3 2 21h20z" /><path d="M12 10v5M12 18h.01" /></>,
    disputes: <><path d="M4 21V4l14 4-6 4 6 4z" /></>,
    recon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 13h4M8 16h7" /></>,
    audit: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.42-1.42" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" /></>,
    download: <><path d="M12 4v12M6 12l6 6 6-6M5 20h14" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    bot: <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    arrowUp: <><path d="M12 19V5M5 12l7-7 7 7" /></>,
    arrowDn: <><path d="M12 5v14M5 12l7 7 7-7" /></>,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>,
    x: <><path d="M18 6 6 18M6 6l12 12" /></>,
  };
  return <svg {...common}>{p[name]}</svg>;
}
