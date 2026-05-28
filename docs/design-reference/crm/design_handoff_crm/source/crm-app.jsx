/* FONDIX CRM — App shell (sidebar + topbar + env banner + router + tweaks)
   ------------------------------------------------------- */

const NAV = [
  { id:'dashboard',  label:'Dashboard',                icon:'dashboard', view: window.ViewDashboard,        group:'main' },
  { id:'users',      label:'Usuarios',                 icon:'users',     view: window.ViewUsers,            group:'main' },
  { id:'pagos',      label:'Pagos',                    icon:'tx',        view: window.ViewPagos,            group:'main' },
  { id:'recibos',    label:'Recibos',                  icon:'mail',      view: window.ViewRecibos,          group:'main' },
  { id:'busqueda',   label:'Búsqueda',                 icon:'search',    view: window.ViewBusqueda,         group:'main' },
  { id:'tickets',    label:'Tickets',                  icon:'tickets',   view: window.ViewTickets,          group:'main',     badge: 23 },
  { id:'chat',       label:'Chat console',             icon:'chat',      view: window.ViewChatConsole,      group:'main',     badge: 7  },
  { id:'kyc',        label:'Revisión manual',          icon:'shield',    view: window.ViewCompliance,       group:'risk',     badge: 14 },
  { id:'fraude',     label:'Señales fraude',           icon:'warn',      view: window.ViewFraude,           group:'risk',     badge: 5  },
  { id:'disputas',   label:'Disputas',                 icon:'flag',      view: window.ViewDisputas,         group:'risk' },
  { id:'recon-card', label:'Conciliación tarjeta',     icon:'recon',     view: window.ViewReconciliation,   group:'finance' },
  { id:'recon-pp',   label:'Conciliación Prontipagos', icon:'recon',     view: window.ViewConciliacionPP,   group:'finance' },
  { id:'audit',      label:'Audit logs',               icon:'eye',       view: window.ViewAuditLogs,        group:'admin' },
];

const GROUP_LABELS = {
  main:    'Operación',
  risk:    'Riesgo y compliance',
  finance: 'Finanzas',
  admin:   'Administración',
};

const TWEAK_DEFAULTS = {
  dark: false,
  density: 'comfy',
  accent: '#1565E8',
  showDevBanner: true,
  env: 'DEV / SANDBOX',
};

/* ─── Sidebar ─── */
const Sidebar = ({ current, onChange }) => {
  const groups = ['main','risk','finance','admin'];
  return (
    <aside className="crm-sidebar">
      <div style={{padding:'22px 22px 16px'}}>
        <div style={{fontSize:18, fontWeight:800, color:'var(--side-fg)', letterSpacing:'-.015em', lineHeight:1.1}}>
          FondixPay
        </div>
        <div style={{fontSize:11.5, color:'var(--side-muted)', fontWeight:500, marginTop:2, letterSpacing:'.02em'}}>
          CRM Admin
        </div>
      </div>

      <nav style={{flex:1, padding:'0 12px', display:'flex', flexDirection:'column', gap: 1, overflowY:'auto'}}>
        {groups.map(g => (
          <React.Fragment key={g}>
            <div style={{fontSize:10.5, color:'var(--side-muted)', textTransform:'uppercase', letterSpacing:'.08em',
                          fontWeight:600, padding: g === 'main' ? '8px 12px 6px' : '18px 12px 6px'}}>
              {GROUP_LABELS[g]}
            </div>
            {NAV.filter(n => n.group === g).map(n => (
              <button key={n.id} onClick={() => onChange(n.id)} className="side-link"
                      data-active={current === n.id ? 'true' : 'false'}>
                <Icon name={n.icon} size={17}/>
                <span style={{flex:1, textAlign:'left'}}>{n.label}</span>
                {n.badge != null && <span className="side-badge">{n.badge}</span>}
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div style={{padding: 14, borderTop:'1px solid var(--side-border)', display:'flex', alignItems:'center', gap: 10}}>
        <Avatar initials="AV" hue={245} size={34}/>
        <div style={{flex:1, minWidth: 0}}>
          <div style={{fontSize:12.5, fontWeight:600, color:'var(--side-fg)'}}>Ana Vega</div>
          <div style={{fontSize:10.5, color:'var(--side-muted)'}}>ana.vega@fondix.mx</div>
        </div>
      </div>
    </aside>
  );
};

/* ─── Topbar — env pills + role + logout ─── */
const Topbar = ({ env, dark, setDark, onLogout }) => (
  <header className="crm-topbar">
    {/* search */}
    <div style={{position:'relative', flex:'1 1 auto', maxWidth: 420}}>
      <Icon name="search" size={16} style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--fg-3)'}}/>
      <input placeholder="Buscar transacción, usuario, ticket…"
             className="input-base" style={{paddingLeft: 36, width:'100%'}}/>
      <span style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                     fontSize:10.5, color:'var(--fg-3)', fontFamily:'var(--font-mono)',
                     padding:'2px 6px', background:'var(--surf-2)', borderRadius:5}}>⌘K</span>
    </div>

    {/* env + role + actions */}
    <div style={{display:'flex', alignItems:'center', gap: 10, marginLeft:'auto'}}>
      <button className="icon-btn" onClick={() => setDark(!dark)} title={dark ? 'Tema claro' : 'Tema oscuro'}>
        <Icon name={dark ? 'sun' : 'moon'} size={17}/>
      </button>
      <button className="icon-btn" style={{position:'relative'}}>
        <Icon name="bell" size={17}/>
        <span style={{position:'absolute', top:8, right:8, width:8, height:8, borderRadius:'50%', background:'#EF4444', border:'2px solid var(--surf-0)'}}></span>
      </button>

      <div style={{width:1, height:24, background:'var(--border)', margin:'0 4px'}}></div>

      <span className="env-pill env-pill-warn">
        <span className="env-pill-dot"></span>
        {env}
      </span>
      <span className="env-pill env-pill-role">SUPER_ADMIN</span>
      <button className="logout-btn" onClick={onLogout}>Salir</button>
    </div>
  </header>
);

/* ─── DEV banner ─── */
const DevBanner = ({ onClose }) => (
  <div className="dev-banner">
    <Icon name="warn" size={16}/>
    <div style={{flex:1}}>
      <strong style={{fontWeight:700}}>Operación interna</strong>
      <span style={{opacity:.85, marginLeft: 8}}>·</span>
      <span style={{opacity:.85, marginLeft: 8}}>DEV AUTH habilitado. No usar en producción.</span>
    </div>
    <button onClick={onClose} className="dev-banner-close" aria-label="Ocultar">
      <Icon name="close" size={14}/>
    </button>
  </div>
);

/* ─── App ─── */
const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [current, setCurrent] = useState('dashboard');
  const navItem = NAV.find(n => n.id === current);
  const Active = navItem.view;

  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    r.setAttribute('data-density', t.density);
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-tint', t.accent + '15');
  }, [t.dark, t.density, t.accent]);

  return (
    <div className="crm-app">
      <Sidebar current={current} onChange={setCurrent}/>
      <main className="crm-main">
        <Topbar env={t.env} dark={t.dark}
                setDark={v => setTweak('dark', v)}
                onLogout={() => alert('Demo · sesión cerrada')}/>
        {t.showDevBanner && <DevBanner onClose={() => setTweak('showDevBanner', false)}/>}
        <div className="crm-content">
          <Active/>
        </div>
      </main>

      <TweaksPanel>
        <TweakSection label="Apariencia"/>
        <TweakToggle label="Modo oscuro" value={t.dark}
                     onChange={v => setTweak('dark', v)}/>
        <TweakRadio  label="Densidad" value={t.density}
                     options={['comfy','compact']}
                     onChange={v => setTweak('density', v)}/>
        <TweakColor  label="Color de acento" value={t.accent}
                     options={['#1565E8','#0EA5E9','#7C3AED','#22C55E','#F59E0B']}
                     onChange={v => setTweak('accent', v)}/>

        <TweakSection label="Entorno"/>
        <TweakRadio label="Ambiente" value={t.env}
                    options={['DEV / SANDBOX','STAGING','PRODUCTION']}
                    onChange={v => setTweak('env', v)}/>
        <TweakToggle label="Mostrar banner DEV" value={t.showDevBanner}
                     onChange={v => setTweak('showDevBanner', v)}/>

        <TweakSection label="Navegación"/>
        <TweakSelect label="Vista activa" value={current}
                     options={NAV.map(n => ({ value: n.id, label: n.label }))}
                     onChange={setCurrent}/>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
