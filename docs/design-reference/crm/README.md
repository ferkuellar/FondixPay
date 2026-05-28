# Handoff: FONDIX PAY · CRM Admin

## Overview

CRM web app for **FONDIX PAY** (Mexican fintech for paying household services).
The CRM is the operational backend used by internal teams:

- **CX (atención al cliente)** – resolve user issues, view payment history.
- **Operations** – monitor transactions, refunds, real-time alerts.
- **Finance / Admin** – daily reconciliation against Conekta (card) and Prontipagos (biller aggregator).
- **Compliance / Risk** – manual KYC review, fraud signals, disputes.
- **Direction** – executive KPIs and trend dashboards.

The design has been reorganized to **match the production sidebar exactly** (12 modules) plus an in-house **Chat Operations Console**.

---

## About the Design Files

The HTML/JSX/CSS files in `source/` are **design references** built as a single-file React prototype that runs in the browser via Babel-standalone. They are **not production code to copy directly**.

The task is to **recreate these designs inside the target codebase** using its existing framework (React + Vite/Next.js is recommended given the JSX source), component library, routing, auth, and data-fetching patterns.

If no codebase exists yet, the recommended stack is:

- **Next.js 14+** (App Router) — SSR + RSC for fast first paint of a heavy admin app.
- **TanStack Query** for server data; **Zustand** for ephemeral UI state.
- **Radix UI** + **Tailwind** OR **shadcn/ui** for the atoms (badges, dialogs, drawers, tables).
- **Recharts** or **Visx** for charts (replaces the hand-rolled SVG `LineChart` / `BarsH` / `Sparkline`).
- **Lucide React** for icons (matches the stroke style of the custom `Icon` component).

---

## Fidelity

**High-fidelity (hifi).** All colors, typography, spacing, radii, shadows, and interaction states are final and pulled from the production design system in `colors_and_type.css`. Recreate pixel-perfectly using the codebase's component library — do not redesign.

---

## Architecture

The prototype loads several scripts in this order. In production this maps to a normal module graph:

```
source/
├── index.html              → app shell + theming CSS (tokens, layout, table, badge styles)
├── colors_and_type.css     → root design tokens (imported)
├── tweaks-panel.jsx        → in-prototype settings panel (NOT shipped to prod; remove)
├── crm-data.js             → mock data — replace with API calls
├── crm-atoms.jsx           → shared UI atoms (Icon, Avatar, Badge, Card, KPI,
│                             Sparkline, LineChart, BarsH, Drawer, Modal, Btn,
│                             TxStatus, ChannelChip)
├── crm-views-1.jsx         → Dashboard · Usuarios · Transacciones (now "Pagos")
├── crm-views-2.jsx         → Conciliación · Tickets · Chat Console · Compliance KYC
├── crm-views-3.jsx         → Pagos alias, Recibos, Búsqueda, Señales fraude,
│                             Disputas, Conciliación Prontipagos, Audit logs
└── crm-app.jsx             → App shell: Sidebar + Topbar + DevBanner + Router
```

In a real React codebase, split each `Atom` into its own file in `components/`, each `View*` into its own route file in `app/(crm)/<route>/page.tsx`, and replace the mock `window.CRM` data layer with TanStack Query hooks pointing at your backend.

---

## Design Tokens

All tokens come from `colors_and_type.css`. The CRM also defines a small **runtime theme layer** in `index.html`'s `<style>` block (light/dark `data-theme` attribute on `<html>`):

### Colors — Brand

| Token             | Hex         | Use                                                 |
| ----------------- | ----------- | --------------------------------------------------- |
| `--blue-600`    | `#1565E8` | Primary accent (links, primary buttons, active nav) |
| `--blue-500`    | `#3B9BFF` | Gradient start for primary buttons                  |
| `--blue-700`    | `#0D4FBF` | Pressed / dark variant                              |
| `--blue-300`    | `#5CB8FF` | Gradient bookend / hover                            |
| `--blue-50`     | `#E8F2FF` | Accent tint (selected sidebar row)                  |
| `--accent`      | runtime     | Defaults to `#1565E8`; user can switch via Tweaks |
| `--accent-tint` | runtime     | `--accent + "15"` (hex with 15/255 alpha)         |

### Colors — Surfaces (light)

| Token         | Hex         | Use                              |
| ------------- | ----------- | -------------------------------- |
| `--surf-0`  | `#FFFFFF` | Page bg + elevated cards         |
| `--surf-1`  | `#FFFFFF` | Same — kept separate for dark   |
| `--surf-2`  | `#F4F8FF` | Sunken rows, chips, table head   |
| `--surf-3`  | `#E2EAF4` | Track of progress bars, dividers |
| `--border`  | `#E2EAF4` | All hairline borders             |
| `--page-bg` | `#F8FAFD` | Content area background          |
| `--side-bg` | `#0A1628` | Sidebar background (always dark) |
| `--top-bg`  | `#FFFFFF` | Topbar background                |

### Colors — Surfaces (dark)

| Token         | Hex         |
| ------------- | ----------- |
| `--surf-0`  | `#0F1E36` |
| `--surf-1`  | `#142848` |
| `--surf-2`  | `#0A1628` |
| `--surf-3`  | `#1B335A` |
| `--border`  | `#25426F` |
| `--page-bg` | `#050C1A` |

### Text

| Token            | Hex         | Use                        |
| ---------------- | ----------- | -------------------------- |
| `--fg-1`       | `#0A1628` | Primary text (light theme) |
| `--fg-2`       | `#4E6788` | Secondary / muted          |
| `--fg-3`       | `#7A95B8` | Tertiary / placeholder     |
| `--side-fg`    | `#E2EAF4` | Sidebar primary text       |
| `--side-muted` | `#7A95B8` | Sidebar secondary text     |

### Status colors

| Tone         | Bg                       | Fg          |
| ------------ | ------------------------ | ----------- |
| `success`  | `rgba(34,197,94,.12)`  | `#15803D` |
| `pending`  | `rgba(245,158,11,.14)` | `#92560A` |
| `danger`   | `rgba(239,68,68,.12)`  | `#B91C1C` |
| `info`     | `rgba(21,101,232,.10)` | `#0D4FBF` |
| `refunded` | `rgba(124,58,237,.12)` | `#5B21B6` |

### Category colors (NEVER reassign — they identify service types throughout the product)

| Category   | Color       |
| ---------- | ----------- |
| Energía   | `#F59E0B` |
| Wifi       | `#22C55E` |
| Agua       | `#0EA5E9` |
| Telefonía | `#7C3AED` |
| Gas        | `#F97316` |
| Streaming  | `#EC4899` |
| Gobierno   | `#10B981` |

### Typography

| Token                 | Family                                        |
| --------------------- | --------------------------------------------- |
| `--font-display`    | `Bricolage Grotesque`                       |
| `--font-display-cd` | `Bricolage Grotesque Condensed`             |
| `--font-body`       | `Bricolage Grotesque`                       |
| `--font-mono`       | `Azeret Mono` — **all numbers, IDs** |

**Mono numerals are non-negotiable.** Amounts, transaction IDs, references, and any tabular numeric data MUST use `Azeret Mono` with `font-variant-numeric: tabular-nums`. The CSS helper class `.mono-cell` already wires this.

Heading sizes inside views (set inline in the view files):

| Element               | Size | Weight | Letter spacing   |
| --------------------- | ---- | ------ | ---------------- |
| View title (`<h1>`) | 24px | 700    | `-.015em`      |
| Card title (`<h3>`) | 14px | 600    | `-.005em`      |
| Body                  | 13px | 400    | normal           |
| Caption / micro       | 11px | 600    | `.05em`, UPPER |

### Spacing

The CSS uses ad-hoc px values, not a strict scale. Common rhythm: **4 / 8 / 10 / 12 / 14 / 18 / 22 / 26 px**. Map to your codebase's scale (Tailwind `gap-3`, `p-4`, etc.) at the closest step.

### Radii

| Element        | Radius |
| -------------- | ------ |
| Inputs         | 10px   |
| Buttons        | 10px   |
| Cards          | 14px   |
| Modals         | 18px   |
| Pills / badges | 999px  |

### Shadows

| Use                           | Value                               |
| ----------------------------- | ----------------------------------- |
| Card (light)                  | none — flat with `1px` border    |
| Modal                         | `0 30px 70px rgba(10,22,40,.4)`   |
| Drawer (slides in from right) | `-20px 0 60px rgba(10,22,40,.18)` |
| Topbar dropdown / tooltip     | `0 6px 14px rgba(10,22,40,.18)`   |
| Sidebar logo gradient         | `0 6px 14px rgba(21,101,232,.45)` |

### Motion

| Token             | Value                                 |
| ----------------- | ------------------------------------- |
| `--ease-out`    | `cubic-bezier(0.22, 1, 0.36, 1)`    |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Drawer slide      | `350ms ease-out`                    |
| Modal enter       | `250ms ease-spring`                 |
| Hover bg change   | `120ms`                             |

---

## App Shell

### Layout

```
┌─────────────┬─────────────────────────────────────────────┐
│             │  Topbar (sticky, 60px)                       │
│             ├─────────────────────────────────────────────┤
│  Sidebar    │  Dev banner (yellow, dismissible, 38px)      │
│  (248px,    ├─────────────────────────────────────────────┤
│   sticky,   │                                              │
│   100vh,    │  Content area                                │
│   dark bg)  │  (padding: 26px 28px 60px)                   │
│             │                                              │
└─────────────┴─────────────────────────────────────────────┘
```

CSS Grid: `grid-template-columns: 248px 1fr`. Collapse to `64px 1fr` (icons only) under 1100px. Sidebar always dark `#0A1628`, regardless of theme.

### Sidebar — final structure (13 modules in 4 groups)

| Group                         | Label                     | Icon          | Route key      |
| ----------------------------- | ------------------------- | ------------- | -------------- |
| **Operación**          | Dashboard                 | `dashboard` | `dashboard`  |
|                               | Usuarios                  | `users`     | `users`      |
|                               | Pagos                     | `tx`        | `pagos`      |
|                               | Recibos                   | `mail`      | `recibos`    |
|                               | Búsqueda                 | `search`    | `busqueda`   |
|                               | Tickets                   | `tickets`   | `tickets`    |
|                               | Chat console              | `chat`      | `chat`       |
| **Riesgo y compliance** | Revisión manual          | `shield`    | `kyc`        |
|                               | Señales fraude           | `warn`      | `fraude`     |
|                               | Disputas                  | `flag`      | `disputas`   |
| **Finanzas**            | Conciliación tarjeta     | `recon`     | `recon-card` |
|                               | Conciliación Prontipagos | `recon`     | `recon-pp`   |
| **Administración**     | Audit logs                | `eye`       | `audit`      |

Sidebar header: `FondixPay` (18px, weight 800) + `CRM Admin` (11.5px, color `--side-muted`) — no logo mark; brand mark is on the topbar/page level if needed.

Sidebar footer: user identity (avatar 34px + name + email) pinned to the bottom.

Selected state: `data-active="true"` → bg `var(--side-active)` (= `rgba(21,101,232,.18)`), icon recolors to `--accent`, font weight 600.

### Topbar

Sticky, `60px`, white bg, bottom border `var(--border)`. From left to right:

1. **Search** — `input` with leading `search` icon + trailing `⌘K` kbd hint, max-width 420px.
2. *(spacer)*
3. **Theme toggle** — icon button, swaps between `moon` and `sun`.
4. **Notifications bell** — icon button with a red dot at top-right when unread.
5. *(vertical divider, 24px tall)*
6. **Env pill** — yellow `#FEF3C7` bg + `#92560A` text + dot `#F59E0B`, mono font, value: `DEV / SANDBOX` (also `STAGING` / `PRODUCTION`).
7. **Role pill** — gray surface, mono font, value: `SUPER_ADMIN`.
8. **Salir button** — white bg, gray border, weight 600, action: logout.

### Dev banner

Below topbar, shown only in non-production envs. Bg `#FEF3C7`, text `#92560A`, with a warn icon, the message **"Operación interna · DEV AUTH habilitado. No usar en producción."**, and a dismiss `×` button.

---

## Views

> Below: every view's purpose, layout, components, copy, and behavior. Recreate them inside your app's routing using the codebase's table / drawer / chart components.

### 1. Dashboard (`/dashboard`)

**Purpose**: At-a-glance health of the platform for ops + direction.

**Layout** (top to bottom):

1. **ViewHeader** — title `Dashboard`, subtitle `Operación en tiempo real · datos del 27 may, 2026`, right-side actions: secondary `Actualizar` + primary `Exportar reporte`.
2. **KPI grid** — 6 KPI tiles in `repeat(6, 1fr)` on ≥1500px, collapsing to 3 then 2 cols. Each tile is 122px tall minimum:
   - **TPV hoy** — main value (mono, 28px, weight 700, letter-spacing -.02em), delta with `arrowUp` icon, sparkline anchored bottom-right.
   - **Transacciones hoy** — `12,847`, delta `+6.2%`.
   - **Tasa de éxito** — `98.4%`, delta `-0.3%` red.
   - **Usuarios activos (7d)** — `38,420`, delta `+12.8%`.
   - **Tickets abiertos** — count, delta `N sobre SLA` red, or `al día` green.
   - **Conciliación de hoy** — `✓ Cuadrada` green OR diff in red.
3. **Charts row** (`2fr 1fr`):
   - **TPV · últimos 30 días** — LineChart, height 260px, mxnShort formatter, time-series with min/max padding and hover tooltip (vertical line + dot + tooltip with date + value).
   - **Volumen por categoría · mes** — Horizontal bars (BarsH), 7 categories using category colors.
4. **Bottom row** (`1fr 1fr`):
   - **Alertas activas** — list of alert cards with 3-color severity (`danger` red / `warn` amber / `info` blue), each: icon + title + detail + relative time.
   - **Tráfico por hora · hoy** — vertical bar chart, 24 bars, current hour highlighted with `--accent`.

### 2. Usuarios (`/users`)

**Purpose**: Find, inspect, and manage end users.

**Layout**:

1. ViewHeader — `Usuarios`, subtitle `60 registrados · X activos`, actions: `Filtros` + `Exportar CSV`.
2. **Toolbar** — search input (leading icon, placeholder `Buscar por nombre o ID…`) + segmented filter (Todos / Activo / KYC pendiente / Bloqueado) + result count on the right.
3. **Data table** — columns:
   - **Usuario** — Avatar 32px (init + hue-based gradient) + name + email (11.5px muted)
   - **ID** — mono `usr_01023`
   - **Estado** — Badge with dot
   - **KYC** — 3 segment indicator (3 pills of `18×5px`, filled in `--accent` up to current level, rest `--surf-3`)
   - **Transacciones** — mono, right-aligned
   - **Volumen total** — mono, bold, right-aligned, MXN currency
   - **Último acceso** — relative time
   - **›** — chevron
4. **Drawer (right slide-in, 520px)** — opens on row click. Sections:
   - Avatar (56px) + name (18px/700) + email + ID (mono, 13px muted, comma-separated)
   - **InfoTile grid** (2 cols): Estado (Badge), Nivel KYC, Teléfono, Estado de residencia, Volumen total (mono), Transacciones (mono).
   - **Últimas transacciones** — last 8 user TX (compact rows: biller mark + name + relative time + mono amount + status badge).
   - **Footer actions** — `Contactar` + `Revisar KYC` + (right-aligned) red `Bloquear cuenta` / `Desbloquear`.

### 3. Pagos (`/pagos`) — historically "Transacciones"

**Purpose**: Find and act on individual payments.

**Layout**:

1. ViewHeader — `Transacciones`, sub `Mostrando últimas 100 transacciones · refrescado al toque`, actions `Más filtros` + `Exportar`.
2. **MiniStat row** (3 cards): En vista (count), Volumen exitoso (mono MXN), Fallidas (red if > 0).
3. **Toolbar** — search by TX id / user / biller / reference + segmented filter `Todas / Exitosas / Pendientes / Fallidas / Reembolsos`.
4. **Data table** — columns:
   - **TX ID** — mono `tx_0847123`
   - **Hora** — `HH:mm` + relative time below
   - **Usuario** — small avatar + first 2 names
   - **Servicio** — color dot + biller name
   - **Monto** — mono, bold, right-aligned, MXN
   - **Método** — `Tarjeta ····NNNN` or `CoDi (SPEI)`
   - **Estado** — TxStatus Badge
5. **Modal (centered, 560px)** opens on row click:
   - Header: biller mark (52×52 with 22% tinted bg) + biller name + `Pagado por <user>` + (right) mono amount 24px + status Badge.
   - InfoTile grid (2 cols): Referencia biller (mono), Método, Fecha y hora, Usuario.
   - **Timeline** card with 3–4 events: `check`s green + final state icon (red if failed). Each row: icon + text + relative time.
   - Footer: `Cerrar` (left), `Re-procesar` (pending) OR `Reembolsar` (success).
   - **Confirmation sub-modal** — 420px, double-confirm refund with amount + user + method.

### 4. Recibos (`/recibos`)

**Purpose**: Track sent payment receipts (WhatsApp/email).

**Layout**: ViewHeader → 4 MiniStats (Enviados hoy / Entregados (green) / Pendientes (amber) / Rebotados (red if > 0)) → Channel filter (`Todos / WhatsApp / Email`) → table with cols: Recibo (mono), Usuario, Servicio, Monto (mono), Canal (ChannelChip), Estado (Entregado/Pendiente/Rebotado Badge), Enviado (relative), eye-icon view action.

### 5. Búsqueda (`/busqueda`)

**Purpose**: Global, cross-entity search.

**Layout**:

1. ViewHeader — `Búsqueda global`, sub `Busca en usuarios, pagos, recibos, tickets, disputas y señales de fraude`.
2. Large autofocus search input (max-width 720px, padding 14px, font-size 15px), with leading icon.
3. **Empty state**: shows preset chips users can click to seed the query (`usr_01023`, `CFE`, `maria.lopez`, `+52 33`, `TKT-4498`).
4. **With ≥2 chars typed**:
   - Segmented scope filter (`Todo / Usuarios / Pagos / Recibos / Tickets`) with hit counts.
   - **Result groups** — one per entity type, each with `<title> · <count>` header and rows. Each `ResultRow` = 34×34 icon tile (tinted bg using entity color), primary text (13.5/600), secondary text (12px muted), meta badge on right, chevron.

### 6. Tickets (`/tickets`)

**Purpose**: Kanban for support tickets with SLA.

**Layout**: ViewHeader → 4-column Kanban grid (`repeat(4, 1fr)`):

- Columns: **Nuevos** (blue), **En proceso** (amber), **Esperando user** (purple), **Resueltos hoy** (green).
- Header: colored dot + title + count pill.
- **TicketCard**:
  - Border-left `3px` colored by priority (high red / medium amber / low gray).
  - Top row: mono ticket id + ChannelChip.
  - 2-line subject.
  - User row: avatar 22px + name + relative time.
  - **SLA bar** (only if status ≠ resolved): label `SLA · vencido` red if breached, `%` count mono on right, then a 3px bar — green < 70% → amber → red > 95%.
  - Footer: `Asignado a <agent>`.

### 7. Chat console (`/chat`)

**Purpose**: Live agent inbox + chat + user context.

**Layout**: 3-panel grid `320px 1fr 320px`, full viewport height minus header.

- **Left panel — cola en vivo**: list of conversations, each row = avatar 36px (with sentiment emoji bottom-right) + name + 2-line preview + (bottom row) `espera Ns` (red if > 120s) + sentiment text colored. Selected row: bg `--accent-tint` + `3px` left border in `--accent`. Unread count: red `#EF4444` pill top-right.
- **Center panel — active chat**:
  - Header: avatar 38px + name + line (`id mono · estado · ● en línea green`) + buttons `Llamar` + primary `Escalar a humano`.
  - Body: scroll area with chat bubbles. Three bubble types:
    - **user** — right-aligned, accent gradient bg, white text, br-bottom-right 4px.
    - **bot** — left-aligned, white bg + border, small `FONDIX Bot` eyebrow in blue.
    - **system** — center pill, amber bg.
  - Typing indicator (3 animated dots) when applicable.
  - Footer: input + primary `Enviar` button + quick-reply chips (`👋 Saludo cordial`, `✅ Pago verificado`, etc.).
- **Right panel — contexto del cliente**:
  - **Cuenta** section: Estado / KYC / Volumen 30d / Cliente desde (Row pattern: muted key on left, value on right, separated by `1px` bottom border).
  - **Últimos pagos** section: 3 mini rows (color dot + biller + mono amount).
  - **Sugerencias del bot** section: tinted accent-tint cards with one-line tips.

### 8. Revisión manual (`/kyc`) — Compliance KYC

**Purpose**: Manual KYC document review queue.

**Layout**: ViewHeader → 2-col `420px 1fr` (collapses to 1 col on tablet):

- **Left — Queue**: sorted by descending risk score. Each row: avatar 36px + name + `doc type · relative time` + **RiskPill** (Alto > 70 red / Medio > 40 amber / Bajo ≤ 40 green) showing label + score.
- **Right — Detail**:
  - **Document card**: header has user name + doc type + RiskPill. Body has 2 columns:
    - Document preview (1.58:1 aspect, dark navy bg, "Instituto Nacional Electoral · CREDENCIAL PARA VOTAR" text). `✓ verificado` green chip top-right.
    - Selfie preview (1:1 aspect, with the user's avatar centered).
  - **Datos del usuario card**: InfoTile grid 2×3 — Nombre, ID (mono), Email, Teléfono, Estado, Enviado.
  - **Alertas card** (only if `flags.length > 0`) — red-tinted rows: warn icon + flag text.
  - **Footer actions**: `Rechazar` (red) + `Solicitar nuevo documento` + (right) primary `Aprobar verificación`.

### 9. Señales fraude (`/fraude`)

**Purpose**: Fraud signal triage.

**Layout**: ViewHeader → 4 MiniStats (Abiertas red / En revisión amber / Bloqueadas / Score promedio) → segmented status filter → table:

- Cols: Señal (mono id), Usuario (avatar + name), Tipo (warn icon colored by score severity + signal name), Detalle, **Risk score** (`ScoreBar` = 110px wide row: 5px progress bar + mono number right, color = red > 80, amber > 50, gray > 30, green ≤ 30), Detectada (relative time), Acciones (3 icon buttons: `eye` view, `shield` block-red, `close` dismiss).

### 10. Disputas (`/disputas`)

**Purpose**: Chargeback management (7-day evidence deadline).

**Layout**: ViewHeader → 4 MiniStats (Abiertas amber / Exposición total mono MXN / Ganadas 30d green / Perdidas 30d red if > 2) → table:

- Cols: Disputa (mono id), TX original (mono), Banco, Motivo, Monto (mono right), Estado (Badge — `Recibida / En revisión / Evidencia enviada / Ganada / Perdida`), **Vence en** (`N d` — red bold if ≤ 2 days, amber if ≤ 4, gray otherwise; `—` for closed disputes).

### 11. Conciliación tarjeta (`/recon-card`)

**Purpose**: Daily reconciliation between Conekta and billers.

**Layout**: ViewHeader → **day strip** (horizontally scrolling row of 10 day buttons — each shows `Hoy/Ayer/<date>` and a status row with check or warn icon; selected day has `1.5px` accent border + `--accent-tint` bg) → **4 KPI cards** (Recibido en pasarela / Pagado a billers / Diferencia / Tasa de éxito) → **Detalle por biller** table (Biller with color dot, Categoría, Recibido mono right, Pagado mono right, Diferencia mono right red bold if non-zero, Estado Badge `OK` green or `Diferencia` red).

### 12. Conciliación Prontipagos (`/recon-pp`)

Same exact layout as `/recon-card`, different mock data. Title `Conciliación · Prontipagos`, sub `Cuadre entre Prontipagos (agregador biller) y servicios pagados`. KPIs say `Recibido en Prontipagos` / `Aplicado a servicios` / `Diferencia` / `SLA Prontipagos`.

### 13. Audit logs (`/audit`)

**Purpose**: Admin action traceability for compliance/SIEM export.

**Layout**: ViewHeader → severity segmented filter (`Todos / Alta / Media / Normal`) + count on the right → **timeline list** with each event in a 6-col grid `12px | 90px | 110px | 140px | 1fr | 90px`:

1. Severity dot (red `high` / amber `medium` / gray `normal`).
2. Relative time (mono, muted).
3. **Role pill** — colored by role: SUPER_ADMIN purple, OPS blue, COMPLIANCE green, CX amber, SYSTEM gray.
4. User name (13/600).
5. **Action**: mono action key (`tx.refund → tx_0847123` with target colored in accent) above 1-line detail.
6. `Ver detalle` quick-pill button.


## 13. Bot de landing.

**Qué tiene la nueva vista:**

**Columna izquierda — editor:**

* **Identidad y bienvenida** : nombre, tagline ("En línea · responde al toque"), tooltip, mensaje de bienvenida (con soporte de `**negritas**` y saltos de línea)
* **Personalidad · system prompt** : textarea grande con la personalidad cargada por default, contador de caracteres y chips de configuración (Tono mexicano, Respuestas cortas, Emojis moderados, Off-topic redirect)
* **Respuestas guiadas** : las 4 pills sugeridas editables con su etiqueta y la pregunta que envían al bot
* **Base de conocimiento** : tabla con 9 Q&A entries, categoría, conteo de usos

**Columna derecha (sticky):**

* **Vista previa en vivo** : mockup del widget del bot que refleja los cambios en identidad/pills en tiempo real
* **Top preguntas · 7 días** : ranking con hits y tasa de escalación (rojo si > 20%)
* **Salud del modelo** : modelo activo (`claude-haiku-4.5`), latencias p50/p95, tokens y costo MXN

 **KPIs arriba** : 247 conversaciones · 4.8 mensajes promedio · 12.4% escalación · 4.6/5 CSAT.

---

## Interactions & Behavior

### Routing

Each nav item is a route. Persist current route in the URL (`/dashboard`, `/users`, `/users/usr_01023` when drawer open, etc.). On the prototype this is in-component state, but production should use the router.

### Drawer (Users detail)

Slide-in from right (350ms ease-out), backdrop dark with 25% opacity. ESC closes. Click outside closes.

### Modal (Transaction detail, Refund confirm)

Fade + spring scale-in (250ms cubic-bezier(0.34, 1.56, 0.64, 1)). Click backdrop closes; ESC closes. **Refund modal is nested inside the TX modal** — confirming a refund closes both.

### Theme toggle

`<html data-theme="light|dark">`. CSS variables remap entirely; no JS-side color swaps. **Sidebar always stays dark** even in light theme.

### Search (top bar `⌘K`)

Spec'd in design but not wired in the prototype. Production: open a global command-menu (Cmd+K) cross-search modal that delegates to the same backend as the Búsqueda page.

### Notifications bell

Red dot indicates unread; no panel implemented yet. Future: dropdown with recent alerts (mirror Dashboard alerts feed).

### Hover states

- Sidebar links: bg `--side-hover` (`rgba(255,255,255,.05)`).
- Table rows: bg `--surf-2`. Cursor pointer when clickable.
- Buttons: subtle bg shift, no transform.
- Sidebar selected: bg `--side-active`, icon recolor to `--accent`.

### Animations (CSS keyframes in `index.html`)

- `t-dot` — typing dots (3 staggered, 1.2s ease-in-out).
- `modal-in` — opacity 0→1 + `translateY(12px) scale(.96)` → `0 1` (250ms).

### Responsive breakpoints

- **≥1500px** — 6-col KPI grid + full 3-pane chat console.
- **<1500px** — KPI grid drops to 3 cols.
- **<1100px** — sidebar collapses to icon-only (64px); chat console context panel hides; KPI to 2 cols.
- **<900px** — single column charts; kanban becomes 2 cols; chat console stacks to single column.

---

## State Management

The prototype keeps everything in component state. For production, suggested mapping:

| Slice                    | Tool                                                 | Notes                                                                           |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| Server data              | TanStack Query                                       | All resources cached by entity (`users`, `transactions`, `tickets`, etc.) |
| Current route            | Next.js / TanStack Router                            | Drives view selection                                                           |
| Drawer / modal open      | Zustand or URL search params (`?drawer=usr_01023`) | URL preferred — shareable                                                      |
| Theme + density + accent | LocalStorage + Zustand                               | Persist user preference                                                         |
| Auth (role, env)         | Server-side session                                  | Drive `SUPER_ADMIN` pill + RBAC                                               |
| Chat console messages    | WebSocket / Server-Sent Events                       | Real-time push + optimistic send                                                |

Mock data shape in `crm-data.js` shows expected schema for each entity — use it to scaffold API contracts.

---

## Data Schema (from `crm-data.js`)

Already JSDoc-like. Highlights:

```ts
type User = {
  id: string;            // 'usr_01023'
  name: string;
  initials: string;      // 'MV'
  email: string;
  phone: string;         // '+52 33 1234 5678'
  state: string;         // residencia
  status: 'active' | 'pending' | 'blocked';
  kyc: 1 | 2 | 3;
  signup: Date;
  txCount: number;
  tpv: number;           // lifetime volume MXN
  lastSeen: Date;
  avatarHue: number;     // 180–280 — used for gradient avatar
};

type Transaction = {
  id: string;            // 'tx_0847123'
  ref: string;           // biller reference, mono
  userId: string;
  userName: string;
  userInitials: string;
  biller: { id; name; category; color };
  amount: number;        // MXN, 2-decimal
  status: 'success' | 'pending' | 'failed' | 'refunded';
  method: 'card' | 'codi';
  createdAt: Date;
  cardLast4: string | null;
};

type Ticket = {
  id: string;            // 'TKT-4498'
  userId; userName; userInitials;
  subject: string;
  channel: 'chat' | 'whatsapp' | 'email';
  status: 'new' | 'in_progress' | 'waiting' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  agent: string;
  createdAt: Date;
  slaPct: number;        // 0–100+
  slaBreach: boolean;
};

type ReconciliationDay = {
  date: Date;
  processorIn: number;
  billersOut: number;
  diff: number;          // 0 when matched
  txCount: number;
  status: 'matched' | 'diff';
};

type KycPending = {
  id: string;
  user: User;
  docType: 'INE' | 'Pasaporte';
  submittedAt: Date;
  riskScore: number;     // 0–100
  flags: string[];
};

type FraudSignal = {
  id: string;            // 'FS-2451'
  user: User;
  signal: string;
  detail: string;
  score: number;         // 0–100
  t: number;             // minutes ago
  status: 'open' | 'review' | 'blocked' | 'dismissed';
};

type Dispute = {
  id: string;            // 'DSP-8870'
  tx: Transaction;
  bank: string;
  reason: string;
  status: 'received' | 'in_review' | 'evidence_sent' | 'won' | 'lost';
  deadline: Date;
  createdAt: Date;
  representmentAmount: number;
};

type AuditLog = {
  t: number;             // minutes ago
  user: string;
  role: 'SUPER_ADMIN' | 'OPS' | 'COMPLIANCE' | 'CX' | 'SYSTEM';
  action: string;        // dot-namespaced, e.g. 'tx.refund'
  target: string;
  detail: string;
  sev: 'high' | 'medium' | 'normal';
};
```

---

## Assets

The prototype doesn't ship any images for the CRM specifically (the FONDIX logo isn't used inside the CRM — only the text wordmark `FondixPay / CRM Admin` in the sidebar). All icons are inline SVG defined in `crm-atoms.jsx` → `Icon` component. If you swap to **Lucide React**, the mapping is straightforward (`dashboard` → `LayoutDashboard`, `users` → `Users`, `tx` → `ArrowLeftRight`, etc.).

Fonts live in the design system project (`Bricolage Grotesque`, `Azeret Mono`) — load via Google Fonts in production or self-host the variable font files already provided.

---

## Screenshots

Reference captures of each view live in `screenshots/` — one PNG per route, numbered to match the sidebar order. They were captured at narrow viewport (~900px), so on wide-content views (Chat console, Dashboard) the rightmost column may be partially clipped — refer to the source files for the full layout. Use these as visual sanity-checks while implementing each route, not as pixel-perfect specs.

| File                                | View                      |
| ----------------------------------- | ------------------------- |
| `01-dashboard.png`                | Dashboard                 |
| `02-usuarios.png`                 | Usuarios                  |
| `03-pagos.png`                    | Pagos (Transacciones)     |
| `04-recibos.png`                  | Recibos                   |
| `05-busqueda.png`                 | Búsqueda global          |
| `06-tickets.png`                  | Tickets                   |
| `07-chat-console.png`             | Chat console (3-panel)    |
| `08-revision-manual-kyc.png`      | Revisión manual · KYC   |
| `09-senales-fraude.png`           | Señales de fraude        |
| `10-disputas.png`                 | Disputas                  |
| `11-conciliacion-tarjeta.png`     | Conciliación tarjeta     |
| `12-conciliacion-prontipagos.png` | Conciliación Prontipagos |
| `13-audit-logs.png`               | Audit logs                |

---

## Files in this handoff

Inside `source/`:

| File                    | Purpose                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `index.html`          | App shell HTML + all CSS (tokens, layout, tables…)                                   |
| `colors_and_type.css` | Root design tokens (imported by index.html)                                           |
| `tweaks-panel.jsx`    | Prototype-only settings panel (NOT for production)                                    |
| `crm-data.js`         | Mock data factory — REPLACE with API calls                                           |
| `crm-atoms.jsx`       | Shared UI atoms                                                                       |
| `crm-views-1.jsx`     | Dashboard / Usuarios / Transacciones (Pagos)                                          |
| `crm-views-2.jsx`     | Conciliación / Tickets / Chat / KYC                                                  |
| `crm-views-3.jsx`     | Pagos alias / Recibos / Búsqueda / Fraude / Disputas / Conciliación PP / Audit logs |
| `crm-app.jsx`         | App shell: Sidebar + Topbar + DevBanner + Router                                      |

---

## Recommended implementation order

1. **Scaffold + tokens** — wire `colors_and_type.css` and the runtime light/dark vars from `index.html` into your codebase. Create the Tailwind / Panda / vanilla-extract config that consumes them.
2. **Shell** — Sidebar (with 4 groups, badges, footer), Topbar (search, theme toggle, bell, env pill, role pill, Salir), DevBanner. Stub views as placeholders.
3. **Atoms** — Icon, Avatar, Badge, Card, KPI, Button, Drawer, Modal. Replace the prototype's hand-rolled SVG `LineChart` + `BarsH` + `Sparkline` with your charting library.
4. **Tables** — Recreate the `.data-table` styles inside your data-table component (TanStack Table, AG Grid, etc.).
5. **Views in priority order**: Dashboard → Pagos → Usuarios → Tickets → Recibos → Búsqueda → Conciliación tarjeta → Conciliación Prontipagos → Revisión manual (KYC) → Señales fraude → Disputas → Audit logs → Chat console (most complex, last).
6. **Connect the data layer** — for each view, replace `window.CRM.*` with TanStack Query hooks calling your real endpoints.
7. **Auth + RBAC** — drive `env`, `role`, and per-section visibility from session.
8. **Real-time** — wire WebSocket for Chat console + new alerts on Dashboard.

---

## Notes for the implementing developer

- **Do not ship the Tweaks panel.** It's a prototype affordance for the designer to switch theme/density/accent live. Strip it out.
- **Bricolage Grotesque** is the brand display font — use the variable font file (`BricolageGrotesque-VariableFont_opsz_wdth_wght.ttf`) referenced in `colors_and_type.css`. The static weights are fallbacks.
- **Azeret Mono is required** for all numeric data and IDs. Don't substitute.
- **The category color palette is product-wide** — wifi green, agua blue, energía amber, etc. Keep these in sync with the consumer app and landing page.
- **Spanish copy is final** — don't translate.
- **All MXN amounts** must use `Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' })` then `.replace('MX$','$')` to render as `$1,247.50` (the project convention).
- **Relative time formatter** in `crm-data.js` (`fmt.relTime`) is used throughout — port to your localized formatter (`Intl.RelativeTimeFormat('es-MX')` works for date math).
- **Tabular numerals** — `font-variant-numeric: tabular-nums` is on `.mono-cell` already; ensure your equivalent class keeps it.
