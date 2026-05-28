/* FONDIX CRM — Atomic UI components
   Loaded with Babel. Exposes atoms to window.
   ------------------------------------------------------- */

const { useState, useEffect, useRef, useMemo } = React;

/* ───── Icons (stroke-based, 20px default) ───── */
const Icon = ({ name, size = 18, ...rest }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    users:    <><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.4 2.7-5.5 6-5.5s6 2.1 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M15 14.5c2.5.2 5 1.8 5 4.5"/></>,
    tx:       <><path d="M3 7h13l-3-3M21 17H8l3 3"/></>,
    recon:    <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h4M8 16h7"/></>,
    tickets:  <><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v12" strokeDasharray="2 2"/></>,
    chat:     <><path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1 4.4A8 8 0 0 1 21 12z"/><circle cx="9" cy="12" r=".8" fill="currentColor"/><circle cx="13" cy="12" r=".8" fill="currentColor"/><circle cx="17" cy="12" r=".8" fill="currentColor"/></>,
    shield:   <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/></>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    bell:     <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    moon:     <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>,
    sun:      <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.42-1.42"/></>,
    chevron:  <><path d="m9 6 6 6-6 6"/></>,
    chevDown: <><path d="m6 9 6 6 6-6"/></>,
    close:    <><path d="M6 6l12 12M18 6L6 18"/></>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    download: <><path d="M12 4v12M6 12l6 6 6-6M5 20h14"/></>,
    filter:   <><path d="M4 5h16M7 12h10M10 19h4"/></>,
    refresh:  <><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></>,
    check:    <><path d="m4 12 5 5 11-12"/></>,
    warn:     <><path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.5"/></>,
    refund:   <><path d="M9 14H3v6"/><path d="M3 20a9 9 0 0 0 15-3.7"/><path d="M15 10h6V4"/><path d="M21 4a9 9 0 0 0-15 3.7"/></>,
    flag:     <><path d="M4 21V4l14 4-6 4 6 4z"/></>,
    sparkle:  <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>,
    grid:     <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    arrowUp:  <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDn:  <><path d="M12 5v14M5 12l7 7 7-7"/></>,
    dots:     <><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></>,
    send:     <><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></>,
    eye:      <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    upload:   <><path d="M12 20V8M6 12l6-6 6 6M5 4h14"/></>,
    phone:    <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></>,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    whatsapp: <><path d="M3 21l1.5-5A8 8 0 1 1 8 19.5z"/><path d="M9 9c0 4 3 7 7 7l1.5-1.5-2.5-1.5-1 1c-1-.4-1.6-1-2-2l1-1L11.5 8.5 10 9z" fill="currentColor"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name]}
    </svg>
  );
};

/* ───── Avatar (initials + brand-tinted) ───── */
const Avatar = ({ initials, hue = 220, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: `linear-gradient(135deg, hsl(${hue} 78% 62%), hsl(${hue+30} 70% 48%))`,
    color: '#fff', display:'inline-flex', alignItems:'center', justifyContent:'center',
    fontWeight: 600, fontSize: size * 0.4, flexShrink: 0,
    boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.15)',
  }}>{initials}</div>
);

/* ───── Badge ───── */
const Badge = ({ tone = 'neutral', children, dot = false }) => {
  const tones = {
    success:  { bg:'rgba(34,197,94,.12)',  fg:'#15803D', dot:'#22C55E' },
    pending:  { bg:'rgba(245,158,11,.14)', fg:'#92560A', dot:'#F59E0B' },
    danger:   { bg:'rgba(239,68,68,.12)',  fg:'#B91C1C', dot:'#EF4444' },
    info:     { bg:'rgba(21,101,232,.10)', fg:'#0D4FBF', dot:'#1565E8' },
    neutral:  { bg:'var(--surf-2)',        fg:'var(--fg-2)', dot:'var(--fg-3)' },
    refunded: { bg:'rgba(124,58,237,.12)', fg:'#5B21B6', dot:'#7C3AED' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap: 5,
      padding: '2px 9px 3px', borderRadius: 999,
      background: t.bg, color: t.fg,
      fontSize: 11.5, fontWeight: 600, letterSpacing: '.01em',
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{width:6,height:6,borderRadius:'50%',background:t.dot}}></span>}
      {children}
    </span>
  );
};

/* ───── Card ───── */
const Card = ({ children, title, action, padding = 18, style }) => (
  <div style={{
    background:'var(--surf-1)', border:'1px solid var(--border)',
    borderRadius: 14, overflow:'hidden',
    ...style,
  }}>
    {(title || action) && (
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',
                   padding: '14px 18px 12px', borderBottom: '1px solid var(--border)'}}>
        <h3 style={{margin:0, fontSize:14, fontWeight:600, color:'var(--fg-1)', letterSpacing:'-.005em'}}>{title}</h3>
        {action}
      </div>
    )}
    <div style={{padding}}>{children}</div>
  </div>
);

/* ───── KPI tile ───── */
const KPI = ({ label, value, delta, deltaTone = 'success', sub, sparkline }) => (
  <div style={{
    background:'var(--surf-1)', border:'1px solid var(--border)',
    borderRadius: 14, padding: 18, display:'flex', flexDirection:'column', gap: 4, minHeight: 122,
    position:'relative', overflow:'hidden',
  }}>
    <div style={{fontSize:11.5, fontWeight:600, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'.05em'}}>{label}</div>
    <div style={{fontFamily:'var(--font-mono)', fontSize:28, fontWeight:700, color:'var(--fg-1)', letterSpacing:'-.02em', lineHeight:1.1, marginTop:2}}>{value}</div>
    {(delta || sub) && (
      <div style={{display:'flex', alignItems:'center', gap:8, marginTop:'auto', fontSize:12}}>
        {delta && (
          <span style={{color: deltaTone==='success'?'#15803D':deltaTone==='danger'?'#B91C1C':'var(--fg-2)',
                        fontWeight:600, display:'inline-flex', alignItems:'center', gap:2}}>
            <Icon name={deltaTone==='success'?'arrowUp':deltaTone==='danger'?'arrowDn':'sparkle'} size={12}/>
            {delta}
          </span>
        )}
        {sub && <span style={{color:'var(--fg-3)'}}>{sub}</span>}
      </div>
    )}
    {sparkline && <div style={{position:'absolute', right:0, bottom:0, opacity:.85, pointerEvents:'none'}}>{sparkline}</div>}
  </div>
);

/* ───── Sparkline (inline SVG) ───── */
const Sparkline = ({ data, w = 110, h = 38, color = 'var(--accent)' }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ]);
  const path = pts.map((p,i) => `${i===0?'M':'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;
  const id = useMemo(() => 'sl' + Math.random().toString(36).slice(2,8), []);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor={color} stopOpacity=".25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area}  fill={`url(#${id})`}/>
      <path d={path}  fill="none" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
};

/* ───── Line chart (TPV / time series) ───── */
const LineChart = ({ data, h = 220, format = v => v, accent = 'var(--accent)' }) => {
  const padL = 50, padR = 14, padT = 14, padB = 26;
  const ref = useRef(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(es => setW(es[0].contentRect.width));
    ro.observe(ref.current); return () => ro.disconnect();
  }, []);
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value)) * 0.94;
  const range = max - min || 1;
  const x = i => padL + (i / (data.length - 1)) * (w - padL - padR);
  const y = v => padT + (h - padT - padB) * (1 - (v - min) / range);
  const path = data.map((d,i) => `${i===0?'M':'L'} ${x(i)} ${y(d.value)}`).join(' ');
  const area = path + ` L ${x(data.length-1)} ${h - padB} L ${padL} ${h - padB} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(p => min + range * p);
  const id = useMemo(() => 'lc' + Math.random().toString(36).slice(2,8), []);

  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const i = Math.round(((mx - padL) / (w - padL - padR)) * (data.length - 1));
    if (i >= 0 && i < data.length) setHover(i);
  };

  return (
    <div ref={ref} style={{position:'relative', width:'100%'}} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg width={w} height={h} style={{display:'block', overflow:'visible'}}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity=".22"/>
            <stop offset="100%" stopColor={accent} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {ticks.map((t,i) => (
          <g key={i}>
            <line x1={padL} x2={w-padR} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray="2 4"/>
            <text x={padL-8} y={y(t)+4} fontSize="10" fill="var(--fg-3)" textAnchor="end" fontFamily="var(--font-mono)">{format(t)}</text>
          </g>
        ))}
        <path d={area} fill={`url(#${id})`}/>
        <path d={path} fill="none" stroke={accent} strokeWidth="2"/>
        {data.map((d,i) => i % 5 === 0 && (
          <text key={i} x={x(i)} y={h-8} fontSize="10" fill="var(--fg-3)" textAnchor="middle">
            {d.label ?? `D-${d.day ?? i}`}
          </text>
        ))}
        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={h-padB} stroke={accent} strokeOpacity=".5"/>
            <circle cx={x(hover)} cy={y(data[hover].value)} r="5" fill="#fff" stroke={accent} strokeWidth="2.5"/>
          </g>
        )}
      </svg>
      {hover != null && (
        <div style={{position:'absolute', left: Math.min(w-140, Math.max(0, x(hover) - 60)), top: 0,
                     background:'var(--fg-1)', color:'var(--surf-0)', padding:'7px 10px', borderRadius:8,
                     fontSize:11.5, pointerEvents:'none', whiteSpace:'nowrap', boxShadow:'0 6px 14px rgba(10,22,40,.18)'}}>
          <div style={{opacity:.7, fontSize:10, marginBottom:2}}>{data[hover].label ?? `Día -${data[hover].day}`}</div>
          <div style={{fontFamily:'var(--font-mono)', fontWeight:700}}>{format(data[hover].value)}</div>
        </div>
      )}
    </div>
  );
};

/* ───── Horizontal bars (categories) ───── */
const BarsH = ({ data, format = v => v }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{display:'flex', flexDirection:'column', gap: 10}}>
      {data.map(d => (
        <div key={d.name} style={{display:'grid', gridTemplateColumns:'130px 1fr 110px', alignItems:'center', gap: 12}}>
          <div style={{display:'flex', alignItems:'center', gap: 8, fontSize: 13, color:'var(--fg-1)'}}>
            <span style={{width:8, height:8, borderRadius:2, background: d.color}}></span>
            {d.name}
          </div>
          <div style={{height: 10, background:'var(--surf-2)', borderRadius: 99, overflow:'hidden'}}>
            <div style={{height:'100%', width: `${(d.value/max)*100}%`, background: d.color, borderRadius: 99,
                         transition: 'width .6s var(--ease-out)'}}></div>
          </div>
          <div style={{fontFamily:'var(--font-mono)', fontSize: 12.5, fontWeight: 600, textAlign:'right', color:'var(--fg-1)'}}>
            {format(d.value)}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ───── Drawer (slide-in from right) ───── */
const Drawer = ({ open, onClose, title, children, width = 480 }) => (
  <>
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(10,22,40,.45)',
      opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
      transition:'opacity .25s var(--ease-out)', zIndex: 100,
    }}/>
    <aside style={{
      position:'fixed', right:0, top:0, height:'100vh', width: `min(${width}px, 100vw)`,
      background:'var(--surf-0)', borderLeft:'1px solid var(--border)',
      boxShadow:'-20px 0 60px rgba(10,22,40,.18)',
      transform: open ? 'translateX(0)' : 'translateX(110%)',
      transition:'transform .35s var(--ease-out)',
      zIndex: 101, display:'flex', flexDirection:'column',
    }}>
      <header style={{padding:'18px 22px', borderBottom:'1px solid var(--border)',
                      display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <h2 style={{margin:0, fontSize:17, fontWeight:600}}>{title}</h2>
        <button onClick={onClose} style={{background:'transparent', border:'none', color:'var(--fg-2)',
                cursor:'pointer', padding:6, borderRadius:8}} aria-label="Cerrar">
          <Icon name="close" size={20}/>
        </button>
      </header>
      <div style={{flex:1, overflowY:'auto', padding:22}}>{children}</div>
    </aside>
  </>
);

/* ───── Modal (centered) ───── */
const Modal = ({ open, onClose, title, children, width = 480, footer }) => open && (
  <div onClick={onClose} style={{
    position:'fixed', inset:0, background:'rgba(10,22,40,.55)',
    zIndex: 110, display:'flex', alignItems:'center', justifyContent:'center', padding: 20,
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background:'var(--surf-0)', borderRadius: 18, width:`min(${width}px, 100%)`,
      boxShadow:'0 30px 70px rgba(10,22,40,.4)', overflow:'hidden',
      animation: 'modal-in .25s var(--ease-spring)',
    }}>
      <header style={{padding:'18px 22px', borderBottom:'1px solid var(--border)',
                      display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <h2 style={{margin:0, fontSize:17, fontWeight:600}}>{title}</h2>
        <button onClick={onClose} style={{background:'transparent', border:'none', color:'var(--fg-2)',
                cursor:'pointer', padding:6, borderRadius:8}}>
          <Icon name="close" size={20}/>
        </button>
      </header>
      <div style={{padding:22}}>{children}</div>
      {footer && <div style={{padding:'14px 22px', borderTop:'1px solid var(--border)', background:'var(--surf-2)',
                              display:'flex', gap:10, justifyContent:'flex-end'}}>{footer}</div>}
    </div>
  </div>
);

/* ───── Button ───── */
const Btn = ({ variant = 'secondary', icon, children, ...rest }) => {
  const styles = {
    primary:   { background:'var(--accent)', color:'#fff', border:'1px solid var(--accent)' },
    secondary: { background:'var(--surf-0)', color:'var(--fg-1)', border:'1px solid var(--border)' },
    ghost:     { background:'transparent', color:'var(--fg-1)', border:'1px solid transparent' },
    danger:    { background:'#EF4444', color:'#fff', border:'1px solid #EF4444' },
  };
  return (
    <button {...rest} style={{
      ...styles[variant], padding: '8px 14px', borderRadius: 10, cursor:'pointer',
      font: 'inherit', fontSize: 13, fontWeight: 600,
      display:'inline-flex', alignItems:'center', gap: 7,
      transition:'background .15s, transform .1s',
      ...rest.style,
    }}>
      {icon && <Icon name={icon} size={15}/>}
      {children}
    </button>
  );
};

/* ───── Status pill (for tx) ───── */
const TxStatus = ({ status }) => {
  const map = {
    success:  { tone:'success',  label:'Exitosa' },
    pending:  { tone:'pending',  label:'Pendiente' },
    failed:   { tone:'danger',   label:'Fallida' },
    refunded: { tone:'refunded', label:'Reembolsada' },
  };
  const m = map[status] || map.pending;
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
};

/* ───── Channel chip ───── */
const ChannelChip = ({ channel }) => {
  const cfg = {
    chat:     { icon:'chat',     label:'Chat',     color:'#1565E8' },
    whatsapp: { icon:'whatsapp', label:'WhatsApp', color:'#22C55E' },
    email:    { icon:'mail',     label:'Email',    color:'#7C3AED' },
  };
  const c = cfg[channel] || cfg.chat;
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap: 5, fontSize:12, color:'var(--fg-2)'}}>
      <span style={{color: c.color}}><Icon name={c.icon} size={13}/></span>
      {c.label}
    </span>
  );
};

Object.assign(window, { Icon, Avatar, Badge, Card, KPI, Sparkline, LineChart, BarsH, Drawer, Modal, Btn, TxStatus, ChannelChip });
