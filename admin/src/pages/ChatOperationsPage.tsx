import { useEffect, useMemo, useState } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import type { ChatbotConversation, ChatOperationsMetrics } from "../types/admin";
import { formatDate } from "../utils/format";

const SEVERITIES = ["SEV-1", "SEV-2", "SEV-3", "SEV-4", "SEV-5"];

type Filters = {
  q: string;
  status: string;
  severity: string;
  source: string;
  escalated: string;
};

export function ChatOperationsPage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const [metrics, setMetrics] = useState<ChatOperationsMetrics | null>(null);
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [filters, setFilters] = useState<Filters>({ q: "", status: "", severity: "", source: "", escalated: "" });

  const selected = useMemo(
    () => conversations.find((conversation) => String(conversation.id) === selectedId) ?? conversations[0] ?? null,
    [conversations, selectedId],
  );

  const load = async () => {
    try {
      setLoading(true);
      const [nextMetrics, nextConversations] = await Promise.all([
        api.chatOperationsMetrics(),
        api.chatOperationsConversations({
          q: filters.q,
          status: filters.status,
          severity: filters.severity,
          source: filters.source,
          escalated: filters.escalated,
        }),
      ]);
      setMetrics(nextMetrics);
      setConversations(nextConversations);
      setSelectedId((current) => current ?? String(nextConversations[0]?.id ?? ""));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar operaciones de chat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const reload = () => void load();

  const createTicket = async () => {
    if (!selected) return;
    await api.createChatOperationsTicket(String(selected.id), {
      title: `Chat ${selected.id} - ${selected.detected_intent ?? "sin clasificar"}`,
      summary: selected.classification_reason ?? "Ticket creado desde consola de chat.",
    });
    reload();
  };

  const assignToMe = async () => {
    if (!selected) return;
    await api.assignChatConversation(String(selected.id));
    reload();
  };

  const changeSeverity = async (severity: string) => {
    if (!selected) return;
    await api.updateChatConversationSeverity(String(selected.id), { severity, note: "Ajuste manual desde consola de operaciones." });
    reload();
  };

  const addNote = async () => {
    if (!selected || !note.trim()) return;
    await api.addChatConversationNote(String(selected.id), note);
    setNote("");
    reload();
  };

  const escalate = async () => {
    if (!selected) return;
    await api.escalateChatConversation(String(selected.id));
    reload();
  };

  return (
    <section className="page chat-ops-page">
      <header className="page-header">
        <div>
          <h1>Chat Operations</h1>
          <p>Consola interna para conversaciones, severidad, tickets, SLA y escalamiento humano.</p>
        </div>
        <a className="button button-quiet" href="#/chatbot">Bot de Landing</a>
      </header>

      {metrics ? (
        <div className="stats-grid">
          <Metric label="Conversaciones" value={metrics.total_conversations} />
          <Metric label="Activas" value={metrics.active_conversations} />
          <Metric label="Resueltas por bot" value={metrics.bot_resolved_conversations} />
          <Metric label="Escaladas" value={metrics.human_escalated_conversations} tone="danger" />
          <Metric label="Tickets" value={metrics.tickets_created} />
          <Metric label="SLA vencido" value={metrics.sla_breached_tickets} tone="warning" />
          <Metric label="Fallback rate" value={`${metrics.fallback_rate}%`} />
          <Metric label="CSAT" value={metrics.csat_average ?? "n/a"} />
        </div>
      ) : null}

      <div className="panel filters chat-ops-filters">
        <label>Buscar<input value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} placeholder="Sesion, intent..." /></label>
        <label>Estado<input value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} placeholder="open, escalated..." /></label>
        <label>Severidad<select value={filters.severity} onChange={(event) => setFilters({ ...filters, severity: event.target.value })}><option value="">Todas</option>{SEVERITIES.map((severity) => <option key={severity}>{severity}</option>)}</select></label>
        <label>Fuente<input value={filters.source} onChange={(event) => setFilters({ ...filters, source: event.target.value })} placeholder="landing" /></label>
        <label>Escalado<select value={filters.escalated} onChange={(event) => setFilters({ ...filters, escalated: event.target.value })}><option value="">Todos</option><option value="true">Si</option><option value="false">No</option></select></label>
        <button className="button" type="button" onClick={reload}>Filtrar</button>
      </div>

      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Chat Operations no disponible" message={error} /> : null}
      {!loading && !error && conversations.length === 0 ? <EmptyState title="Sin conversaciones" message="No hay conversaciones que coincidan con los filtros." /> : null}

      {selected ? (
        <div className="chat-ops-grid">
          <aside className="panel chat-ops-list">
            <h2>Cola</h2>
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`queue-item ${String(conversation.id) === String(selected.id) ? "active" : ""}`}
                type="button"
                onClick={() => setSelectedId(String(conversation.id))}
              >
                <span>#{conversation.id} · {conversation.source}</span>
                <strong>{conversation.detected_intent ?? "sin intent"}</strong>
                <small>{formatDate(conversation.last_message_at)}</small>
                <span className="queue-badges"><StatusBadge value={conversation.severity ?? "SEV-4"} /><StatusBadge value={conversation.escalation_status ?? "none"} /></span>
              </button>
            ))}
          </aside>

          <section className="panel chat-ops-thread">
            <div className="thread-header">
              <div>
                <h2>Conversacion #{selected.id}</h2>
                <p>{selected.classification_reason ?? "Sin razon de clasificacion registrada."}</p>
              </div>
              <StatusBadge value={selected.severity ?? "SEV-4"} />
            </div>
            <div className="thread-messages">
              {(selected.messages ?? []).map((message) => (
                <article key={message.id} className={`thread-message ${message.sender_type}`}>
                  <strong>{message.sender_type}</strong>
                  <p>{message.message_text_masked}</p>
                  <small>{formatDate(message.created_at)}</small>
                </article>
              ))}
            </div>
            <div className="internal-note-box">
              <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Nota interna para soporte/manager..." />
              <button className="button" type="button" onClick={addNote} disabled={!hasPermission("admin.chat_ops.notes.create")}>Agregar nota</button>
            </div>
          </section>

          <aside className="panel chat-ops-context">
            <h2>Escalamiento humano</h2>
            <dl>
              <div className="detail-row"><dt>Ticket</dt><dd>{selected.linked_ticket_id ? <a href={`#/tickets/${selected.linked_ticket_id}`}>TK #{selected.linked_ticket_id}</a> : "Sin ticket"}</dd></div>
              <div className="detail-row"><dt>Asignado</dt><dd>{selected.assigned_to ?? "Sin asignar"}</dd></div>
              <div className="detail-row"><dt>Escalacion</dt><dd>{selected.escalation_status ?? "none"}</dd></div>
              <div className="detail-row"><dt>Confianza</dt><dd>{selected.confidence ?? "n/a"}</dd></div>
            </dl>
            <div className="action-stack">
              <button className="button" type="button" onClick={createTicket} disabled={!hasPermission("admin.chat_ops.manage") || Boolean(selected.linked_ticket_id)}>Crear ticket</button>
              <button className="button button-quiet" type="button" onClick={escalate} disabled={!hasPermission("admin.chat_ops.manage")}>Escalar a humano</button>
              <button className="button button-quiet" type="button" onClick={assignToMe} disabled={!hasPermission("admin.chat_ops.assign")}>Asignar a mi</button>
            </div>
            <h2>Severidad</h2>
            <div className="severity-grid">
              {SEVERITIES.map((severity) => (
                <button key={severity} className="button button-quiet" type="button" onClick={() => changeSeverity(severity)} disabled={!hasPermission("admin.chat_ops.severity.override")}>
                  {severity}
                </button>
              ))}
            </div>
            <h2>Audit timeline</h2>
            <div className="audit-mini-list">
              {(selected.events ?? []).slice(-8).map((event) => (
                <div key={event.id} className="note">
                  <strong>{event.event_type}</strong>
                  <small>{formatDate(event.created_at)}</small>
                  {event.note ? <p>{event.note}</p> : null}
                </div>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: "danger" | "warning" }) {
  return (
    <article className={`stat-card ${tone ? `metric-${tone}` : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>ChatOps</small>
    </article>
  );
}
