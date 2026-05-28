import { useState, type FormEvent } from "react";

import { useAdminApi } from "../api/useAdminApi";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminResource } from "../hooks/useAdminResource";
import type { ChatbotConversation, ChatbotFaq, ChatbotIntent, ChatbotKnowledgeEntry } from "../types/admin";
import { formatDate } from "../utils/format";

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

export function ChatbotDashboardPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Bot de Landing</h1>
          <p>Consola interna para respuestas publicas. No consulta datos privados ni ejecuta pagos.</p>
        </div>
      </header>
      <div className="panel form-grid">
        <a className="button" href="#/chatbot/faqs">FAQs</a>
        <a className="button" href="#/chatbot/intents">Intenciones</a>
        <a className="button" href="#/chatbot/knowledge">Base de conocimiento</a>
        <a className="button" href="#/chatbot/settings">Configuracion</a>
        <a className="button" href="#/chatbot/conversations">Conversaciones</a>
        <a className="button" href="#/chatbot/fallbacks">Fallbacks</a>
        <a className="button button-quiet" href="#/chat-operations">Ver Chat Operations</a>
      </div>
    </section>
  );
}

export function ChatbotFaqsPage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.chatbotFaqs(), [api]);
  const [draft, setDraft] = useState({ question: "", answer: "", category: "general", priority: 100 });
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.createChatbotFaq(draft);
      setDraft({ question: "", answer: "", category: "general", priority: 100 });
      setFormError(null);
      reload();
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "No se pudo crear FAQ.");
    }
  };

  const toggle = async (faq: ChatbotFaq) => {
    if (!window.confirm(`${faq.is_active ? "Desactivar" : "Activar"} FAQ?`)) return;
    faq.is_active ? await api.disableChatbotFaq(faq.id) : await api.enableChatbotFaq(faq.id);
    reload();
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>FAQs del bot</h1>
          <p>Respuestas exactas aprobadas para el chatbot publico.</p>
        </div>
      </header>
      {hasPermission("admin.chatbot.manage") ? (
        <form className="panel form-grid" onSubmit={submit}>
          <h2>Crear FAQ</h2>
          <label>Pregunta<input value={draft.question} onChange={(event) => setDraft({ ...draft, question: event.target.value })} required /></label>
          <label>Categoria<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
          <label>Prioridad<input type="number" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: Number(event.target.value) })} /></label>
          <label>Respuesta<textarea value={draft.answer} onChange={(event) => setDraft({ ...draft, answer: event.target.value })} required /></label>
          <button className="button" type="submit">Crear FAQ</button>
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      ) : null}
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="FAQs no disponibles" message={error} /> : null}
      {data?.length === 0 ? <EmptyState title="Sin FAQs" message="No hay respuestas exactas configuradas." /> : null}
      {data && data.length > 0 ? (
        <DataTable<ChatbotFaq>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "question", header: "Pregunta", render: (row) => row.question },
            { key: "category", header: "Categoria", render: (row) => row.category ?? "general" },
            { key: "active", header: "Estado", render: (row) => <StatusBadge value={row.is_active ? "active" : "disabled"} /> },
            { key: "updated", header: "Actualizada", render: (row) => formatDate(row.updated_at) },
            { key: "action", header: "Accion", render: (row) => hasPermission("admin.chatbot.manage") ? <button className="button secondary" onClick={() => toggle(row)}>{row.is_active ? "Desactivar" : "Activar"}</button> : "Solo lectura" },
          ]}
        />
      ) : null}
    </section>
  );
}

export function ChatbotIntentsPage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.chatbotIntents(), [api]);
  const [draft, setDraft] = useState({ name: "", description: "", example_phrases: "", response: "", severity_hint: "low" });
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.createChatbotIntent({ ...draft, example_phrases: splitLines(draft.example_phrases) });
      setDraft({ name: "", description: "", example_phrases: "", response: "", severity_hint: "low" });
      setFormError(null);
      reload();
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "No se pudo crear intencion.");
    }
  };

  const toggle = async (intent: ChatbotIntent) => {
    if (!window.confirm(`${intent.is_active ? "Desactivar" : "Activar"} intencion?`)) return;
    intent.is_active ? await api.disableChatbotIntent(intent.id) : await api.enableChatbotIntent(intent.id);
    reload();
  };

  return (
    <section className="page">
      <header className="page-header"><div><h1>Intenciones del bot</h1><p>Reglas explicables por frases ejemplo. No usan datos privados.</p></div></header>
      {hasPermission("admin.chatbot.manage") ? (
        <form className="panel form-grid" onSubmit={submit}>
          <h2>Crear intencion</h2>
          <label>Nombre<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
          <label>Descripcion<input value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
          <label>Severidad<select value={draft.severity_hint} onChange={(event) => setDraft({ ...draft, severity_hint: event.target.value })}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select></label>
          <label>Frases ejemplo<textarea value={draft.example_phrases} onChange={(event) => setDraft({ ...draft, example_phrases: event.target.value })} placeholder="Una frase por linea" required /></label>
          <label>Respuesta<textarea value={draft.response} onChange={(event) => setDraft({ ...draft, response: event.target.value })} required /></label>
          <button className="button" type="submit">Crear intencion</button>
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      ) : null}
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Intenciones no disponibles" message={error} /> : null}
      {data?.length === 0 ? <EmptyState title="Sin intenciones" message="No hay reglas de intencion configuradas." /> : null}
      {data && data.length > 0 ? (
        <DataTable<ChatbotIntent>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "name", header: "Nombre", render: (row) => row.name },
            { key: "examples", header: "Ejemplos", render: (row) => row.example_phrases.join(", ") },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.is_active ? "active" : "disabled"} /> },
            { key: "action", header: "Accion", render: (row) => hasPermission("admin.chatbot.manage") ? <button className="button secondary" onClick={() => toggle(row)}>{row.is_active ? "Desactivar" : "Activar"}</button> : "Solo lectura" },
          ]}
        />
      ) : null}
    </section>
  );
}

export function ChatbotKnowledgePage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.chatbotKnowledge(), [api]);
  const [draft, setDraft] = useState({ title: "", content: "", category: "general", tags: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.createChatbotKnowledge({ ...draft, tags: splitLines(draft.tags) });
      setDraft({ title: "", content: "", category: "general", tags: "" });
      setFormError(null);
      reload();
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "No se pudo crear entrada.");
    }
  };

  const toggle = async (entry: ChatbotKnowledgeEntry) => {
    if (!window.confirm(`${entry.is_active ? "Desactivar" : "Activar"} entrada?`)) return;
    entry.is_active ? await api.disableChatbotKnowledge(entry.id) : await api.enableChatbotKnowledge(entry.id);
    reload();
  };

  return (
    <section className="page">
      <header className="page-header"><div><h1>Base de conocimiento</h1><p>Contenido publico consultable por busqueda segura.</p></div></header>
      {hasPermission("admin.chatbot.manage") ? (
        <form className="panel form-grid" onSubmit={submit}>
          <h2>Crear entrada</h2>
          <label>Titulo<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label>
          <label>Categoria<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
          <label>Tags<textarea value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="Un tag por linea" /></label>
          <label>Contenido<textarea value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} required /></label>
          <button className="button" type="submit">Crear entrada</button>
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      ) : null}
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Base no disponible" message={error} /> : null}
      {data?.length === 0 ? <EmptyState title="Sin entradas" message="No hay entradas de conocimiento configuradas." /> : null}
      {data && data.length > 0 ? (
        <DataTable<ChatbotKnowledgeEntry>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "title", header: "Titulo", render: (row) => row.title },
            { key: "category", header: "Categoria", render: (row) => row.category ?? "general" },
            { key: "status", header: "Estado", render: (row) => <StatusBadge value={row.is_active ? "active" : "disabled"} /> },
            { key: "action", header: "Accion", render: (row) => hasPermission("admin.chatbot.manage") ? <button className="button secondary" onClick={() => toggle(row)}>{row.is_active ? "Desactivar" : "Activar"}</button> : "Solo lectura" },
          ]}
        />
      ) : null}
    </section>
  );
}

export function ChatbotSettingsPage() {
  const api = useAdminApi();
  const { hasPermission } = useAdminAuth();
  const { data, error, loading, reload } = useAdminResource(() => api.chatbotSettings(), [api]);
  const [key, setKey] = useState("fallback_message");
  const [value, setValue] = useState("{}");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.updateChatbotSetting(key, JSON.parse(value));
      setFormError(null);
      reload();
    } catch (updateError) {
      setFormError(updateError instanceof Error ? updateError.message : "JSON invalido o configuracion rechazada.");
    }
  };

  return (
    <section className="page">
      <header className="page-header"><div><h1>Configuracion del bot</h1><p>Parametros no secretos. Llaves de proveedores se leen solo desde variables de entorno.</p></div></header>
      {hasPermission("admin.chatbot.settings.manage") ? (
        <form className="panel form-grid" onSubmit={submit}>
          <label>Clave<input value={key} onChange={(event) => setKey(event.target.value)} required /></label>
          <label>Valor JSON<textarea value={value} onChange={(event) => setValue(event.target.value)} required /></label>
          <button className="button" type="submit">Guardar configuracion</button>
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      ) : null}
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Configuracion no disponible" message={error} /> : null}
      {data?.length === 0 ? <EmptyState title="Sin configuracion" message="No hay configuraciones guardadas." /> : null}
      {data && data.length > 0 ? (
        <DataTable rows={data} getRowKey={(row) => row.id} columns={[
          { key: "key", header: "Clave", render: (row) => row.key },
          { key: "value", header: "Valor", render: (row) => JSON.stringify(row.value ?? {}) },
          { key: "updated", header: "Actualizada", render: (row) => formatDate(row.updated_at) },
        ]} />
      ) : null}
    </section>
  );
}

export function ChatbotConversationsPage() {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.chatbotConversations(), [api]);
  return (
    <section className="page">
      <header className="page-header"><div><h1>Conversaciones del bot</h1><p>Historial anonimo con mensajes enmascarados.</p></div></header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Conversaciones no disponibles" message={error} /> : null}
      {data?.length === 0 ? <EmptyState title="Sin conversaciones" message="Aun no hay conversaciones publicas." /> : null}
      {data && data.length > 0 ? (
        <DataTable<ChatbotConversation>
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "conversation_id", render: (row) => row.id },
            { key: "source", header: "Fuente", render: (row) => row.source },
            { key: "confidence", header: "Confianza", render: (row) => row.confidence ?? "n/a" },
            { key: "last", header: "Ultimo mensaje", render: (row) => formatDate(row.last_message_at) },
            { key: "action", header: "Accion", render: (row) => <a href={`#/chatbot/conversations/${row.id}`}>Abrir</a> },
          ]}
        />
      ) : null}
    </section>
  );
}

export function ChatbotConversationDetailPage({ id }: { id: string }) {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.chatbotConversation(id), [api, id]);
  return (
    <section className="page">
      <header className="page-header"><div><h1>Conversacion del bot</h1><p>{id}</p></div></header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Conversacion no disponible" message={error} /> : null}
      {data ? (
        <div className="panel">
          <p><strong>Fuente:</strong> {data.source}</p>
          <p><strong>URL:</strong> {data.page_url ?? "No registrada"}</p>
          <p><strong>Estado:</strong> {data.status}</p>
          <h2>Mensajes enmascarados</h2>
          {(data.messages ?? []).map((message) => (
            <p key={message.id}><strong>{message.sender_type}:</strong> {message.message_text_masked}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function ChatbotFallbacksPage() {
  const api = useAdminApi();
  const { data, error, loading } = useAdminResource(() => api.chatbotFallbacks(), [api]);
  return (
    <section className="page">
      <header className="page-header"><div><h1>Fallbacks del bot</h1><p>Preguntas sin respuesta confiable para revision humana.</p></div></header>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState title="Fallbacks no disponibles" message={error} /> : null}
      {data?.length === 0 ? <EmptyState title="Sin fallbacks" message="No hay fallbacks pendientes." /> : null}
      {data && data.length > 0 ? (
        <DataTable
          rows={data}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "fallback_id", render: (row) => row.id },
            { key: "message", header: "Mensaje enmascarado", render: (row) => row.message_text_masked },
            { key: "reason", header: "Razon", render: (row) => row.reason },
            { key: "reviewed", header: "Revision", render: (row) => <StatusBadge value={row.reviewed ? "reviewed" : "pending"} /> },
            { key: "created", header: "Fecha", render: (row) => formatDate(row.created_at) },
          ]}
        />
      ) : null}
    </section>
  );
}
