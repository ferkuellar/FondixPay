/* ============================================================
   FondixPay — Bot Widget
   Vanilla JS, no dependencies.
   Production: set window.FONDIX_BOT_BASE in an inline <script> before this file:
     <script>window.FONDIX_BOT_BASE = 'https://fondixpay-production.up.railway.app';</script>
     <script defer src="bot-widget.js"></script>
   Dev default: http://localhost:8000
============================================================ */
const FONDIX_BOT_BASE = (window.FONDIX_BOT_BASE || '').replace(/\/$/, '') || 'http://localhost:8000';

const DEFAULTS = {
  name: 'FONDIX Bot',
  tagline: 'En línea · responde al toque',
  tooltip: '¿Tienes dudas? Pregúntame',
  greeting: '¡Hola! Soy el bot de FONDIX PAY. ¿En qué te puedo ayudar?',
  model_display: 'claude-haiku-4-5',
  pills: [
    { id: 'p1', label: 'Servicios', question: '¿Qué servicios puedo pagar?' },
    { id: 'p2', label: 'Comisiones', question: '¿Cuánto cobran de comisión?' },
    { id: 'p3', label: 'Cómo empezar', question: '¿Cómo me registro?' },
  ],
};

const SAFE_ERROR = 'Ups, no pude responder. Intenta de nuevo.';
const SESSION_KEY = 'fondix_bot_session';
const CONFIG_URL  = `${FONDIX_BOT_BASE}/api/public/chat/config`;
const CHAT_URL    = `${FONDIX_BOT_BASE}/api/public/chat`;

// ── Bot SVG icon (shared between FAB and header) ─────────────────────────────
const FAB_SVG = `
<svg class="bot-svg" viewBox="0 0 64 64" fill="none" aria-hidden="true">
  <line x1="32" y1="6" x2="32" y2="14" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
  <circle class="antenna-dot" cx="32" cy="5" r="3" fill="#22C55E"/>
  <g class="bot-body">
    <rect x="14" y="14" width="36" height="30" rx="10" fill="#fff" stroke="rgba(10,22,40,.08)" stroke-width="1"/>
    <rect x="19" y="19" width="26" height="20" rx="6" fill="#0A1628"/>
    <circle class="eye eye-l" cx="27" cy="29" r="3" fill="#5CB8FF"/>
    <circle class="eye eye-r" cx="37" cy="29" r="3" fill="#5CB8FF"/>
    <path d="M28 34 Q32 37 36 34" stroke="#22C55E" stroke-width="2" stroke-linecap="round" fill="none"/>
    <rect x="10" y="24" width="4" height="10" rx="2" fill="#fff" stroke="rgba(10,22,40,.08)" stroke-width="1"/>
    <rect x="50" y="24" width="4" height="10" rx="2" fill="#fff" stroke="rgba(10,22,40,.08)" stroke-width="1"/>
    <rect x="20" y="44" width="24" height="12" rx="4" fill="#fff" stroke="rgba(10,22,40,.08)" stroke-width="1"/>
    <circle cx="32" cy="50" r="2" fill="#1565E8"/>
  </g>
</svg>`;

const HEADER_SVG = `
<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
  <rect x="14" y="14" width="36" height="30" rx="10" fill="#1565E8"/>
  <rect x="19" y="19" width="26" height="20" rx="6" fill="#0A1628"/>
  <circle cx="27" cy="29" r="3" fill="#5CB8FF"/>
  <circle cx="37" cy="29" r="3" fill="#5CB8FF"/>
  <path d="M28 34 Q32 37 36 34" stroke="#22C55E" stroke-width="2" stroke-linecap="round" fill="none"/>
  <line x1="32" y1="6" x2="32" y2="14" stroke="#1565E8" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="32" cy="5" r="3" fill="#22C55E"/>
</svg>`;

// ── Session ID ────────────────────────────────────────────────────────────────
function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    const rand = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    sid = 'landing_' + rand;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

// ── Load config from backend (non-blocking; falls back to DEFAULTS) ───────────
async function loadConfig() {
  try {
    const res = await fetch(CONFIG_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) return DEFAULTS;
    return { ...DEFAULTS, ...(await res.json()) };
  } catch (_) {
    return DEFAULTS;
  }
}

// ── Build DOM ─────────────────────────────────────────────────────────────────
function buildWidget(cfg) {
  // Tooltip
  const tip = document.createElement('div');
  tip.className = 'bot-tooltip';
  tip.id = 'botTip';
  tip.textContent = cfg.tooltip;

  // FAB
  const fab = document.createElement('button');
  fab.className = 'bot-fab';
  fab.id = 'botFab';
  fab.setAttribute('aria-label', 'Abrir chat de ayuda');
  fab.innerHTML = FAB_SVG + '<span class="badge" id="botBadge" aria-hidden="true">1</span>';

  // Panel
  const panel = document.createElement('div');
  panel.className = 'bot-panel';
  panel.id = 'botPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'botTitle');
  panel.setAttribute('aria-modal', 'true');

  // Render pills HTML
  const pillsHtml = cfg.pills.map(p =>
    `<button class="sugg-pill" data-q="${escAttr(p.question)}" type="button">${escHtml(p.label)}</button>`
  ).join('');

  panel.innerHTML = `
    <div class="bot-header">
      <div class="av">${HEADER_SVG}</div>
      <div class="meta">
        <h4 id="botTitle">${escHtml(cfg.name)}</h4>
        <small>${escHtml(cfg.tagline)}</small>
      </div>
      <button class="close" id="botClose" aria-label="Cerrar chat">✕</button>
    </div>
    <div class="bot-msgs" id="botMsgs" aria-live="polite" aria-atomic="false"></div>
    <div class="bot-pills" id="botPills">${pillsHtml}</div>
    <form class="bot-input" id="botForm" novalidate>
      <input id="botField" type="text" placeholder="Escribe tu pregunta…" autocomplete="off"
             aria-label="Escribe tu mensaje" maxlength="500"/>
      <button type="submit" id="botSend" aria-label="Enviar mensaje">→</button>
    </form>`;

  document.body.appendChild(tip);
  document.body.appendChild(fab);
  document.body.appendChild(panel);

  return { tip, fab, panel };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function escAttr(s) {
  return String(s).replace(/"/g,'&quot;');
}
function formatMsg(text) {
  return escHtml(text)
    .replace(/\n/g,'<br>')
    .replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
}
function addMsg(msgs, text, who) {
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.innerHTML = formatMsg(text);
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}
function addErrorMsg(msgs, text, onRetry) {
  const d = document.createElement('div');
  d.className = 'msg error';
  d.innerHTML = `${escHtml(text)}<button type="button">Reintentar</button>`;
  d.querySelector('button').addEventListener('click', () => { d.remove(); onRetry(); });
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}
function addTyping(msgs) {
  const d = document.createElement('div');
  d.className = 'typing';
  d.setAttribute('aria-label', 'Escribiendo…');
  d.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}

// ── Init ──────────────────────────────────────────────────────────────────────
(async () => {
  const cfg = await loadConfig();
  const { tip, fab } = buildWidget(cfg);

  const panel  = document.getElementById('botPanel');
  const closeB = document.getElementById('botClose');
  const msgs   = document.getElementById('botMsgs');
  const pills  = document.getElementById('botPills');
  const form   = document.getElementById('botForm');
  const field  = document.getElementById('botField');
  const send   = document.getElementById('botSend');
  const badge  = document.getElementById('botBadge');
  const svg    = fab.querySelector('.bot-svg');
  const body   = svg.querySelector('.bot-body');
  const eyeL   = svg.querySelector('.eye-l');
  const eyeR   = svg.querySelector('.eye-r');

  let panelOpen = false;
  let pillsShown = true;

  // Add greeting
  addMsg(msgs, cfg.greeting, 'bot');

  // ── Focus trap elements ──
  function getFocusable() {
    return Array.from(panel.querySelectorAll(
      'button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
    ));
  }

  // ── Open / close ──
  function openPanel() {
    panelOpen = true;
    panel.classList.add('open');
    panel.removeAttribute('aria-hidden');
    fab.setAttribute('aria-expanded', 'true');
    badge.style.display = 'none';
    tip.classList.remove('show');
    setTimeout(() => field.focus(), 300);
  }
  function closePanel() {
    panelOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  }

  panel.setAttribute('aria-hidden', 'true');
  fab.setAttribute('aria-expanded', 'false');

  fab.addEventListener('click', () => panelOpen ? closePanel() : openPanel());
  closeB.addEventListener('click', closePanel);

  // ESC closes panel; Tab traps focus inside
  document.addEventListener('keydown', (e) => {
    if (!panelOpen) return;
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  // ── Tooltip on first visit ──
  setTimeout(() => {
    if (!panelOpen && !sessionStorage.getItem('botTipSeen')) {
      tip.classList.add('show');
      sessionStorage.setItem('botTipSeen', '1');
      setTimeout(() => tip.classList.remove('show'), 4500);
    }
  }, 2500);

  // ── Scroll tilt animation ──
  let lastY = window.scrollY, vel = 0, rafQueued = false;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    vel = vel * 0.7 + (y - lastY) * 0.3;
    lastY = y;
    if (!rafQueued) {
      rafQueued = true;
      requestAnimationFrame(() => {
        rafQueued = false;
        const tilt = Math.max(-12, Math.min(12, vel * 0.5));
        body.style.transform = `rotate(${tilt}deg) translateY(${Math.abs(vel) * 0.05}px)`;
        const ey = Math.max(-1.5, Math.min(1.5, vel * 0.05));
        eyeL.style.transform = `translateY(${ey}px)`;
        eyeR.style.transform = `translateY(${ey}px)`;
      });
    }
  }, { passive: true });
  setInterval(() => {
    vel *= 0.85;
    if (Math.abs(vel) < 0.1) {
      body.style.transform = '';
      eyeL.style.transform = '';
      eyeR.style.transform = '';
    }
  }, 100);

  // ── Send message ──
  async function ask(q) {
    if (pillsShown) {
      pills.style.display = 'none';
      pillsShown = false;
    }
    addMsg(msgs, q, 'user');
    field.value = '';
    send.disabled = true;
    const typing = addTyping(msgs);
    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          message: q,
          sessionId: getSessionId(),
          source: 'landing',
          pageUrl: window.location.href,
        }),
      });
      typing.remove();
      if (!res.ok) throw new Error('http_' + res.status);
      const data = await res.json();
      addMsg(msgs, data.reply || SAFE_ERROR, 'bot');
    } catch (_) {
      typing.remove();
      addErrorMsg(msgs, SAFE_ERROR, () => ask(q));
    }
    send.disabled = false;
    field.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = field.value.trim();
    if (q) ask(q);
  });

  pills.addEventListener('click', (e) => {
    const btn = e.target.closest('.sugg-pill');
    if (btn) ask(btn.dataset.q);
  });
})();
