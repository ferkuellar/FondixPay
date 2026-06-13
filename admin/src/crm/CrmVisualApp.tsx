import { useEffect, useRef, useState } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
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
  | "bot-landing";

type NavItem = {
  key: ModuleKey;
  label: string;
  icon: IconName;
  badge?: number;
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
    items: [{ key: "audit-logs", label: "Audit logs", icon: "audit" }],
  },
];

const users = [
  { id: "usr_01022", name: "Carlos Ortiz Díaz", initials: "CO", email: "carlos.ortiz@gmail.com", state: "Yucatán", status: "Activo", kyc: 3, txCount: 142, tpv: "$84,920.00", lastSeen: "hace 3 min" },
  { id: "usr_01038", name: "María García López", initials: "MG", email: "maria.garcia@gmail.com", state: "CDMX", status: "Activo", kyc: 3, txCount: 88, tpv: "$31,450.20", lastSeen: "hace 22 min" },
  { id: "usr_01045", name: "Ana Sofía Ramírez", initials: "AR", email: "ana.ramirez@gmail.com", state: "Nuevo León", status: "KYC pendiente", kyc: 2, txCount: 24, tpv: "$12,810.00", lastSeen: "hace 2 h" },
  { id: "usr_01052", name: "Luis Hernández Cruz", initials: "LH", email: "luis.cruz@gmail.com", state: "Jalisco", status: "Bloqueado", kyc: 1, txCount: 9, tpv: "$7,420.90", lastSeen: "hace 1 d" },
  { id: "usr_01066", name: "Renata Flores Ortiz", initials: "RF", email: "renata.flores@gmail.com", state: "Querétaro", status: "Activo", kyc: 3, txCount: 51, tpv: "$19,225.00", lastSeen: "hace 4 h" },
  { id: "usr_01071", name: "Diego Pérez Morales", initials: "DP", email: "diego.perez@gmail.com", state: "Estado de México", status: "Activo", kyc: 2, txCount: 73, tpv: "$44,080.00", lastSeen: "hace 18 min" },
];

const payments = [
  { id: "tx_0847200", ref: "MX034829144201", user: "Carlos Ortiz Díaz", initials: "CO", service: "CFE", color: "#f59e0b", amount: "$1,247.50", method: "Tarjeta ···· 4821", status: "Exitosa", created: "hace 8 min" },
  { id: "tx_0847199", ref: "MX034829144183", user: "Renata Martínez", initials: "RM", service: "Totalplay", color: "#22c55e", amount: "$689.00", method: "Tarjeta ···· 1102", status: "Pendiente", created: "hace 14 min" },
  { id: "tx_0847198", ref: "MX034829144121", user: "Paola Reyes", initials: "PR", service: "SACMEX", color: "#0ea5e9", amount: "$432.20", method: "CoDi (SPEI)", status: "Fallida", created: "hace 22 min" },
  { id: "tx_0847197", ref: "MX034829144090", user: "Alejandro Reyes", initials: "AR", service: "Telmex", color: "#22c55e", amount: "$599.00", method: "Tarjeta ···· 7901", status: "Exitosa", created: "hace 31 min" },
  { id: "tx_0847196", ref: "MX034829144052", user: "María García López", initials: "MG", service: "Netflix", color: "#ec4899", amount: "$249.00", method: "Tarjeta ···· 2880", status: "Reembolsada", created: "hace 42 min" },
];

const receipts = [
  ["REC-2026001", "tx_0847200", "CFE", "WhatsApp", "Entregado", "hace 8 min"],
  ["REC-2026002", "tx_0847197", "Telmex", "Email", "Entregado", "hace 31 min"],
  ["REC-2026003", "tx_0847194", "SIAPA", "WhatsApp", "Pendiente", "hace 1 h"],
  ["REC-2026004", "tx_0847191", "Totalplay", "WhatsApp", "Rebotado", "hace 2 h"],
];

const tickets = [
  { id: "TKT-4500", subject: "No se aplicó mi pago de agua", sev: "SEV-2", status: "new", agent: "— sin asignar", sla: 94, channel: "chat", user: "Carlos Ortiz", initials: "CO", age: "hace 12 min" },
  { id: "TKT-4499", subject: "No reconozco un cargo", sev: "SEV-1", status: "in_progress", agent: "Ana Vega", sla: 83, channel: "email", user: "María García", initials: "MG", age: "hace 28 min" },
  { id: "TKT-4498", subject: "No me llegó el comprobante", sev: "SEV-3", status: "waiting", agent: "Luis Mora", sla: 61, channel: "chat", user: "Renata Flores", initials: "RF", age: "hace 1 h" },
  { id: "TKT-4497", subject: "Quiero cambiar mi correo", sev: "SEV-4", status: "resolved", agent: "Karla Ríos", sla: 100, channel: "email", user: "Diego Pérez", initials: "DP", age: "hace 2 h" },
  { id: "TKT-4496", subject: "Pago duplicado en CFE", sev: "SEV-2", status: "in_progress", agent: "Pedro Ibáñez", sla: 72, channel: "chat", user: "Paola Reyes", initials: "PR", age: "hace 3 h" },
];

const conversations = [
  ["c4", "Carlos Ortiz", "Mi pago de Totalplay no se aplica", "SEV-2", "frustrado", "2"],
  ["c1", "Paola Reyes", "No me llega el SMS y necesito pagar luz hoy", "SEV-2", "frustrado", "3"],
  ["c2", "Alejandro Reyes", "¿Cuánto tarda el reembolso de CFE?", "SEV-3", "neutral", "1"],
  ["c3", "Renata Martínez", "Gracias, ya jaló", "SEV-4", "feliz", "0"],
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


const auditLogs = [
  ["hace 4 min", "Ana Vega", "SUPER_ADMIN", "ticket.severity_changed", "TKT-4499", "SEV-2 → SEV-1"],
  ["hace 12 min", "Sistema", "SYSTEM", "conversation.escalated", "c4", "Regla payment_concern"],
  ["hace 35 min", "Karla Ríos", "COMPLIANCE", "kyc.approve", "usr_01045", "KYC nivel 3 aprobado"],
  ["hace 67 min", "Pedro Ibáñez", "CX", "ticket.close", "TKT-4490", "Ticket resuelto"],
  ["hace 2 h", "Luis Mora", "OPS", "recon.adjustment", "recon_2026-05-26", "Ajuste manual documentado"],
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
              {group.items.map((item) => (
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
            <button className="crm-btn" type="button" onClick={logout}>Salir</button>
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
      return <TableView title="Recibos" subtitle="Comprobantes generados y enviados al usuario" rows={receipts} columns={["Recibo", "Pago", "Servicio", "Canal", "Estado", "Enviado"]} />;
    case "search":
      return <SearchView />;
    case "tickets":
      return <TicketsView />;
    case "chat":
      return <ChatConsoleView />;
    case "reconciliation-tekae":
      return <ReconciliationView title="Conciliación Tekae" subtitle="Cuadre entre pagos procesados por Tekae y comisiones correspondientes a FondixPay" />;
    case "audit-logs":
      return <TableView title="Audit logs" subtitle="Registro interno de acciones sensibles" rows={auditLogs} columns={["Tiempo", "Actor", "Rol", "Acción", "Entidad", "Detalle"]} />;
    case "bot-landing":
      return <BotLandingView />;
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
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    api
      .dashboard()
      .then((data) => setSummary(data as typeof summary))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const successRate =
    summary && summary.payments_count > 0
      ? ((summary.payments_succeeded_count / summary.payments_count) * 100).toFixed(1) + "%"
      : "—";

  const recon = summary?.card_reconciliation_status ?? "—";
  const reconOk = recon === "ok" || recon === "cuadrada";

  return (
    <div className="crm-dashboard-stack">
      <ViewHeader
        title="Dashboard"
        subtitle={loading ? "Cargando…" : `${summary?.payments_count ?? 0} pagos registrados · ${summary?.users_count ?? 0} usuarios`}
        actions={
          <>
            <button className="crm-btn" onClick={reload}><Icon name="refresh" />Actualizar</button>
            <button className="crm-btn primary"><Icon name="download" />Exportar reporte</button>
          </>
        }
      />
      <div className="crm-kpi-grid">
        <Kpi label="Total pagos" value={loading ? "…" : String(summary?.payments_count ?? 0)} sub="todos los estados" sparkline={<SparklineMini />} />
        <Kpi label="Pagos exitosos" value={loading ? "…" : String(summary?.payments_succeeded_count ?? 0)} delta={successRate} sub="tasa de éxito" />
        <Kpi label="Pagos pendientes" value={loading ? "…" : String(summary?.payments_pending_count ?? 0)} deltaTone={summary && summary.payments_pending_count > 5 ? "danger" : "success"} />
        <Kpi label="Usuarios registrados" value={loading ? "…" : String(summary?.users_count ?? 0)} sub="total en plataforma" />
        <Kpi label="Tickets abiertos" value={loading ? "…" : String(summary?.support_tickets_open_count ?? 0)} deltaTone={summary && summary.support_tickets_open_count > 3 ? "danger" : "success"} sub="soporte activo" />
        <Kpi label="Conciliación" value={loading ? "…" : reconOk ? "✓ Cuadrada" : recon} deltaTone={reconOk ? "success" : "danger"} sub="tarjeta" />
      </div>
      <div className="crm-charts-row">
        <Card title="TPV · últimos 30 días" action={<select className="crm-select" style={{ width: 86, minHeight: 30, padding: "5px 10px", borderRadius: 8, fontSize: 12 }} defaultValue="30d"><option value="7d">7 días</option><option value="30d">30 días</option><option value="90d">90 días</option></select>}>
          <LineMock />
        </Card>
        <Card title="Volumen por categoría · mes">
          {[
            ["Energía (CFE)", 94, "#f59e0b", "$38.4M"],
            ["Internet", 73, "#22c55e", "$22.8M"],
            ["Agua", 52, "#0ea5e9", "$14.2M"],
            ["Telefonía", 42, "#7c3aed", "$11.9M"],
            ["Gobierno", 35, "#10b981", "$9.6M"],
          ].map(([name, width, color, value]) => <Bar key={String(name)} name={String(name)} width={Number(width)} color={String(color)} value={String(value)} />)}
        </Card>
      </div>
      <div className="crm-charts-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Card title="Alertas activas" action={<span className="crm-badge danger">3 activas</span>}>
          <div className="crm-alert-list">
            <Alert title="Tasa de fallo CoDi > 5%" detail="Banxico reportó timeouts en últimos 12 min" tone="danger" time="hace 12 min" />
            <Alert title="Cola de soporte sobre SLA" detail="8 tickets prioridad alta > 4h sin respuesta" tone="pending" time="hace 34 min" />
            <Alert title="Pico de tráfico CFE" detail="+340% vs misma hora ayer" tone="info" time="hace 1 h" />
          </div>
        </Card>
        <Card title="Tráfico por hora · hoy" action={<span style={{ fontSize: 12, color: "var(--fg-2)" }}>CDMX · GMT-6</span>}>
          <HourlyBars />
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
  const [filter, setFilter] = useState("Todos");
  const visible = users.filter((user) => filter === "Todos" || user.status === filter);
  return (
    <>
      <ViewHeader
        title="Usuarios"
        subtitle="60 registrados · 52 activos"
        actions={
          <>
            <button className="crm-btn">Filtros</button>
            <button className="crm-btn"><Icon name="download" />Exportar CSV</button>
          </>
        }
      />
      <div className="crm-toolbar">
        <div className="crm-field-with-icon">
          <Icon name="search" />
          <input className="crm-input" placeholder="Buscar por nombre o ID..." />
        </div>
        <Segmented options={["Todos", "Activo", "KYC pendiente", "Bloqueado"]} value={filter} onChange={setFilter} />
        <span className="crm-result-count">{visible.length} resultados</span>
      </div>
      <div className="crm-card crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>ID</th>
              <th>Estado</th>
              <th>KYC</th>
              <th style={{ textAlign: "right" }}>Transacciones</th>
              <th style={{ textAlign: "right" }}>Volumen total</th>
              <th>Último acceso</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((user) => (
              <tr key={user.id}>
                <td>
                  <span className="crm-user-cell">
                    <span className="crm-avatar">{user.initials}</span>
                    <span><strong>{user.name}</strong><small>{user.email}</small></span>
                  </span>
                </td>
                <td><span className="crm-mono">{user.id}</span></td>
                <td>{statusCell(user.status)}</td>
                <td><KycBars level={user.kyc} /></td>
                <td className="crm-mono" style={{ textAlign: "right" }}>{user.txCount}</td>
                <td className="crm-mono" style={{ textAlign: "right", fontWeight: 700 }}>{user.tpv}</td>
                <td style={{ color: "var(--crm-muted)" }}>{user.lastSeen}</td>
                <td style={{ color: "var(--crm-muted-2)" }}>›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PaymentsView() {
  return (
    <>
      <ViewHeader
        title="Pagos"
        subtitle="Transacciones recientes · 98.4% tasa de éxito hoy"
        actions={
          <>
            <button className="crm-btn">Filtros</button>
            <button className="crm-btn"><Icon name="download" />Exportar CSV</button>
          </>
        }
      />
      <div className="crm-mini-grid">
        <MiniStat label="Pagos hoy" value="12,847" />
        <MiniStat label="Monto procesado" value="$4.3M" />
        <MiniStat label="Pendientes" value="184" accent="var(--crm-orange)" />
        <MiniStat label="Fallidos" value="91" accent="var(--crm-red)" />
      </div>
      <div className="crm-toolbar">
        <div className="crm-field-with-icon">
          <Icon name="search" />
          <input className="crm-input" placeholder="Buscar por transacción, usuario o biller..." />
        </div>
        <Segmented options={["Todos", "Exitosa", "Pendiente", "Fallida", "Reembolsada"]} value="Todos" onChange={() => undefined} />
      </div>
      <div className="crm-card crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Transacción</th>
              <th>Usuario</th>
              <th>Servicio</th>
              <th style={{ textAlign: "right" }}>Monto</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Creada</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td><span className="crm-mono">{payment.id}</span><small className="crm-subline">{payment.ref}</small></td>
                <td><span className="crm-user-cell compact"><span className="crm-avatar">{payment.initials}</span>{payment.user}</span></td>
                <td><span className="crm-service-dot" style={{ background: payment.color }} />{payment.service}</td>
                <td className="crm-mono" style={{ textAlign: "right", fontWeight: 800 }}>{payment.amount}</td>
                <td>{payment.method}</td>
                <td>{statusCell(payment.status)}</td>
                <td>{payment.created}</td>
                <td><button className="crm-icon-btn" aria-label="Ver pago"><Icon name="eye" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

function TicketsView() {
  const columns = [
    ["Nuevos", "new", "#1565e8"],
    ["En proceso", "in_progress", "#f59e0b"],
    ["Esperando user", "waiting", "#7c3aed"],
    ["Resueltos hoy", "resolved", "#22c55e"],
  ];
  return (
    <>
      <ViewHeader
        title="Tickets de soporte"
        subtitle="18 abiertos · 3 sobre SLA"
        actions={
          <>
            <button className="crm-btn">Mis tickets</button>
            <button className="crm-btn primary"><Icon name="plus" />Crear ticket</button>
          </>
        }
      />
      <div className="crm-kanban">
        {columns.map(([label, status, color]) => (
          <section key={status}>
            <div className="crm-kanban-head">
              <span><i style={{ background: color }} />{label}</span>
              <b>{tickets.filter((ticket) => ticket.status === status).length}</b>
            </div>
            {tickets.filter((ticket) => ticket.status === status).map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}
          </section>
        ))}
      </div>
    </>
  );
}

function TicketCard({ ticket }: { ticket: (typeof tickets)[number] }) {
  return (
    <div className="crm-ticket" style={{ borderLeftColor: ticket.sev === "SEV-1" ? "var(--crm-red)" : ticket.sev === "SEV-2" ? "var(--crm-orange)" : "var(--crm-blue)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span className="crm-mono">{ticket.id}</span>
        <ChannelChip channel={ticket.channel} />
      </div>
      <strong style={{ display: "block", fontSize: 13, marginTop: 8 }}>{ticket.subject}</strong>
      <div className="crm-ticket-user">
        <span className="crm-avatar small">{ticket.initials}</span>
        <span>{ticket.user}</span>
        <small>{ticket.age}</small>
      </div>
      {ticket.status !== "resolved" ? (
        <>
          <div className="crm-sla-label"><span>SLA {ticket.sla > 90 ? "· vencido" : ""}</span><b>{ticket.sla}%</b></div>
          <div className="crm-bar-track"><div className="crm-bar-fill" style={{ width: `${ticket.sla}%`, background: ticket.sla > 90 ? "var(--crm-red)" : ticket.sla > 70 ? "var(--crm-orange)" : "var(--crm-green)" }} /></div>
        </>
      ) : null}
      <p style={{ color: "var(--crm-muted)", fontSize: 11, margin: "8px 0 0" }}>Asignado a <b>{ticket.agent}</b></p>
    </div>
  );
}

function ChatConsoleView() {
  const [active, setActive] = useState(conversations[0]);
  return (
    <>
      <ViewHeader title="Chat Operations Console" subtitle="7 conversaciones activas · 2 requieren atención" />
      <div className="crm-chat-layout">
        <aside className="crm-chat-pane">
          <div className="crm-chat-head"><strong>Cola en vivo</strong><span className="crm-nav-badge">7</span></div>
          {conversations.map((conversation) => (
            <button className={`crm-chat-row ${active[0] === conversation[0] ? "active" : ""}`} key={conversation[0]} type="button" onClick={() => setActive(conversation)} style={{ width: "100%", textAlign: "left", border: 0, background: active[0] === conversation[0] ? undefined : "transparent", font: "inherit" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="crm-avatar">{conversation[1].split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ fontSize: 13 }}>{conversation[1]}</strong>
                  <div style={{ color: "var(--crm-muted)", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conversation[2]}</div>
                </div>
                {conversation[5] !== "0" ? <span className="crm-nav-badge">{conversation[5]}</span> : null}
              </div>
              <div style={{ marginTop: 7, display: "flex", justifyContent: "space-between", fontSize: 11, color: conversation[4] === "frustrado" ? "var(--crm-red)" : "var(--crm-muted)" }}>
                <span>espera 124s</span><span>{conversation[4]}</span>
              </div>
            </button>
          ))}
        </aside>
        <section className="crm-chat-pane" style={{ background: "#f1f6ff" }}>
          <div className="crm-chat-head">
            <span className="crm-avatar">{active[1].split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
            <div>
              <strong>{active[1]}</strong>
              <div style={{ color: "var(--crm-muted)", fontSize: 12 }}><span className="crm-mono">usr_01022</span> · Yucatán · ● en línea</div>
            </div>
          </div>
          <div className="crm-message user">Hola, hice un pago de Totalplay hace 2 días y no se aplica.<br /><small>hace 8 min</small></div>
          <div className="crm-message bot"><strong style={{ color: "var(--crm-blue)", fontSize: 11 }}>FONDIX BOT</strong><br />¡Hola Diego! Veo que tienes un pago a Totalplay. Lo estoy verificando...</div>
          <div className="crm-message system">⚡ Chat escalado a humano · cola "Pagos no aplicados"</div>
          <div style={{ padding: 16, borderTop: "1px solid var(--crm-border)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="crm-input" placeholder="Escribe tu respuesta..." />
              <button className="crm-btn primary">Enviar</button>
            </div>
            <div className="crm-quick-pills">
              {["Saludo cordial", "Pago verificado", "Estamos revisando", "Reembolso iniciado"].map((item) => <button key={item} type="button">{item}</button>)}
            </div>
          </div>
        </section>
        <aside className="crm-chat-pane">
          <div className="crm-chat-head"><strong>Contexto del cliente</strong></div>
          <div style={{ padding: 14, display: "grid", gap: 12 }}>
            <div>
              <h4 className="crm-panel-title">Cuenta</h4>
              <KeyValue label="Estado" value={<span className="crm-badge success">Activo</span>} />
              <KeyValue label="KYC" value="Nivel 3 de 3" />
              <KeyValue label="Volumen 30d" value="$21,230.00" mono />
              <KeyValue label="Cliente desde" value="12/02/2026" />
            </div>
            <div>
              <h4 className="crm-panel-title">Clasificación</h4>
              <KeyValue label="Intent" value="payment_concern" />
              <KeyValue label="Severidad" value={active[3]} mono />
              <KeyValue label="Confianza" value="0.86" mono />
            </div>
            <div className="crm-note"><strong>Ticket vinculado</strong><br /><span className="crm-mono">TKT-4500</span> · SLA vence en 42 min.</div>
            <div>
              <h4 className="crm-panel-title">Sugerencias del bot</h4>
              {["El usuario menciona Totalplay — ofrecer link al estado del pago.", "Verificar referencia 5512345678 en panel de billers.", "Lleva 235s esperando — escalar antes de 5 min."].map((item) => <div className="crm-suggestion" key={item}>{item}</div>)}
            </div>
            <button className="crm-btn primary">Asignar a mí</button>
            <button className="crm-btn">Cambiar severidad</button>
            <button className="crm-btn">Agregar nota interna</button>
          </div>
        </aside>
      </div>
    </>
  );
}

function KeyValue({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="crm-key-value">
      <span>{label}</span>
      <b className={mono ? "crm-mono" : ""}>{value}</b>
    </div>
  );
}

function ReconciliationView({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <ViewHeader title={title} subtitle={subtitle} actions={<button className="crm-btn primary"><Icon name="refresh" />Re-conciliar</button>} />
      <div className="crm-kpi-grid">
        <Kpi label="Recibido" value="$4,211,880.20" meta="12,487 TX procesadas" />
        <Kpi label="Pagado" value="$4,211,880.20" meta="Biller settlement mock" />
        <Kpi label="Diferencia" value="$0.00" meta="Sin diferencias" />
        <Kpi label="Tasa éxito" value="98.6%" meta="±0.2% vs promedio" />
      </div>
      <div style={{ marginTop: 18 }}>
        <TableRows rows={[["CFE", "Energía", "$1,840,000.00", "$1,840,000.00", "Cuadrada"], ["SACMEX", "Agua", "$438,200.00", "$438,200.00", "Cuadrada"], ["Totalplay", "Internet", "$771,900.00", "$771,487.20", "Diferencia"]]} />
      </div>
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

function SparklineMini() {
  const points = "0,37 20,31 40,34 60,22 80,26 100,15 120,20 140,8";
  return (
    <svg width="140" height="48" viewBox="0 0 140 48" role="img" aria-label="Tendencia TPV">
      <path d={`M0 48 L ${points} L 140 48 Z`} fill="rgba(21,101,232,.15)" />
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
    </svg>
  );
}

function HourlyBars() {
  const values = Array.from({ length: 24 }, (_, index) => 30 + ((index * 17) % 71));
  const max = Math.max(...values);
  const current = new Date().getHours();
  return (
    <div className="crm-hourly">
      {values.map((value, hour) => (
        <div className={`crm-hourly-col ${hour === current ? "current" : ""}`} key={hour}>
          <div className="crm-hourly-bar-wrap">
            <div className="crm-hourly-bar" style={{ height: `${(value / max) * 100}%` }} title={`${hour}:00`} />
          </div>
          <small>{hour % 6 === 0 ? hour : ""}</small>
        </div>
      ))}
    </div>
  );
}

function LineMock() {
  const points = "0,210 52,198 104,205 156,150 208,170 260,120 312,166 364,95 416,125 468,78 520,112 572,42 624,86 676,128";
  return (
    <div className="crm-chart">
      <svg viewBox="0 0 676 255" preserveAspectRatio="none" role="img" aria-label="TPV últimos 30 días">
        <polygon points={`0,255 ${points} 676,255`} fill="rgba(21,101,232,.15)" />
        <polyline points={points} fill="none" stroke="var(--crm-blue)" strokeWidth="3" />
      </svg>
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
